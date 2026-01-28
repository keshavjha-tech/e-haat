# CONTRIBUTING GUIDE

## Welcome to e-Haat!

Thank you for your interest in contributing to the e-Haat project. This document provides guidelines and instructions for contributing.

---

## Code of Conduct

All contributors must follow these principles:

- Be respectful and inclusive
- Welcome diverse perspectives
- Give credit to others
- Report issues responsibly
- Follow project guidelines

---

## Getting Started

### 1. Fork the Repository

```bash
Click "Fork" on GitHub to create your own copy
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/e-haat.git
cd e-haat
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/keshavjha-tech/e-haat.git
```

### 4. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 5. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

---

## Types of Contributions

### 1. Bug Reports

Create an issue with:

- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details

### 2. Feature Requests

Include:

- Clear description of feature
- Use cases
- Implementation suggestions (optional)
- Mock-ups (optional)

### 3. Code Contributions

- Fix bugs
- Add features
- Improve documentation
- Optimize performance

### 4. Documentation

- Fix typos
- Clarify instructions
- Add examples
- Translate docs

---

## Development Workflow

### 1. Set Up Development Environment

```bash
# Backend
cd server
npm install
touch .env
# Add environment variables (see SETUP_GUIDE.md)
npm run start

# Frontend (in new terminal)
cd client
npm install
npm run dev
```

### 2. Create Feature Branch

```bash
# Branch naming convention
git checkout -b feature/add-user-reviews
git checkout -b bugfix/cart-calculation-error
git checkout -b docs/improve-setup-guide
```

### 3. Make Changes

- Follow coding standards (see DEVELOPMENT_GUIDE.md)
- Write clean, readable code
- Add comments for complex logic
- Update related tests

### 4. Test Changes

#### Frontend Testing

```bash
cd client
npm run lint
npm run build
```

#### Backend Testing

```bash
cd server
npm run test
```

### 5. Commit Changes

```bash
# Follow conventional commits
git add .
git commit -m "feat(auth): add two-factor authentication"

# Examples:
# feat(cart): add bulk discount calculation
# fix(payment): resolve payment verification issue
# docs(readme): update installation steps
# style(code): format code with prettier
# refactor(api): optimize database queries
# test(user): add login tests
```

### 6. Push Changes

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in PR template:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## How to Test

Steps to verify the changes work

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### 8. Respond to Reviews

- Be open to feedback
- Make requested changes
- Explain your reasoning if you disagree

### 9. After Approval

- Squash commits if requested
- Rebase on main branch
- Maintainer will merge

---

## Coding Standards

### JavaScript/React Standards

```javascript
// Use camelCase for variables and functions
const userName = "John";
const fetchUserData = () => {};

// Use PascalCase for components
function UserProfile() {}

// Use meaningful names
// Bad: let x = 0;
let userCount = 0;

// Use const by default, let when needed
const API_URL = "http://localhost:8080";
let isLoading = true;

// Arrow functions for callbacks
const handleClick = () => {};

// Destructuring
const { name, email } = user;

// Template literals
const message = `Hello, ${name}!`;
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>

Types: feat, fix, docs, style, refactor, test, chore
Scope: auth, cart, payment, etc.
Subject: imperative, lowercase, no period
Body: explain what and why, not how
Footer: references issues

Example:
feat(auth): add email verification

Users can now verify their email address
during registration to enhance security.

- Add verification email template
- Create email verification endpoint
- Add verification status to user model

Closes #123
```

### CSS/Styling

- Use Tailwind CSS classes
- Mobile-first approach
- Consistent spacing
- Semantic HTML

### Documentation

- Update relevant docs when changing code
- Add JSDoc comments for functions
- Keep README and API docs current

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Commits are atomic and well-described
- [ ] Branch is up to date with main

### PR Title Format

```
<type>: <description>

Examples:
feat: add product wishlisting functionality
fix: resolve cart total calculation error
docs: update payment integration guide
refactor: optimize database queries
```

### PR Description Template

```markdown
## Summary

Brief overview of changes

## Problem Statement

What problem does this solve?

## Solution

How does this fix/implement the problem?

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

How to test the changes?

## Screenshots

Before/after if applicable

## Checklist

- [ ] Tests added
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Code follows standards
```

---

## Testing Requirements

### Backend Tests

```bash
npm run test
```

New features must have:

- Unit tests for functions
- Integration tests for API endpoints
- Error handling tests

### Frontend Tests

- Visual regression tests
- Component tests
- User interaction tests

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Performance acceptable

---

## Issue Labels

Use appropriate labels when creating issues:

- `bug`: Something isn't working
- `enhancement`: New feature request
- `documentation`: Docs improvement
- `good first issue`: Good for new contributors
- `help wanted`: Extra attention needed
- `question`: Questions about project
- `wontfix`: Will not be worked on

---

## Review Process

1. **Automated Checks**: GitHub Actions runs linting and tests
2. **Code Review**: At least one maintainer reviews code
3. **Feedback**: Review comments provided
4. **Updates**: Author makes requested changes
5. **Approval**: Reviewers approve changes
6. **Merge**: Code merged into main branch

---

## Documentation Contributions

### Updating Docs

1. Edit markdown files
2. Check formatting with preview
3. Submit PR with changes
4. Maintainer reviews
5. Merge and update live docs

### Creating New Docs

1. Identify documentation gap
2. Create detailed guide
3. Include examples
4. Add to documentation index
5. Submit PR

### Good Documentation Has

- Clear title
- Table of contents
- Step-by-step instructions
- Code examples
- Troubleshooting section
- Related links

---

## Common Contribution Scenarios

### Fixing a Bug

1. Create issue describing bug
2. Create bugfix branch: `git checkout -b bugfix/issue-description`
3. Fix the bug
4. Add test to prevent regression
5. Submit PR

### Adding a Feature

1. Discuss feature in issues first
2. Create feature branch: `git checkout -b feature/feature-name`
3. Implement feature
4. Add tests
5. Update documentation
6. Submit PR

### Improving Documentation

1. Create branch: `git checkout -b docs/improvement-description`
2. Edit documentation files
3. Check formatting
4. Submit PR

### Performance Improvement

1. Identify bottleneck
2. Create branch: `git checkout -b perf/improvement-description`
3. Optimize code
4. Add benchmarks showing improvement
5. Submit PR

---

## Getting Help

### Resources

- [Architecture Documentation](ARCHITECTURE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Setup Guide](SETUP_GUIDE.md)

### Questions

- Check documentation first
- Search existing issues
- Ask in GitHub discussions
- Contact maintainers

### Contact

- Email: keshavjha.tech@gmail.com
- GitHub Issues: For bugs and features
- Discussions: For questions and ideas

---

## Recognition

Contributors will be:

- Listed in README
- Mentioned in release notes
- Given credit in code comments

---

## Project Governance

### Decision Making

- Maintainers make final decisions
- Community input is valued
- Features discussed before implementation
- Issues triaged and prioritized

### Maintainers

- Review and merge PRs
- Manage releases
- Set direction
- Respond to issues

---

## License

By contributing, you agree that your contributions will be licensed under the project's license (usually ISC or MIT).

---

## Conclusion

Thank you for contributing to e-Haat! Your efforts help make this project better for everyone.

Happy coding!
