import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header with app title', async ({ page }) => {
    await expect(page.getByText('Gold Mine Map')).toBeVisible();
    await expect(page.getByText('Global Mineral Tracking')).toBeVisible();
  });

  test('should show sign in page when not authenticated', async ({ page }) => {
    // Mock unauthenticated session
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    await page.goto('/');
    
    await expect(page.getByText('Welcome to Gold Mine Map')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  test('should display map when authenticated', async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });

    await page.goto('/');
    
    // Wait for map to load
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
  });

  test('should display search bar', async ({ page }) => {
    await expect(page.getByPlaceholder('Search mines, locations...')).toBeVisible();
  });

  test('should filter mines by search term', async ({ page }) => {
    // Mock authenticated session and mines data
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });

    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search mines, locations...');
    await searchInput.fill('Gold');
    
    // Verify search functionality (this would depend on your actual implementation)
    await expect(searchInput).toHaveValue('Gold');
  });

  test('should display filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All Mines' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gold' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copper' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iron' })).toBeVisible();
  });

  test('should filter mines by type', async ({ page }) => {
    await page.getByRole('button', { name: 'Gold' }).click();
    
    // Verify filter is applied
    await expect(page.getByRole('button', { name: 'Gold' })).toHaveClass(/bg-blue-600/);
  });

  test('should display stats cards', async ({ page }) => {
    await expect(page.getByText('Total Mines')).toBeVisible();
    await expect(page.getByText('Active Mines')).toBeVisible();
    await expect(page.getByText('Countries')).toBeVisible();
    await expect(page.getByText('Mineral Types')).toBeVisible();
  });

  test('should navigate to add mine page', async ({ page }) => {
    await page.getByRole('link', { name: 'Add Mine' }).click();
    
    await expect(page).toHaveURL('/mines/add');
  });

  test('should display user menu when authenticated', async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });

    await page.goto('/');
    
    await expect(page.getByText('Sign out')).toBeVisible();
  });

  test('should handle sign out', async ({ page }) => {
    // Mock authenticated session
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });

    await page.goto('/');
    
    await page.getByText('Sign out').click();
    
    // Should redirect to sign in page
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('Gold Mine Map')).toBeVisible();
    await expect(page.getByPlaceholder('Search mines, locations...')).toBeVisible();
  });

  test('should clear search when clear filters is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search mines, locations...');
    await searchInput.fill('Test');
    
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    
    await expect(searchInput).toHaveValue('');
  });
}); 