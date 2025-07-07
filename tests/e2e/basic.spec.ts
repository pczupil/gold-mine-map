import { test, expect } from '@playwright/test';

test.describe('Basic App Functionality', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Gold Mine Map/);
    
    // Check for the header - use more specific selector
    await expect(page.getByRole('heading', { name: 'Gold Mine Map' })).toBeVisible();
    // Check for the subtitle in the header specifically
    await expect(page.locator('header').getByText('Global Mineral Tracking')).toBeVisible();
  });

  test('should show authentication required when not signed in', async ({ page }) => {
    await page.goto('/');
    
    // Should show sign in page for unauthenticated users
    await expect(page.getByText('Welcome to Gold Mine Map')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check sign in link
    const signInLink = page.getByRole('link', { name: 'Sign In' });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/signin');
    
    // Check sign up link
    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/auth/signup');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Should still show the main content
    await expect(page.getByRole('heading', { name: 'Gold Mine Map' })).toBeVisible();
    await expect(page.getByText('Welcome to Gold Mine Map')).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper HTML structure - use more flexible selectors
    await expect(page.locator('header')).toBeVisible();
    
    // Check for proper accessibility
    await expect(page.getByRole('banner')).toBeVisible();
    
    // Check that the page has some content
    await expect(page.getByText('Welcome to Gold Mine Map')).toBeVisible();
  });

  test('should have proper styling and layout', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page has the expected background - look for the main container
    const mainContainer = page.locator('.min-h-screen');
    await expect(mainContainer).toHaveClass(/bg-gradient-to-br/);
    
    // Check that the welcome section is properly styled
    const welcomeSection = page.getByText('Welcome to Gold Mine Map').locator('..');
    await expect(welcomeSection).toBeVisible();
  });

  test('should have working sign in button', async ({ page }) => {
    await page.goto('/');
    
    const signInButton = page.getByRole('link', { name: 'Sign In' });
    await expect(signInButton).toBeVisible();
    
    // Click the sign in button and verify navigation
    await signInButton.click();
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should have working sign up button', async ({ page }) => {
    await page.goto('/');
    
    const signUpButton = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpButton).toBeVisible();
    
    // Click the sign up button and verify navigation
    await signUpButton.click();
    await expect(page).toHaveURL('/auth/signup');
  });
}); 