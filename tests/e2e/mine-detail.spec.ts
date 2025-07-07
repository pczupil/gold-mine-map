import { test, expect } from '@playwright/test';

test.describe('Mine Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });
  });

  test('should display mine details correctly', async ({ page }) => {
    // Mock API response for mine data
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          latitude: 40.7128,
          longitude: -74.0060,
          country: 'USA',
          region: 'California',
          production: '1000 oz/year',
          status: 'Active',
          description: 'A test gold mine in California',
          website: 'https://example.com',
          photoUrls: ['https://example.com/photo1.jpg'],
          photos: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        }),
      });
    });

    await page.goto('/mines/1');

    // Check page header
    await expect(page.getByText('Test Gold Mine')).toBeVisible();
    await expect(page.getByText('Mine Details')).toBeVisible();

    // Check back button
    await expect(page.getByRole('link', { name: /back/i })).toBeVisible();
  });

  test('should display all mine information sections', async ({ page }) => {
    // Mock API response
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          latitude: 40.7128,
          longitude: -74.0060,
          country: 'USA',
          region: 'California',
          production: '1000 oz/year',
          status: 'Active',
          description: 'A test gold mine',
          website: 'https://example.com',
          photoUrls: [],
          photos: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        }),
      });
    });

    await page.goto('/mines/1');

    // Check all sections are present
    await expect(page.getByText('Photo Gallery')).toBeVisible();
    await expect(page.getByText('Basic Information')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
    await expect(page.getByText('Additional Information')).toBeVisible();
    await expect(page.getByText('Metadata')).toBeVisible();
  });

  test('should display basic information correctly', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          status: 'Active',
          production: '1000 oz/year',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');

    await expect(page.getByText('Test Gold Mine')).toBeVisible();
    await expect(page.getByText('Gold')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('1000 oz/year')).toBeVisible();
  });

  test('should display location information correctly', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          latitude: 40.7128,
          longitude: -74.0060,
          country: 'USA',
          region: 'California',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');

    await expect(page.getByText('USA')).toBeVisible();
    await expect(page.getByText('California')).toBeVisible();
    await expect(page.getByText('40.7128')).toBeVisible();
    await expect(page.getByText('-74.0060')).toBeVisible();
  });

  test('should display additional information correctly', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          description: 'A test gold mine in California',
          website: 'https://example.com',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');

    await expect(page.getByText('A test gold mine in California')).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://example.com' })).toBeVisible();
  });

  test('should display metadata correctly', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          photoUrls: [],
          photos: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
        }),
      });
    });

    await page.goto('/mines/1');

    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText(/Created/)).toBeVisible();
    await expect(page.getByText(/Last Updated/)).toBeVisible();
  });

  test('should handle missing optional fields gracefully', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          latitude: 40.7128,
          longitude: -74.0060,
          country: 'USA',
          status: 'Active',
          photoUrls: [],
          photos: [],
          // Missing optional fields: region, production, description, website
        }),
      });
    });

    await page.goto('/mines/1');

    // Should still display required fields
    await expect(page.getByText('Test Gold Mine')).toBeVisible();
    await expect(page.getByText('Gold')).toBeVisible();
    await expect(page.getByText('USA')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
  });

  test('should navigate back to home page', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');
    await page.getByRole('link', { name: /back/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should handle 404 for non-existent mine', async ({ page }) => {
    await page.route('**/api/mines/999', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Mine not found' }),
      });
    });

    await page.goto('/mines/999');

    // Should show 404 page
    await expect(page.getByText('404')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database error' }),
      });
    });

    await page.goto('/mines/1');

    // Should show error page
    await expect(page.getByText('404')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/mines/1');

    await expect(page.getByText('Test Gold Mine')).toBeVisible();
    await expect(page.getByRole('link', { name: /back/i })).toBeVisible();
  });

  test('should display photo gallery when photos exist', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          photoUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');

    await expect(page.getByText('Photo Gallery')).toBeVisible();
    // The photo gallery component should be present
    await expect(page.locator('[data-testid="photo-gallery"]')).toBeVisible();
  });

  test('should display external links correctly', async ({ page }) => {
    await page.route('**/api/mines/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Test Gold Mine',
          type: 'Gold',
          website: 'https://example.com',
          photoUrls: [],
          photos: [],
        }),
      });
    });

    await page.goto('/mines/1');

    const websiteLink = page.getByRole('link', { name: 'https://example.com' });
    await expect(websiteLink).toBeVisible();
    await expect(websiteLink).toHaveAttribute('target', '_blank');
    await expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 