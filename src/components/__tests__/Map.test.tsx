import React from 'react'
import { render, screen } from '@/__tests__/utils/test-utils'
import Map from '../Map'
import { createMockMines } from '@/__tests__/utils/test-utils'

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}))

describe('Map Component', () => {
  const mockMines = createMockMines(3)

  it('renders the map container', () => {
    render(<Map mines={mockMines} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument()
  })

  it('renders markers for each mine', () => {
    render(<Map mines={mockMines} />)

    const markers = screen.getAllByTestId('marker')
    expect(markers).toHaveLength(mockMines.length)
  })

  it('renders popups for each mine', () => {
    render(<Map mines={mockMines} />)

    const popups = screen.getAllByTestId('popup')
    expect(popups).toHaveLength(mockMines.length)
  })

  it('displays mine information in popups', () => {
    render(<Map mines={mockMines} />)

    expect(screen.getByText('Test Mine 1')).toBeInTheDocument()
    expect(screen.getByText('Test Mine 2')).toBeInTheDocument()
    expect(screen.getByText('Test Mine 3')).toBeInTheDocument()
  })

  it('displays mine type in popups', () => {
    render(<Map mines={mockMines} />)

    expect(screen.getByText('Gold')).toBeInTheDocument()
    expect(screen.getByText('Copper')).toBeInTheDocument()
    expect(screen.getByText('Iron')).toBeInTheDocument()
  })

  it('displays mine status in popups', () => {
    render(<Map mines={mockMines} />)

    expect(screen.getAllByText('Active')).toHaveLength(mockMines.length)
  })

  it('handles empty mines array', () => {
    render(<Map mines={[]} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument()
  })

  it('displays country information in popups', () => {
    render(<Map mines={mockMines} />)

    expect(screen.getAllByText('USA')).toHaveLength(mockMines.length)
  })

  it('displays region information when available', () => {
    const minesWithRegion = mockMines.map(mine => ({ ...mine, region: 'Test Region' }))
    render(<Map mines={minesWithRegion} />)

    expect(screen.getAllByText('Test Region')).toHaveLength(minesWithRegion.length)
  })

  it('displays production information when available', () => {
    const minesWithProduction = mockMines.map(mine => ({ ...mine, production: '1000 oz/year' }))
    render(<Map mines={minesWithProduction} />)

    expect(screen.getAllByText('1000 oz/year')).toHaveLength(minesWithProduction.length)
  })

  it('handles mines without optional fields', () => {
    const minimalMines = mockMines.map(mine => ({
      id: mine.id,
      name: mine.name,
      type: mine.type,
      latitude: mine.latitude,
      longitude: mine.longitude,
      country: mine.country,
      status: mine.status,
    }))
    
    render(<Map mines={minimalMines} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getAllByTestId('marker')).toHaveLength(minimalMines.length)
  })
}) 