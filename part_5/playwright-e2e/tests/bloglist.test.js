const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post('http://localhost:3003/api/testing/reset');

    // Create a user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'user',
        username: 'user',
        password: 'pass',
      },
    });

    // Go to the application
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    // Check if the login form is displayed
    await expect(page.locator('text=Login')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'user');
      await page.fill('input[name="password"]', 'pass');
      await page.click('button:has-text("login")');
      
      // Expect user to be logged in
      await expect(page.locator('text=Logged in as user')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'user');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button:has-text("login")');
      
      // Check error notification
      await expect(page.locator('.error')).toHaveText('wrong username or password');
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Log in before each test
      await page.fill('input[name="username"]', 'user');
      await page.fill('input[name="password"]', 'pass');
      await page.click('button:has-text("login")');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.click('button:has-text("new blog")');
      await page.fill('input[name="title"]', 'E2E Test Blog');
      await page.fill('input[name="author"]', 'Playwright Tester');
      await page.fill('input[name="url"]', 'http://test.com');
      await page.click('button:has-text("create")');
      
      // Verify the new blog is added
      await expect(page.locator('text=E2E Test Blog')).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      // Ensure there is a blog and expand details
      await page.click('button:has-text("view")');
      await page.click('button:has-text("like")');
      
      // Check if the like count increases
      const likes = page.locator('.likes');
      await expect(likes).toHaveText('1');
    });

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      // Create a blog and click view to reveal delete button
      await page.click('button:has-text("view")');
      await page.click('button:has-text("remove")');
      
      // Confirm the blog is deleted
      await expect(page.locator('text=E2E Test Blog')).not.toBeVisible();
    });

    test('only the blog creator sees the delete button', async ({ page, request }) => {
      // Log in as another user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'password123',
        },
      });
      
      await page.fill('input[name="username"]', 'anotheruser');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button:has-text("login")');
      
      // The delete button should not be visible
      await expect(page.locator('button:has-text("remove")')).not.toBeVisible();
    });

    test('blogs are sorted by likes', async ({ page }) => {
      // Ensure blogs exist and like them
      const blogs = await page.locator('.blog');
      await blogs.first().click('button:has-text("view")');
      await blogs.first().click('button:has-text("like")');
      
      // Verify sorting
      const blogTitles = await page.$$eval('.blog-title', nodes => nodes.map(n => n.innerText));
      expect(blogTitles).toEqual(['Most Liked Blog', 'Less Liked Blog']);
    });
  });
});
