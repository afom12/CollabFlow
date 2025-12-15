# Contributing to CollabFlow

Thank you for your interest in contributing to CollabFlow! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/collabflow.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see `.env.example`)
5. Set up the database: `npx prisma migrate dev`
6. Run the development server: `npm run dev`

## Development Guidelines

### Code Style

- Use TypeScript with strict mode enabled
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use clear, descriptive commit messages
- Follow conventional commits format when possible
- Reference issue numbers when applicable

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Update documentation if needed
5. Submit a pull request with a clear description

## Project Structure

- `app/` - Next.js app router pages and routes
- `components/` - React components
- `lib/` - Utility functions, actions, and configurations
- `prisma/` - Database schema and migrations
- `types/` - TypeScript type definitions

## Testing

- Write tests for new features
- Ensure existing tests still pass
- Aim for high test coverage

## Questions?

Feel free to open an issue for any questions or clarifications.

