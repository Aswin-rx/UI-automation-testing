# Playwright Testing Project

This project contains end-to-end tests for a web application using [Playwright](https://playwright.dev/).

## Project Structure

- `tests/Register.spec.ts`: Main Playwright test suite for registration, login, and related workflows.
- `playwright.config.js` / `playwright.config.ts`: Playwright configuration files.
- `playwright-report/`: Directory for Playwright HTML reports.
- `test-results/`: Directory for raw test results and error context.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Install Dependencies

```
npm install
```

### Running Tests

To run all tests:

```
npx playwright test
```

To run a specific test file:

```
npx playwright test tests/Register.spec.ts
```

### Viewing Reports

After running tests, view the HTML report:

```
npx playwright show-report
```

## Useful Commands

- Run tests in headed mode (see the browser):
  ```
  npx playwright test --headed
  ```
- Run tests in a specific browser:
  ```
  npx playwright test --project=chromium
  npx playwright test --project=firefox
  npx playwright test --project=webkit
  ```

## More Information

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/test-api)

---

Feel free to add more tests in the `tests/` directory as needed.
