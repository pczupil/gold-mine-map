import React from 'react'
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import Header from '../Header'
import { mockSession, mockUnauthenticatedSession } from '@/__tests__/utils/test-utils'

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}))

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the header with logo and title', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)

    render(<Header />)

    expect(screen.getByText('Gold Mine Map')).toBeInTheDocument()
    expect(screen.getByText('Global Mineral Tracking')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // MapPin icon
  })

  it('displays user information when authenticated', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)

    render(<Header />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('does not display user information when not authenticated', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockUnauthenticatedSession)

    render(<Header />)

    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument()
  })

  it('calls signOut when sign out button is clicked', () => {
    const { useSession, signOut } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)
    signOut.mockResolvedValue(undefined)

    render(<Header />)

    const signOutButton = screen.getByText('Sign out')
    fireEvent.click(signOutButton)

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/auth/signin' })
  })

  it('renders children when provided', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)

    render(
      <Header>
        <div data-testid="child-content">Child Content</div>
      </Header>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue({ data: null, status: 'loading' })

    render(<Header />)

    // Should still render the header even in loading state
    expect(screen.getByText('Gold Mine Map')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)

    render(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b')
  })

  it('is responsive with proper mobile styling', () => {
    const { useSession } = require('next-auth/react')
    useSession.mockReturnValue(mockSession)

    render(<Header />)

    const container = screen.getByRole('banner').querySelector('.max-w-7xl')
    expect(container).toHaveClass('flex-col', 'sm:flex-row')
  })
}) 