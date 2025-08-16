# Versioning Strategy Guide

## Current Version: 0.1.0-alpha

## Semantic Versioning (SemVer) for Pre-1.0 Software

This project follows **Semantic Versioning** with special considerations for pre-1.0 development.

### Version Format: `MAJOR.MINOR.PATCH-PRERELEASE`

For pre-1.0 software:
- **MAJOR**: Always 0 (indicates development/unstable API)
- **MINOR**: Breaking changes or significant features
- **PATCH**: Bug fixes and minor improvements
- **PRERELEASE**: Optional identifier (alpha, beta, rc)

## Version Progression Strategy

### Current: 0.1.0-alpha
The initial release with core functionality but incomplete features.

### When to Increment

#### Patch Version (0.1.0 → 0.1.1)
Increment when you:
- Fix bugs without adding features
- Update documentation
- Improve performance without changing behavior
- Make small UI tweaks
- Fix typos or small errors

Example commits:
- "Fix timer drift issue in focus sessions"
- "Correct XP calculation bug"
- "Update button hover states"

#### Minor Version (0.1.x → 0.2.0)
Increment when you:
- Add new features
- Make significant UI changes
- Refactor major components
- Add new database tables/fields
- Complete a roadmap phase

Example commits:
- "Add achievement unlock system"
- "Implement weekly analytics view"
- "Add project templates feature"

#### Prerelease Tags
- **alpha**: Early development, expect bugs (0.1.0-alpha)
- **beta**: Feature complete, testing phase (0.5.0-beta)
- **rc**: Release candidate, nearly stable (0.9.0-rc.1)
- **(none)**: Stable for that version (0.3.0)

## Practical Examples

```
0.1.0-alpha  → Initial release (current)
0.1.1-alpha  → Fixed critical bugs
0.1.2-alpha  → More bug fixes
0.2.0-alpha  → Added achievement system
0.2.1-alpha  → Fixed achievement bugs
0.3.0-alpha  → Added export functionality
0.3.0-beta   → Same features, entering testing
0.3.1-beta   → Beta testing fixes
0.4.0-beta   → Added keyboard shortcuts
0.5.0-beta   → Feature complete for MVP
0.5.1-rc.1   → Release candidate
0.5.1-rc.2   → Second release candidate
0.5.1        → Stable pre-1.0 release
0.6.0        → New feature cycle begins
...
0.9.x        → Final pre-1.0 versions
1.0.0        → First stable, production-ready release
```

## Git Tag Convention

Always tag releases in git:

```bash
# For versions with prerelease
git tag -a v0.1.0-alpha -m "Initial alpha release"

# For stable pre-1.0 versions
git tag -a v0.3.0 -m "Added export functionality"

# Push tags
git push origin --tags
```

## Version Milestones for Project Minerva

### Phase 1: Foundation (0.1 - 0.3)
- `0.1.0-alpha`: Initial release ✅
- `0.1.x`: Bug fixes and stability
- `0.2.0-alpha`: Complete CRUD operations
- `0.2.x`: Data persistence fixes
- `0.3.0-alpha`: Full error handling
- `0.3.0-beta`: Foundation phase complete

### Phase 2: Features (0.4 - 0.6)
- `0.4.0-beta`: Analytics enhancements
- `0.5.0-beta`: Achievement system complete
- `0.6.0-beta`: Export/Import functionality

### Phase 3: Polish (0.7 - 0.9)
- `0.7.0-beta`: Performance optimizations
- `0.8.0-rc`: Accessibility complete
- `0.9.0-rc`: Production preparations

### Production (1.0+)
- `1.0.0`: First stable release
- `1.x.x`: Follows standard SemVer

## Package.json Version Management

Update version in `package.json`:

```json
{
  "name": "project-minerva",
  "version": "0.1.0-alpha",
  ...
}
```

## Changelog Management

Maintain a `CHANGELOG.md` file:

```markdown
# Changelog

## [0.2.0-alpha] - 2024-XX-XX
### Added
- Achievement unlock system
- Session quality ratings

### Fixed
- Timer drift during long sessions

## [0.1.1-alpha] - 2024-XX-XX
### Fixed
- Critical XP calculation bug
- Database connection issues
```

## Decision Points

### When to remove "-alpha"?
When core features work reliably without critical bugs.

### When to move to "-beta"?
When all planned features for a phase are implemented.

### When to go to 1.0.0?
When the software is:
- Feature complete for MVP
- Thoroughly tested
- Documentation complete
- Ready for production use
- API stable (no breaking changes planned)

## Best Practices

1. **Commit messages**: Reference version changes
   ```
   feat: Add achievement system (bump to 0.2.0)
   fix: Correct XP calculation (0.1.1)
   ```

2. **Branch naming**: Use version branches for releases
   ```
   release/0.2.0
   hotfix/0.1.1
   ```

3. **Never decrease versions**: Always move forward

4. **Document breaking changes**: Clearly note in CHANGELOG

5. **Tag every release**: Makes rollbacks easier

6. **Version in UI**: Display version in settings/about

## Quick Reference

| Change Type | Version Bump | Example |
|------------|--------------|---------|
| Bug fix | Patch | 0.1.0 → 0.1.1 |
| New feature | Minor | 0.1.x → 0.2.0 |
| Breaking change (pre-1.0) | Minor | 0.2.x → 0.3.0 |
| Prerelease progression | Tag change | 0.3.0-alpha → 0.3.0-beta |
| Production ready | Major | 0.9.x → 1.0.0 |

## Current Action Items

1. You're at `0.1.0-alpha`
2. Next version will likely be `0.1.1-alpha` (bug fixes) or `0.2.0-alpha` (new features)
3. Tag your releases: `git tag -a v0.1.0-alpha -m "Initial alpha release"`
4. Update `package.json` with each version bump
5. Maintain a CHANGELOG.md file