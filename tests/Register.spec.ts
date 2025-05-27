import { test, expect } from '@playwright/test';

test.describe.serial('Register page workflow', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Home page loads and Get Started button is visible', async () => {
    await page.goto('/');
    await expect(page.locator('#get-started-button')).toBeVisible();
  });

  test('Clicking Get Started navigates to Register page', async () => {
    await page.goto('/');
    await page.locator('#get-started-button').click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test('All Register form fields are visible', async () => {
    await page.goto('/register');
    await expect(page.locator('input[placeholder="First Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Last Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button[type="submit"]:has-text("Create Account")')).toBeVisible();
  });

  test('Register form validation: empty submit shows all errors', async () => {
    await page.goto('/register');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page.locator('text=First Name is required')).toBeVisible();
    await expect(page.locator('text=Last Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Role is required')).toBeVisible();
  });

  test('Register form validation: invalid email', async () => {
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill('invalid-email');
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    // After submit, check the email input's validationMessage property
    const emailInput = page.locator('input[placeholder="Email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBe("Please include an '@' in the email address. 'invalid-email' is missing an '@'.");
  });

  test('Register form validation: short password', async () => {
    await page.goto('/register');
    await page.locator('input[placeholder="Password"]').fill('123');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('Register form validation: missing role', async () => {
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill('john@example.com');
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page.locator('text=Role is required')).toBeVisible();
  });

  test('Register as student and redirect to login', async () => {
    const uniqueEmail = `student.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page).toHaveURL(/login/);
  });

  test('Register as tutor and redirect to login', async () => {
    const uniqueEmail = `tutor.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('Jane');
    await page.locator('input[placeholder="Last Name"]').fill('Smith');
    await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('tutor');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page).toHaveURL(/login/);
  });

  test('Login form fields are visible', async () => {
    await page.goto('/login');
    await expect(page.locator('input[placeholder="Email address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button[type="submit"]:has-text("Sign in")')).toBeVisible();
  });

  test('Login validation: empty submit shows all errors', async () => {
    await page.goto('/login');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Role is required')).toBeVisible();
  });

  test('Login validation: wrong password', async () => {
    await page.goto('/login');
    await page.locator('input[placeholder="Email address"]').fill('john.doe@example.com');
    await page.locator('input[placeholder="Password"]').fill('wrongpassword');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('Login validation: missing role', async () => {
    await page.goto('/login');
    await page.locator('input[placeholder="Email address"]').fill('john.doe@example.com');
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await expect(page.locator('text=Role is required')).toBeVisible();
  });

  test('Successful login as student redirects to dashboard', async () => {
    const uniqueEmail = `student.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await page.goto('/login');
    await page.locator('input[placeholder="Email address"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Successful login as tutor redirects to dashboard', async () => {
    const uniqueEmail = `tutor.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('Jane');
    await page.locator('input[placeholder="Last Name"]').fill('Smith');
    await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('tutor');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await page.goto('/login');
    await page.locator('input[placeholder="Email address"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('tutor');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Role select options are correct', async () => {
    await page.goto('/register');
    const options = await page.locator('select option').allTextContents();
    expect(options).toContain('Select your role');
    expect(options).toContain('Student');
    expect(options).toContain('Tutor');
  });

  test('Duplicate email registration error', async () => {
    const duplicateEmail = `duplicate.${Date.now()}@example.com`;
    // First registration
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(duplicateEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page).toHaveURL(/login/);
    // Second registration with same email
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(duplicateEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    const errorMsg = page.locator('text=/already exists|duplicate|taken/i');
    await expect(errorMsg).toBeVisible();
  });

   test('Success message is shown on successful registration (if used)', async () => {
    const uniqueEmail = `success.${Date.now()}@example.com`;
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    // Listen for alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Registration successful');
      await dialog.accept();
    });
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    // After alert, expect redirect to login
    await expect(page).toHaveURL(/login/);
  });

  
  test('API/network error shows generic error', async () => {
    await page.route('**/auth/register', route => route.abort());
    await page.goto('/register');
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('input[placeholder="Email"]').fill(`fail.${Date.now()}@example.com`);
    await page.locator('input[placeholder="Password"]').fill('Password123!');
    await page.locator('select').selectOption('student');
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    await expect(page.locator('text=Something went wrong')).toBeVisible();
  });
});
