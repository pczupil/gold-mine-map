import { test, expect } from '@playwright/test';

test.describe('Add Mine Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });
    
    await page.goto('/mines/add');
  });

  test('should display the page header', async ({ page }) => {
    await expect(page.getByText('Add New Mine')).toBeVisible();
    await expect(page.getByText('Contribute to the global mine database')).toBeVisible();
  });

  test('should have a back button that navigates to home', async ({ page }) => {
    await page.getByRole('link', { name: /back/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display all form sections', async ({ page }) => {
    await expect(page.getByText('Basic Information')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
    await expect(page.getByText('Additional Information')).toBeVisible();
  });

  test('should fill out basic information', async ({ page }) => {
    await page.getByLabel('Mine Name *').fill('Test Gold Mine');
    await page.getByLabel('Mineral Type *').selectOption('Gold');
    await page.getByLabel('Status *').selectOption('Active');
    await page.getByLabel('Production').fill('1000 oz/year');

    await expect(page.getByLabel('Mine Name *')).toHaveValue('Test Gold Mine');
    await expect(page.getByLabel('Mineral Type *')).toHaveValue('Gold');
    await expect(page.getByLabel('Status *')).toHaveValue('Active');
    await expect(page.getByLabel('Production')).toHaveValue('1000 oz/year');
  });

  test('should fill out location information', async ({ page }) => {
    await page.getByLabel('Country *').selectOption('USA');
    await page.getByLabel('Region').fill('California');
    await page.getByLabel('Latitude *').fill('40.7128');
    await page.getByLabel('Longitude *').fill('-74.0060');

    await expect(page.getByLabel('Country *')).toHaveValue('USA');
    await expect(page.getByLabel('Region')).toHaveValue('California');
    await expect(page.getByLabel('Latitude *')).toHaveValue('40.7128');
    await expect(page.getByLabel('Longitude *')).toHaveValue('-74.0060');
  });

  test('should fill out additional information', async ({ page }) => {
    await page.getByLabel('Description').fill('A test gold mine in California');
    await page.getByLabel('Website').fill('https://example.com');

    await expect(page.getByLabel('Description')).toHaveValue('A test gold mine in California');
    await expect(page.getByLabel('Website')).toHaveValue('https://example.com');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Create Mine' }).click();

    // Should show validation errors
    await expect(page.getByText('Mine name is required')).toBeVisible();
    await expect(page.getByText('Country is required')).toBeVisible();
    await expect(page.getByText('Latitude is required')).toBeVisible();
    await expect(page.getByText('Longitude is required')).toBeVisible();
  });

  test('should handle coordinate format switching', async ({ page }) => {
    // Switch to DMS format
    await page.getByLabel('Degrees, Minutes, Seconds').click();
    
    await expect(page.getByText('Latitude (DMS)')).toBeVisible();
    await expect(page.getByText('Longitude (DMS)')).toBeVisible();
  });

  test('should handle coordinate string input', async ({ page }) => {
    // Switch to coordinate string format
    await page.getByLabel('Coordinate String').click();
    
    await expect(page.getByText('Latitude (String)')).toBeVisible();
    await expect(page.getByText('Longitude (String)')).toBeVisible();
  });

  test('should display photo gallery section', async ({ page }) => {
    await expect(page.getByText('Photo Gallery')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload Photos' })).toBeVisible();
  });

  test('should successfully create a mine', async ({ page }) => {
    // Fill out the form
    await page.getByLabel('Mine Name *').fill('Test Gold Mine');
    await page.getByLabel('Mineral Type *').selectOption('Gold');
    await page.getByLabel('Country *').selectOption('USA');
    await page.getByLabel('Region').fill('California');
    await page.getByLabel('Latitude *').fill('40.7128');
    await page.getByLabel('Longitude *').fill('-74.0060');
    await page.getByLabel('Status *').selectOption('Active');
    await page.getByLabel('Description').fill('A test gold mine');
    await page.getByLabel('Website').fill('https://example.com');

    // Mock successful API response
    await page.route('**/api/mines', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          country: 'USA',
          region: 'California',
          latitude: 40.7128,
          longitude: -74.0060,
          status: 'Active',
          description: 'A test gold mine',
          website: 'https://example.com',
        }),
      });
    });

    await page.getByRole('button', { name: 'Create Mine' }).click();

    // Should show success message and redirect
    await expect(page.getByText('Mine created successfully!')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Fill out the form
    await page.getByLabel('Mine Name *').fill('Test Gold Mine');
    await page.getByLabel('Mineral Type *').selectOption('Gold');
    await page.getByLabel('Country *').selectOption('USA');
    await page.getByLabel('Latitude *').fill('40.7128');
    await page.getByLabel('Longitude *').fill('-74.0060');
    await page.getByLabel('Status *').selectOption('Active');

    // Mock API error
    await page.route('**/api/mines', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database error' }),
      });
    });

    await page.getByRole('button', { name: 'Create Mine' }).click();

    // Should show error message
    await expect(page.getByText('An error occurred. Please try again.')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('Add New Mine')).toBeVisible();
    await expect(page.getByLabel('Mine Name *')).toBeVisible();
  });

  test('should clear form when reset button is clicked', async ({ page }) => {
    await page.getByLabel('Mine Name *').fill('Test Mine');
    await page.getByLabel('Description').fill('Test description');

    await page.getByRole('button', { name: 'Reset Form' }).click();

    await expect(page.getByLabel('Mine Name *')).toHaveValue('');
    await expect(page.getByLabel('Description')).toHaveValue('');
  });
}); 