# Cypress E2E — TypeScript Reference

[![CI](https://github.com/lucas-porto1/cypress-e2e-ts/actions/workflows/e2e-tests.yml/badge.svg?branch=main)](https://github.com/lucas-porto1/cypress-e2e-ts/actions/workflows/e2e-tests.yml)

_Part of [Lucas Porto's QA Automation Reference Collection](https://github.com/lucas-porto1): QA-first templates built for readability, reproducibility, and sustainable maintenance._

A TypeScript reference architecture for end-to-end test automation with Cypress, reusable sessions, typed fixtures, resilient selectors, code quality checks, and CI execution.

## Design principles

- **Follow Cypress conventions:** specs, fixtures, and support files remain under `cypress/`.
- **Tests describe behavior:** assertions and scenario intent stay visible in `*.cy.ts` files.
- **Avoid unnecessary Page Objects:** focused custom commands keep flows readable without hiding every interaction behind a class.
- **Keep tests isolated:** each scenario controls its own state and can run independently.
- **Reuse authentication safely:** `cy.session()` caches the authenticated browser state without making tests depend on execution order.
- **Protect credentials:** sensitive configuration is read with `cy.env()`, and the deprecated `Cypress.env()` API is disabled.
- **Use resilient selectors:** prefer application-owned `data-*` attributes and use stable semantic IDs when the target application does not expose them.
- **Synchronize with observable behavior:** use retried assertions and network aliases instead of fixed delays.
- **Fail fast:** required environment values are checked when Cypress loads its configuration.

## Prerequisites

- Node.js 24 LTS
- npm

The `.nvmrc` file allows compatible Node version managers such as nvm or fnm to select Node.js 24 with `nvm use` or `fnm use`.

## Getting started

```bash
git clone https://github.com/lucas-porto1/cypress-e2e-ts.git
cd cypress-e2e-ts
npm ci
```

Create the local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The template uses public credentials from The Internet test site. For real projects, replace the values locally and never commit `.env` or real secrets.

## Running the tests

```bash
npm test                  # run all specs headlessly with the bundled Electron browser
npm run test:chrome       # run all specs with Chrome
npm run test:headed       # run all specs with a visible browser
npm run test:open         # open the interactive Cypress application
npm run typecheck         # validate TypeScript without emitting files
npm run lint              # run static analysis and reject focused tests
npm run format            # format project files
npm run format:check      # verify formatting without changing files
npm run check             # lint, formatting, types, and E2E tests
```

Run a single spec:

```bash
npx cypress run --spec "cypress/e2e/auth/login.cy.ts"
```

## Project structure

```text
.
|-- .github/
|   |-- workflows/                # continuous integration pipeline
|   `-- dependabot.yml            # semiannual dependency update configuration
|-- cypress/
|   |-- e2e/                      # behavior-focused specs grouped by feature
|   |   |-- auth/
|   |   |-- dynamic/
|   |   `-- forms/
|   |-- fixtures/                 # static test data and its TypeScript contracts
|   `-- support/
|       |-- commands.ts           # typed UI actions and shared setup commands
|       `-- e2e.ts                # support entry point loaded before each spec
|-- .env.example                  # documented local environment contract
|-- cypress.config.ts             # environment, retries, E2E, and artifact settings
|-- eslint.config.js              # TypeScript, Cypress, and focused-test rules
|-- tsconfig.json                 # strict TypeScript configuration
`-- package.json                  # scripts and dependencies
```

## Authentication and test isolation

The shared `cy.login()` command creates authentication through a programmatic form request and uses `cy.session()` to cache the resulting cookie. The session is validated with a direct request to the protected route before reuse and can be shared across specs during the same Cypress run. Each test still calls `cy.login()` explicitly and visits the page it needs, so execution order does not matter.

The login screen remains covered through the UI in `login.cy.ts`. Other specs use the authentication endpoint because they need an authenticated precondition rather than another copy of the login test. This keeps the suite faster while preserving UI coverage of the real login behavior.

`support/commands.ts` also exposes `cy.submitLoginForm()` because it groups the repeated form interactions and prevents the password from appearing in the Cypress log. Simple native operations such as `cy.visit('/login')` remain directly in the spec because wrapping them would add indirection without reusable behavior. `support/e2e.ts` intentionally contains only the commands import because Cypress loads this entry point before every spec.

## Fixture typing

Fixture-specific interfaces stay beside their JSON data, such as `form-options.json` and `form-options.types.ts`. Specs use `import type` so TypeScript validates the fixture contract without adding runtime JavaScript.

## Environment variables

The root `.env` file is loaded only by the Node-side Cypress configuration. Credentials are passed to tests through Cypress configuration and read explicitly with the asynchronous `cy.env()` command. `allowCypressEnv: false` prevents new code from using the deprecated synchronous `Cypress.env()` API.

Required variables:

- `BASE_URL`
- `STANDARD_USER`
- `USER_PASSWORD`

## Adding a feature

1. Create a feature folder under `cypress/e2e/` when one does not already exist.
2. Add a `*.cy.ts` spec containing the user behavior and assertions.
3. Keep simple Cypress operations visible in specs; create typed custom commands only for repeated or multi-step flows that provide a meaningful abstraction.
4. Keep `support/e2e.ts` lean and use it only to initialize global support such as commands.
5. Put static reusable data and its closely related TypeScript contracts under `cypress/fixtures/`.
6. Prefer application-owned `data-*` selectors and fall back to stable IDs or accessible semantics when necessary.
7. Run `npm run check` before submitting the change.

## CI and artifacts

The GitHub Actions workflow installs dependencies with Node.js 24, checks linting, formatting and types, and then runs the complete Cypress suite. Failure screenshots are uploaded as short-lived artifacts for debugging. Video recording remains disabled to keep this reference project lightweight.

The demo credentials are public values published by the target site and can remain in the example workflow. Credentials for real systems must be stored as GitHub Actions repository secrets.

Dependabot checks npm packages and GitHub Actions twice a year and groups minor and patch updates. Major updates remain separate for explicit review. TypeScript major updates are held until the linting toolchain supports them, and `@types/node` remains aligned with the Node.js runtime.
