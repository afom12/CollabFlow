# Contributing to CollabFlow

Thank you for your interest in contributing to CollabFlow! This document provides guidelines and instructions for contributing.

## 🎯 How to Contribute

There are many ways to contribute to CollabFlow:

- 🐛 **Report Bugs**: Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 **Suggest Features**: Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- 📝 **Improve Documentation**: Fix typos, clarify instructions, add examples
- 💻 **Write Code**: Fix bugs, implement features, improve performance
- 🎨 **Design**: Improve UI/UX, create mockups, suggest design improvements
- 🧪 **Test**: Test features, report issues, write test cases

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or hosted)
- Git

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/your-username/collabflow.git
   cd collabflow
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/collabflow.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the code style guidelines
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint        # Check code style
   npm run type-check # Check TypeScript types
   npm run build      # Ensure build succeeds
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request on GitHub using our [PR template](.github/pull_request_template.md).

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript with strict mode enabled
- Prefer type inference where possible
- Use interfaces for object shapes
- Use types for unions, intersections, and computed types
- Avoid `any` - use `unknown` if type is truly unknown

### React Components

- Use functional components with hooks
- Prefer Server Components when possible
- Use meaningful component and prop names
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks

### File Organization

- Use kebab-case for file names: `user-profile.tsx`
- Co-locate related files when appropriate
- Group by feature, not by file type

### Naming Conventions

- **Components**: PascalCase - `UserProfile`, `NotificationDropdown`
- **Functions/Variables**: camelCase - `getUserData`, `isLoading`
- **Constants**: UPPER_SNAKE_CASE - `MAX_FILE_SIZE`, `API_BASE_URL`
- **Types/Interfaces**: PascalCase - `User`, `NotificationProps`

### Code Quality

- Write self-documenting code with clear variable names
- Add comments for complex business logic
- Keep functions small and focused
- Avoid deep nesting (max 3-4 levels)
- Use early returns to reduce nesting

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features
- Test edge cases and error scenarios
- Ensure existing tests still pass
- Aim for meaningful test coverage

### Running Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms and business logic
- Keep README files updated

### Pull Request Documentation

- Describe what changes were made
- Explain why changes were made
- Include screenshots for UI changes
- Reference related issues

## 🔍 Code Review Process

1. **Automated Checks**: All PRs must pass CI checks (linting, type checking, build)
2. **Review**: At least one maintainer must approve
3. **Address Feedback**: Respond to review comments and make requested changes
4. **Merge**: Once approved, maintainers will merge your PR

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] No console.logs or debug code
- [ ] Environment variables are documented
- [ ] Breaking changes are documented

## 🐛 Reporting Bugs

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 💡 Suggesting Features

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- Clear description of the feature
- Problem it solves
- Proposed solution
- Alternatives considered
- Priority level

## 🤝 Community Guidelines

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Give constructive feedback
- Celebrate others' contributions
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## ❓ Questions?

- Check existing [Issues](https://github.com/your-username/collabflow/issues)
- Check [Discussions](https://github.com/your-username/collabflow/discussions)
- Open a new issue with the `question` label

## 🙏 Thank You!

Your contributions make CollabFlow better for everyone. We appreciate your time and effort!

