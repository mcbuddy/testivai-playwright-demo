# TestivAI Playwright Demo

This project demonstrates automated testing using Playwright with TypeScript for the [Sauce Demo](https://www.saucedemo.com/) website. It showcases the integration of TestivAI Visual Regression testing and GitHub Actions for the approval process.

## Features

- End-to-end tests using Playwright and TypeScript
- Page Object Model pattern for maintainable tests
- Visual regression testing with TestivAI
- GitHub Actions integration for CI/CD
- Approval workflow for visual changes

## Project Structure

```
testivai-playwright-demo/
├── .github/                    # GitHub Actions workflows
├── memory-bank/                # Project documentation
├── tests/                      # Test files
│   ├── e2e/                    # End-to-end tests
│   ├── fixtures/               # Test fixtures
│   ├── pages/                  # Page objects
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Test utilities
├── package.json                # Project metadata and scripts
├── playwright.config.ts        # Playwright configuration
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd testivai-playwright-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests with visual regression testing:
```bash
npm run test:visual
```

Run tests in UI mode:
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

### Visual Regression Testing

This project uses [TestivAI Visual Regression](https://github.com/mcbuddy/testivai-visual-regression) for visual testing.

Update baseline images:
```bash
npm run update-baselines
```

Approve visual changes:
```bash
npm run approve
```

Compare current screenshots with baselines:
```bash
npm run compare
```

## Test Scenarios

The project includes the following test scenarios:

1. **Login Functionality**
   - Login with valid credentials
   - Show error with invalid credentials
   - Show error for locked out user
   - Login with performance glitch user

2. **Inventory Functionality**
   - Display all inventory items
   - Sort items by name (A to Z)
   - Sort items by name (Z to A)
   - Sort items by price (low to high)
   - Sort items by price (high to low)
   - Add item to cart
   - Remove item from cart
   - Logout successfully

3. **Shopping Cart and Checkout Process**
   - Display correct items in cart
   - Remove item from cart
   - Continue shopping from cart
   - Complete checkout process successfully
   - Show error with empty checkout information
   - Calculate correct total with tax

## GitHub Actions Integration

The project includes GitHub Actions workflows for:

1. Running tests on push and pull requests
2. Processing visual regression results
3. Managing the approval workflow for visual changes

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the ISC License.
