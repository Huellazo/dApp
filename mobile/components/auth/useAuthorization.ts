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
  }
}

export function useAuthorization() {
  const [authorization, setAuthorization] = useState<AuthorizationResult | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  
  // For Web
  const [webWalletAddress, setWebWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && window.solana?.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then((res: { publicKey: PublicKey }) => {
        setWebWalletAddress(res.publicKey.toString());
      }).catch(() => {
        // Not trusted yet
      });
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

  const authorize = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (window.solana?.isPhantom) {
        setIsAuthorizing(true);
        try {
          const resp = await window.solana.connect();
          setWebWalletAddress(resp.publicKey.toString());
          return resp.publicKey.toString();
        } catch (err) {
          console.error('Phantom connect error:', err);
        } finally {
          setIsAuthorizing(false);
        }
      } else {
        alert('Phantom wallet is not installed in your browser.');
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
  }, [authorizeSession]);

  const deauthorizeSession = useCallback(async (wallet: any) => {
    if (authorization?.auth_token) {
      await wallet.deauthorize({ auth_token: authorization.auth_token });
    }
    setAuthorization(null);
  }, [authorization]);

  const deauthorize = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (window.solana?.isPhantom) {
        await window.solana.disconnect();
      }
      setWebWalletAddress(null);
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
  }, [authorization, deauthorizeSession]);
  
  // Expose an account object that looks like MWA's account, so our codebase works
  // transparently for web and mobile.
  const selectedAccount = Platform.OS === 'web' && webWalletAddress ? {
    address: webWalletAddress,
    publicKey: webWalletAddress, // for auth-provider web3.js parsing
    label: 'Phantom Web',
  } as any : authorization?.accounts[0] ?? null;

  return {
    authorization,
    authorize,
    deauthorize,
    isAuthorizing,
    selectedAccount,
    webWalletAddress,
  };
}

