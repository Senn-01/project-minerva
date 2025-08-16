# Project Minerva - Claude Assistant Reference

## Project Overview
Project Minerva is a productivity meta-layer tool that combines GTD principles, strategic visualization, and subtle gamification to help users manage projects and focus sessions.

## Key Features
1. **Strategic Map**: Visual scatter plot showing projects by cost/benefit
2. **Deep Focus**: Timer-based focus sessions with willpower tracking
3. **Analytics**: Data visualizations and achievement system
4. **Capture System**: GTD-style quick capture with triage
5. **Gamification**: XP system and challenging achievements

## Technical Stack
- **Frontend**: React with TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS with neo-brutalist theme
- **Components**: shadcn/ui styled with brutal aesthetics
- **Routing**: React Router v6
- **State**: React Context + hooks
- **Build**: Vite

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run Playwright tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Project Structure
```
/src
  /components     - React components
    /shared       - Shared components (Navigation, CaptureBar)
    /strategic-map - Strategic Map components
    /deep-focus   - Focus session components
    /analytics    - Analytics visualizations
  /hooks          - Custom React hooks
  /context        - React Context providers
  /lib            - Utilities and helpers
    /db           - Database connection and queries
  /themes         - Neo-brutalist theme configuration
  /types          - TypeScript type definitions
```

## Database Schema
- Complete schema in `/docs/schema-complete.sql`
- Key tables: projects, focus_sessions, capture_items, xp_logs, achievements
- Uses triggers for automatic updates
- Brussels timezone for week calculations

## Design Principles
1. **Visual-first**: Communicate through visuals, not text
2. **Minimum friction**: Reduce cognitive load
3. **Silent gamification**: Reward without disrupting flow
4. **Productive rebellion**: Gaming terminology with serious purpose
5. **Earn, don't participate**: Achievements require genuine effort

## Key User Flows
1. **Capture → Triage → Project**: Quick thought capture with GTD triage
2. **Project Management**: Visual scatter plot with quadrant organization
3. **Focus Sessions**: Willpower check → Timer → Quality rating → XP
4. **Analytics Review**: Heatmaps, treemaps, and achievement discovery

## Testing Strategy
- Unit tests for data logic
- Integration tests for user flows
- Visual regression tests for themes
- Playwright for E2E testing

## Critical Validations
✅ All database schema issues resolved
✅ Data flow validated for all user journeys
✅ Coherence test recommendations implemented
✅ Edge cases handled

## Known Constraints
- Local-first (no cloud sync)
- Single user (no collaboration)
- Desktop-focused (mobile later)
- No external integrations (MVP)

## Success Metrics
- User completes first capture within 30 seconds
- Average 3+ focus sessions per week
- 50% of sessions rated "Good"
- Projects move through lifecycle monthly

## Contact for Issues
Report issues at: https://github.com/anthropics/claude-code/issues

---
*This document helps Claude understand the project context for future sessions.*