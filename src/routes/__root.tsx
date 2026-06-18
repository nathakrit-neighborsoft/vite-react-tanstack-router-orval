import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b p-4">
        <a href="/" className="font-bold">
          Drone Monorepo
        </a>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  ),
})
