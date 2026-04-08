import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { Toast } from '#/components/Toast'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { AuthProvider } from '#/context/AuthContext'

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient()



function RootComponent() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toast />
          <Outlet />
        </AuthProvider>
      </QueryClientProvider>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
