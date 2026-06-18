import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('root route', () => {
  it('renders Outlet content', async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <div data-testid="root">
          ROOT <Outlet />
        </div>
      ),
    })
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <span>INDEX</span>,
    })
    const router = createRouter({
      routeTree: rootRoute.addChildren([indexRoute]),
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    const qc = new QueryClient()
    render(
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(await screen.findByTestId('root')).toBeTruthy()
    expect(await screen.findByText('INDEX')).toBeTruthy()
  })
})
