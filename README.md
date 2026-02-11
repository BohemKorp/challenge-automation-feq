# Challenge Automation - FEQ

Automation testing framework using Playwright + TypeScript for API and Web testing with data-driven approach.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [Test Coverage](#test-coverage)
- [Architecture](#architecture)
- [Best Practices Applied](#best-practices-applied)

## Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js** (version 18.x or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js) or **yarn**
  - Verify installation: `npm --version`

- **Git** (for version control)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

## Installation

Follow these steps to set up the project:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/challenge-automation-feq.git
cd challenge-automation-feq
```

### 2. Install dependencies

```bash
npm install
```

This will install:
- Playwright Test Framework
- TypeScript
- xlsx (for Excel file reading)
- dotenv (for environment variables)
- All necessary type definitions

### 3. Install Playwright browsers

```bash
npx playwright install
```

This command downloads the required browser binaries (Chromium, Firefox, WebKit).

### 4. Configure environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file to set your desired environment:

```env
TEST_ENV=qa
SECRET_KEY_QA=your_secret_key_for_qa_here
SECRET_KEY_CERT=your_secret_key_for_cert_here
```

- `TEST_ENV`: Set to `qa` or `cert` to select the environment
- Secret keys are automatically selected based on the environment

## Project Structure

```
challenge-automation-feq/
├── tests/
│   ├── api/
│   │   ├── pokemon.spec.ts         # Pokemon API tests (GET by ID and name)
│   │   └── jsonplaceholder.spec.ts # JSONPlaceholder API tests (POST)
│   └── web/
│       └── wikipedia.spec.ts       # Wikipedia web tests
├── pages/
│   ├── base.page.ts               # Base page object with common methods
│   └── wikipedia.page.ts          # Wikipedia page object (POM pattern)
├── fixtures/
│   └── custom-fixtures.ts         # Custom Playwright fixtures for encryption
├── utils/
│   ├── excel-reader.ts            # Excel file reader utility
│   ├── crypto-helper.ts           # SHA256 encryption utility
│   ├── file-validator.ts          # File validation utilities
│   └── logger.ts                  # Logger with timestamps
├── config/
│   ├── environment.ts             # Environment configuration manager
│   └── test-data.ts              # TypeScript interfaces
├── data/
│   └── Datos-pruebas.xlsx        # Test data (Pokemon IDs and names)
├── images/                        # Downloaded images (created automatically)
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## Configuration

### Environment Configuration

The project supports two environments: **QA** and **CERT**

- Each environment has its own secret key
- Secret keys are encrypted using SHA256 before each test
- Keys are never exposed in the code

To change environment:

```bash
# Option 1: Edit .env file
TEST_ENV=cert

# Option 2: Use npm scripts
npm run test:qa    # Run with QA environment
npm run test:cert  # Run with CERT environment
```

### Playwright Configuration

Key configurations in `playwright.config.ts`:

- **Timeout**: 60 seconds per test
- **Retries**: 1 retry on failure
- **Workers**: 3 parallel workers
- **Screenshot**: Captured on failure
- **Video**: Recorded on failure
- **Trace**: Collected on failure
- **Projects**: Separate projects for API and Web tests

## Running Tests

### Run all tests

```bash
npm test
```

### Run specific test suites

```bash
# Run only API tests
npm run test:api

# Run only Web tests
npm run test:web

# Run with specific environment
npm run test:qa
npm run test:cert
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run specific test file

```bash
npx playwright test tests/api/pokemon.spec.ts
npx playwright test tests/web/wikipedia.spec.ts
```

### Run tests by project

```bash
# Run only Pokemon API tests
npx playwright test --project="API Tests - Pokemon"

# Run only Web tests on Chromium
npx playwright test --project="Web Tests - Chromium"
```

## Viewing Reports

### HTML Report

After running tests, view the detailed HTML report:

```bash
npm run report
```

This will automatically open the HTML report in your default browser.

Alternatively, you can manually open the report:

```bash
open playwright-report/index.html   # macOS
xdg-open playwright-report/index.html  # Linux
start playwright-report/index.html  # Windows
```

### Report Contents

The HTML report includes:

- **Test Results**: Pass/Fail status for each test
- **Execution Time**: Duration of each test
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Detailed execution traces for debugging
- **Logs**: Console logs including encrypted keys and timestamps

### JSON Report

A JSON report is also generated at:

```
test-results/results.json
```

This can be used for CI/CD integration or custom reporting.

## Test Coverage

### API Tests - Part 1 (Pokemon API)

- **Endpoint**: `GET https://pokeapi.co/api/v2/pokemon/{id or name}`
- **Data Source**: Excel file (`data/Datos-pruebas.xlsx`)
- **Tests**: Dynamic tests for each Pokemon (by ID and by name)
- **Validations**:
  - HTTP status code 200
  - Response time < 10 seconds
  - Correct `id`, `name`, and `abilities` fields
  - Abilities array structure

### API Tests - Part 2 (JSONPlaceholder)

- **Endpoint**: `POST https://jsonplaceholder.typicode.com/posts`
- **Tests**: Create new posts with various payloads
- **Validations**:
  - HTTP status code 201 (Created)
  - Generated ID is present
  - Request payload matches response data

### Web Tests (Wikipedia)

- **Target**: Wikipedia Pokemon pages
- **Data Source**: Excel file (`data/Datos-pruebas.xlsx`)
- **Tests**: Dynamic tests for each Pokemon
- **Actions**:
  1. Navigate to Pokemon Wikipedia page
  2. Validate page title
  3. Extract and log artwork designer
  4. Download main Pokemon image
  5. Validate image extension (.jpg, .jpeg, .png, .svg)
  6. Validate image size (< 500KB)
- **Page Object Model**: WikipediaPage class

## Architecture

### Design Patterns Used

1. **Page Object Model (POM)**
   - Encapsulates page interactions in reusable classes
   - Separates test logic from page structure
   - Located in `pages/` directory

2. **Custom Fixtures**
   - Extends Playwright's built-in fixtures
   - Automatic encryption and logging before each test
   - Provides reusable test utilities
   - Located in `fixtures/custom-fixtures.ts`

3. **Data-Driven Testing**
   - Tests are generated dynamically from Excel file
   - Avoids code duplication
   - Easy to add new test cases

4. **Utility Pattern**
   - Reusable helper functions
   - Single responsibility principle
   - Located in `utils/` directory

### Security Features

- **Secret Key Encryption**: SHA256 encryption before each test
- **Environment Variables**: Secrets stored in `.env` (not in git)
- **No Hardcoded Secrets**: All sensitive data externalized

### Logging Features

- **Encrypted Key Logging**: Logged before each test via fixture
- **Timestamp Logging**: Test completion time logged
- **Custom Logger**: Utility class for consistent logging format
- **Console Output**: Detailed information during test execution

## Best Practices Applied

### Code Quality

- ✅ TypeScript for type safety
- ✅ Modular architecture (separation of concerns)
- ✅ Reusable components (DRY principle)
- ✅ Consistent naming conventions
- ✅ Comprehensive comments and documentation

### Testing Best Practices

- ✅ Data-driven testing approach
- ✅ Independent test execution
- ✅ Proper assertions for each test case
- ✅ Screenshot and video capture on failure
- ✅ Trace collection for debugging
- ✅ Response time validation

### Playwright Features

- ✅ Custom fixtures (instead of beforeEach)
- ✅ Multiple projects configuration
- ✅ Parallel test execution
- ✅ Automatic retries on failure
- ✅ Multiple reporter formats
- ✅ API testing context

### File Management

- ✅ Automatic directory creation
- ✅ File overwrite on re-execution
- ✅ Case-insensitive extension validation
- ✅ File size validation

## Troubleshooting

### Issue: Tests fail with "Excel file not found"

**Solution**: Ensure the `data/Datos-pruebas.xlsx` file exists in the project root.

### Issue: Browsers not installed

**Solution**: Run `npx playwright install`

### Issue: Environment variables not loading

**Solution**: 
1. Ensure `.env` file exists in project root
2. Check file has correct format (no spaces around `=`)
3. Restart your terminal

### Issue: Image download fails

**Solution**: 
1. Check internet connection
2. Verify Wikipedia is accessible
3. Check that `images/` folder has write permissions

### Issue: Tests timeout

**Solution**: 
1. Increase timeout in `playwright.config.ts`
2. Check network connection
3. Use `--headed` mode to see what's happening

## CI/CD Integration

The project is ready for CI/CD integration:

- JSON and JUnit reports generated
- Environment variable support
- Configurable workers and retries
- Screenshot/video artifacts on failure

## Contributing

When contributing to this project:

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass before committing

## License

ISC

## Author

FEQ - Challenge Automation Project

---

**Last Updated**: February 2026
