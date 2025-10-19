# ClipCommerce Testing Guide

This guide covers testing strategies and best practices for the ClipCommerce platform.

## Testing Overview

ClipCommerce uses a comprehensive testing strategy with multiple layers:

- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** API route testing
- **End-to-End Tests:** Playwright
- **Visual Regression Tests:** Playwright screenshots

## Test Structure

```
tests/
├── e2e/                 # End-to-end tests
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   └── submissions.spec.ts
├── __mocks__/           # Mock files
│   ├── next-router.js
│   └── supabase.js
└── fixtures/            # Test data
    ├── users.json
    └── submissions.json

src/
├── __tests__/           # Unit tests
│   ├── components/
│   ├── hooks/
│   └── lib/
└── app/
    └── api/
        └── __tests__/   # API tests
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- useAuth.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should authenticate user"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific test file
npx playwright test auth.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Configuration

### Jest Configuration

The Jest configuration is in `jest.config.js`:

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Playwright Configuration

The Playwright configuration is in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
})
```

## Writing Tests

### Unit Tests

#### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationCenter } from '@/components/NotificationCenter'

describe('NotificationCenter', () => {
  it('should display notifications when opened', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })
})
```

#### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

describe('useAuth', () => {
  it('should return user when authenticated', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      // Wait for async operations
    })
    
    expect(result.current.user).toBeDefined()
  })
})
```

#### Testing API Routes

```typescript
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/analytics/creator/route'

describe('/api/analytics/creator', () => {
  it('should return analytics data', async () => {
    const request = new NextRequest('http://localhost:3000/api/analytics/creator')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.overview).toBeDefined()
  })
})
```

### End-to-End Tests

#### Testing User Flows

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should allow user to sign up and log in', async ({ page }) => {
    // Navigate to signup
    await page.goto('/signup')
    
    // Fill signup form
    await page.getByText('Creator').click()
    await page.getByRole('button', { name: 'Continue' }).click()
    
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByLabel('Display Name').fill('Test User')
    
    // Submit form
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    // Should redirect to onboarding
    await expect(page).toHaveURL(/\/onboarding\/creator/)
  })
})
```

#### Testing Mobile Responsiveness

```typescript
test('should be responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/dashboard')
  
  // Check mobile layout
  await expect(page.getByRole('heading')).toBeVisible()
  
  // Check touch targets
  const buttons = page.getByRole('button')
  const buttonCount = await buttons.count()
  
  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i)
    const box = await button.boundingBox()
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  }
})
```

## Mocking

### API Mocking

```typescript
// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      }),
    },
  })),
}))
```

### Component Mocking

```typescript
// Mock external components
jest.mock('@/components/NotificationCenter', () => ({
  NotificationCenter: ({ userId }: { userId: string }) => (
    <div data-testid="notification-center">Notifications for {userId}</div>
  ),
}))
```

### Database Mocking

```typescript
// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))
```

## Test Data

### Fixtures

Create test data in `tests/fixtures/`:

```json
// tests/fixtures/users.json
{
  "creator": {
    "id": "creator123",
    "email": "creator@example.com",
    "role": "CREATOR",
    "onboardingComplete": true
  },
  "clipper": {
    "id": "clipper123",
    "email": "clipper@example.com",
    "role": "CLIPPER",
    "onboardingComplete": true
  }
}
```

### Test Database

Use a separate test database:

```typescript
// jest.setup.js
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
```

## Coverage

### Coverage Goals

- **Statements:** 70%
- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Exclusions

Exclude files from coverage in `jest.config.js`:

```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.stories.{js,jsx,ts,tsx}',
  '!src/**/*.test.{js,jsx,ts,tsx}',
  '!src/**/*.spec.{js,jsx,ts,tsx}',
  '!src/app/layout.tsx',
  '!src/app/globals.css',
]
```

## Continuous Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

### Test Organization

1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain what is being tested
3. **Follow AAA pattern:** Arrange, Act, Assert
4. **Keep tests independent** - each test should be able to run in isolation
5. **Clean up after tests** - reset mocks and state

### Test Data

1. **Use realistic test data** that matches production scenarios
2. **Create reusable fixtures** for common test data
3. **Use factories** for generating test data
4. **Avoid hardcoded values** in tests

### Performance

1. **Mock external dependencies** to avoid network calls
2. **Use shallow rendering** for component tests when possible
3. **Run tests in parallel** when safe to do so
4. **Clean up resources** after tests complete

### Accessibility

1. **Test with screen readers** in E2E tests
2. **Check keyboard navigation** works correctly
3. **Verify ARIA labels** are present and correct
4. **Test with high contrast mode** enabled

## Debugging Tests

### Unit Tests

```bash
# Run tests in debug mode
npm test -- --detectOpenHandles --forceExit

# Run specific test with verbose output
npm test -- --verbose useAuth.test.ts
```

### E2E Tests

```bash
# Run tests in headed mode for debugging
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test auth.spec.ts --debug
```

### Common Issues

1. **Tests timing out:** Increase timeout or add proper waits
2. **Mock not working:** Check mock setup and imports
3. **Database issues:** Ensure test database is properly configured
4. **Flaky tests:** Add proper waits and assertions

## Test Maintenance

### Regular Tasks

1. **Update test dependencies** monthly
2. **Review test coverage** regularly
3. **Refactor flaky tests** immediately
4. **Update test data** when schemas change
5. **Remove obsolete tests** when features are removed

### Test Review

1. **Code review tests** along with feature code
2. **Ensure tests cover edge cases**
3. **Verify tests are maintainable**
4. **Check test performance** regularly

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
