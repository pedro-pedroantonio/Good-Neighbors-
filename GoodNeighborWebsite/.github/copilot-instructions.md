# Good Neighbor Website - Next.js Development Guide

This workspace contains a production-ready Next.js application with TypeScript, ESLint, Prettier, and testing setup.

## Project Setup Tasks

- [x] Create copilot-instructions.md file
- [x] Scaffold Next.js project
- [x] Customize project structure
- [x] Install dependencies
- [x] Create dev task
- [x] Verify setup and README

## Project Structure

```
./
├── app/                    # Next.js App Router
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── styles/                 # Global and module styles
├── public/                 # Static assets
├── __tests__/              # Test files
├── .env.local              # Local environment variables
├── .eslintrc.json          # ESLint configuration
├── .prettierrc              # Prettier configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Development Guidelines

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Keep components small and reusable
- Use the hooks directory for custom React hooks
