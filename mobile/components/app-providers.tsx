import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { AppTheme } from '@/components/app-theme'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ToastProvider } from '@/components/toast/toast-provider'
import { LanguageProvider } from '@/context/language-context'
import { AppStateProvider } from '@/context/app-state'
import { AppConfig } from '@/constants/app-config'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <AppStateProvider>
              <ToastProvider>{children}</ToastProvider>
            </AppStateProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppTheme>
  )
}
