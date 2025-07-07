# Testing Guide

This project includes comprehensive automated testing using both Jest (unit/component tests) and Playwright (end-to-end tests).

## Test Structure

```
├── src/
│   ├── __tests__/
│   │   ├── utils/
│   │   │   └── test-utils.tsx          # Test utilities and helpers
│   │   └── components/
│   │       ├── Header.test.tsx         # Header component tests
│   │       └── Map.test.tsx            # Map component tests
│   └── app/api/__tests__/
│       └── mines.test.ts               # API route tests
├── tests/
│   └── e2e/
│       ├── home.spec.ts                # Home page e2e tests
│       ├── add-mine.spec.ts            # Add mine page e2e tests
│       └── mine-detail.spec.ts         # Mine detail page e2e tests
├── jest.config.js                      # Jest configuration
├── jest.setup.js                       # Jest setup and mocks
└── playwright.config.ts                # Playwright configuration
```

## Running Tests

### Unit/Component Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run e2e tests in debug mode
npm run test:e2e:debug

# Install Playwright browsers (first time only)
npx playwright install
```

## Test Types

### 1. Unit/Component Tests (Jest)

These tests focus on individual components and functions:

- **Component Tests**: Test React components in isolation
- **API Route Tests**: Test API endpoints with mocked data
- **Utility Tests**: Test helper functions and utilities

#### Example Component Test

```typescript
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import Header from '../Header'

describe('Header Component', () => {
  it('renders the header with logo and title', () => {
    render(<Header />)
    expect(screen.getByText('Gold Mine Map')).toBeInTheDocument()
  })
})
```

### 2. End-to-End Tests (Playwright)

These tests simulate real user interactions across the entire application:

- **Page Navigation**: Test routing and navigation
- **Form Interactions**: Test form filling and submission
- **API Integration**: Test real API calls with mocked responses
- **Responsive Design**: Test mobile and desktop layouts

#### Example E2E Test

```typescript
import { test, expect } from '@playwright/test'

test('should create a new mine', async ({ page }) => {
  await page.goto('/mines/add')
  await page.getByLabel('Mine Name *').fill('Test Mine')
  await page.getByRole('button', { name: 'Create Mine' }).click()
  await expect(page.getByText('Mine created successfully!')).toBeVisible()
})
```

## Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that includes all necessary providers:

```typescript
import { render } from '@/__tests__/utils/test-utils'

// Renders component with NextAuth session provider
render(<MyComponent />, { session: mockSession })
```

### Mock Data Helpers

```typescript
import { createMockMine, createMockMines } from '@/__tests__/utils/test-utils'

const mockMine = createMockMine({ name: 'Custom Mine' })
const mockMines = createMockMines(5)
```

## Mocking Strategy

### API Mocks

- **Jest**: Mock Prisma client and NextAuth
- **Playwright**: Mock API responses using `page.route()`

### External Dependencies

- **Leaflet**: Mocked to avoid DOM issues in tests
- **Cloudinary**: Mocked upload widget
- **NextAuth**: Mocked session management

## Test Coverage

### Components Tested

- ✅ Header component
- ✅ Map component
- ✅ MinePhotoGallery component
- ✅ CloudinaryUploadWidget component

### API Routes Tested

- ✅ GET /api/mines
- ✅ POST /api/mines
- ✅ GET /api/mines/[id]

### Pages Tested

- ✅ Home page (/)
- ✅ Add mine page (/mines/add)
- ✅ Mine detail page (/mines/[id])

## Best Practices

### Writing Component Tests

1. **Test user interactions**: Click, type, submit forms
2. **Test accessibility**: Use semantic queries
3. **Test error states**: Invalid inputs, API errors
4. **Test responsive design**: Different viewport sizes

### Writing E2E Tests

1. **Use descriptive test names**: Clear what the test does
2. **Mock external dependencies**: API calls, authentication
3. **Test happy path and error cases**: Success and failure scenarios
4. **Test mobile responsiveness**: Different screen sizes

### Test Data Management

1. **Use factory functions**: `createMockMine()` for consistent data
2. **Keep tests isolated**: Each test should be independent
3. **Clean up after tests**: Reset mocks and state

## Continuous Integration

The test setup is configured for CI/CD:

- **Jest**: Runs on every commit
- **Playwright**: Runs on pull requests
- **Coverage reports**: Generated automatically
- **Multiple browsers**: Chrome, Firefox, Safari, Mobile

## Debugging Tests

### Jest Debugging

```bash
# Run specific test file
npm test Header.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Debug failing tests
npm test -- --detectOpenHandles
```

### Playwright Debugging

```bash
# Run tests with UI
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug

# Show test traces
npx playwright show-trace
```

## Adding New Tests

### New Component Test

1. Create test file: `src/components/__tests__/ComponentName.test.tsx`
2. Import test utilities: `import { render, screen } from '@/__tests__/utils/test-utils'`
3. Write tests following existing patterns

### New E2E Test

1. Create test file: `tests/e2e/feature-name.spec.ts`
2. Import Playwright: `import { test, expect } from '@playwright/test'`
3. Write tests with proper mocking

### New API Test

1. Create test file: `src/app/api/__tests__/route-name.test.ts`
2. Mock Prisma and NextAuth
3. Test all HTTP methods and error cases

## Performance

- **Jest**: Fast unit tests with parallel execution
- **Playwright**: Parallel browser testing
- **Mocking**: Reduces test time by avoiding real API calls
- **Selective testing**: Run only changed files in development

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure `@types/jest` is installed
2. **Mock not working**: Check jest.mock() placement
3. **E2E test flaky**: Add proper waits and assertions
4. **Coverage not working**: Check jest.config.js settings

### Getting Help

- Check existing test patterns
- Review Jest and Playwright documentation
- Look at test utilities for common patterns 