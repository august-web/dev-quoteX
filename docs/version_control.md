# Enhanced Version Control Implementation

## Pre-Push Verification
- Create snapshot: code, config, local data exports
- Testing checklist:
  - Core functionality: quote, summary, payment, onboarding
  - Edge cases: empty SRS, invalid card, coupon, no order id
  - Performance: build size, load time, CPU on analysis
- Document changes: affected components and risk assessment

## Commit Message Standards
- Format: `feat(scope): summary (#ticket)`
- Include: affected areas, risks, testing notes

## Repository Management
- Push to feature branches; avoid direct main
- Require PR reviews for merges to main

## Backup Retention
- Encrypted backups retained ≥30 days
- Store in separate regions/providers

