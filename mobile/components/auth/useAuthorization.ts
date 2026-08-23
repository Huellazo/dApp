import { useCallback, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Account, AuthorizationResult } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { PublicKey } from '@solana/web3.js';
import { AppConfig } from '@/constants/app-config';

// Add type for window.solana
declare global {
  interface Window {
    solana?: any;
    phantom?: { solana?: any };
    solflare?: any;
  }
}

export interface WebWalletProvider {
  id: string;
  name: string;
  icon: string;
  provider: any;
}

export function useAuthorization() {
  const [authorization, setAuthorization] = useState<AuthorizationResult | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  
  // For Web
  const [webWalletAddress, setWebWalletAddress] = useState<string | null>(null);
  const [activeWebWallet, setActiveWebWallet] = useState<any>(null);
  const [availableWebWallets, setAvailableWebWallets] = useState<WebWalletProvider[]>([]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const wallets: WebWalletProvider[] = [];
      
      // Check for Phantom
      const phantomProvider = window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null);
      if (phantomProvider) {
        wallets.push({
          id: 'phantom',
          name: 'Phantom',
          icon: 'phantom-icon', // Just an identifier, UI will render appropriate icon
          provider: phantomProvider,
        });
      }
      
      // Check for Solflare
      if (window.solflare) {
        wallets.push({
          id: 'solflare',
          name: 'Solflare',
          icon: 'solflare-icon',
          provider: window.solflare,
        });
      }
      
      setAvailableWebWallets(wallets);

      // Auto-connect prioritizing stored user choice
      const savedWalletId = typeof window !== 'undefined' ? localStorage.getItem('huellazo_selected_wallet') : null;

      if (savedWalletId === 'solflare' && window.solflare) {
        window.solflare.connect({ onlyIfTrusted: true }).then(() => {
          if (window.solflare.publicKey) {
            setWebWalletAddress(window.solflare.publicKey.toString());
            setActiveWebWallet(window.solflare);
          }
        }).catch(() => {});
      } else if (phantomProvider) {
        phantomProvider.connect({ onlyIfTrusted: true }).then((res: { publicKey: PublicKey }) => {
          setWebWalletAddress(res.publicKey.toString());
          setActiveWebWallet(phantomProvider);
        }).catch(() => {});
      } else if (window.solflare) {
        window.solflare.connect({ onlyIfTrusted: true }).then(() => {
          if (window.solflare.publicKey) {
            setWebWalletAddress(window.solflare.publicKey.toString());
            setActiveWebWallet(window.solflare);
          }
        }).catch(() => {});
      }
    }
  }, []);

  const handleAuthorizationResult = useCallback(
    async (authResult: AuthorizationResult): Promise<AuthorizationResult> => {
      const selectedAccount = authResult.accounts[0];
      if (!selectedAccount) {
        throw new Error('No account found in authorization result');
      }
      setAuthorization(authResult);
      return authResult;
    },
    []
  );

  const authorizeSession = useCallback(async (wallet: any) => {
    const authResult = await wallet.authorize({
      cluster: AppConfig.clusters[0].id,
      identity: {
        name: AppConfig.name,
        uri: AppConfig.uri,
      },
    });
    return handleAuthorizationResult(authResult);
  }, [handleAuthorizationResult]);

  const authorize = useCallback(async (walletId?: string) => {
    if (Platform.OS === 'web') {
      setIsAuthorizing(true);
      try {
        let provider = activeWebWallet;
        
        // If a specific walletId is requested, find it
        if (walletId) {
          const found = availableWebWallets.find(w => w.id === walletId);
          if (found) {
            provider = found.provider;
          } else {
            throw new Error(`Wallet ${walletId} is not installed`);
          }
        }
        
        // If no provider is active and no walletId specified, default to Phantom if available
        if (!provider && availableWebWallets.length > 0) {
          provider = availableWebWallets.find(w => w.id === 'phantom')?.provider || availableWebWallets[0].provider;
        }

        if (provider) {
          const resp = await provider.connect();
          const pubKey = resp.publicKey ? resp.publicKey.toString() : provider.publicKey?.toString();
          if (pubKey) {
            setWebWalletAddress(pubKey);
            setActiveWebWallet(provider);
            const chosenId = provider.isSolflare ? 'solflare' : 'phantom';
            if (typeof window !== 'undefined') {
              localStorage.setItem('huellazo_selected_wallet', chosenId);
            }
            return pubKey;
          }
        } else {
          alert('No supported Solana wallet is installed in your browser.');
        }
      } catch (err) {
        console.error('Wallet connect error:', err);
      } finally {
        setIsAuthorizing(false);
      }
      return;
    }

    setIsAuthorizing(true);
    try {
      const result = await transact(async (wallet) => {
        return await authorizeSession(wallet);
      });
      return result;
    } catch (error) {
      console.error('Authorization failed:', error);
      throw error;
    } finally {
      setIsAuthorizing(false);
    }
  }, [authorizeSession, activeWebWallet, availableWebWallets]);

  const deauthorizeSession = useCallback(async (wallet: any) => {
    if (authorization?.auth_token) {
      await wallet.deauthorize({ auth_token: authorization.auth_token });
    }
    setAuthorization(null);
  }, [authorization]);

  const deauthorize = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (activeWebWallet) {
        await activeWebWallet.disconnect();
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('huellazo_selected_wallet');
      }
      setWebWalletAddress(null);
      setActiveWebWallet(null);
      setAuthorization(null);
      return;
    }

    setIsAuthorizing(true);
    try {
      if (authorization?.auth_token) {
        await transact(async (wallet) => {
          await deauthorizeSession(wallet);
        });
      }
    } finally {
      setAuthorization(null);
      setIsAuthorizing(false);
    }
  }, [authorization, deauthorizeSession, activeWebWallet]);
  
  // Expose an account object that looks like MWA's account, so our codebase works
  // transparently for web and mobile.
  const selectedAccount = Platform.OS === 'web' && webWalletAddress ? {
    address: webWalletAddress,
    publicKey: webWalletAddress, // for auth-provider web3.js parsing
    label: activeWebWallet?.isPhantom ? 'Phantom' : (activeWebWallet?.isSolflare ? 'Solflare' : 'Web Wallet'),
  } as any : authorization?.accounts[0] ?? null;

  return {
    authorization,
    authorize,
    deauthorize,
    isAuthorizing,
    selectedAccount,
    webWalletAddress,
    activeWebWallet,
    availableWebWallets,
  };
}

