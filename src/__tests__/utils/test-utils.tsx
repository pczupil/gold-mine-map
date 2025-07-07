import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock session data
const mockSession = {
  data: {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  status: 'authenticated' as const,
}

// Mock unauthenticated session
const mockUnauthenticatedSession = {
  data: null,
  status: 'unauthenticated' as const,
}

// Custom render function that includes providers
const AllTheProviders = ({ children, session = mockSession }: { children: React.ReactNode; session?: any }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { session?: any }
) => {
  const { session, ...renderOptions } = options || {}
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders session={session}>{children}</AllTheProviders>,
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Export mock sessions for use in tests
export { mockSession, mockUnauthenticatedSession }

// Helper function to create mock mine data
export const createMockMine = (overrides = {}) => ({
  id: '1',
  name: 'Test Mine',
  type: 'Gold',
  latitude: 40.7128,
  longitude: -74.0060,
  country: 'USA',
  region: 'New York',
  production: '1000 oz/year',
  status: 'Active',
  description: 'A test gold mine',
  website: 'https://example.com',
  photoUrls: [],
  photos: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  ...overrides,
})

// Helper function to create mock mines array
export const createMockMines = (count = 3) => 
  Array.from({ length: count }, (_, i) => 
    createMockMine({
      id: (i + 1).toString(),
      name: `Test Mine ${i + 1}`,
      type: ['Gold', 'Copper', 'Iron'][i % 3],
    })
  ) 