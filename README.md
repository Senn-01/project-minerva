# Project Minerva

**Version: 0.1.0-alpha**

A productivity meta-layer tool that combines GTD principles, strategic visualization, and subtle gamification to help users manage projects and focus sessions.

## 🎯 Current Status: Early Alpha

This is an early-stage development version. Core functionality is implemented but requires extensive testing, refinement, and feature completion before reaching beta status.

## 🚀 Features

### ✅ Implemented (v0.1.0)
- **Strategic Map**: Interactive scatter plot visualization for project cost/benefit analysis
- **Deep Focus Timer**: Session-based focus system with willpower checks
- **Capture System**: GTD-style quick capture with triage functionality
- **Analytics Dashboard**: Basic heatmaps, treemaps, and achievement grid
- **XP System**: Experience points tracking and leveling
- **Database Layer**: SQLite with complete schema and triggers
- **Neo-Brutalist UI**: Bold, distinctive interface with shadcn components

### 🚧 In Progress
- Session quality rating system
- Achievement unlock mechanics
- Project lifecycle management
- Onboarding flow refinement

### 📋 Roadmap to v1.0

#### Phase 1: Foundation (v0.1 - v0.3) **← We are here**
- [x] Core database schema
- [x] Basic UI components
- [x] Navigation and routing
- [ ] Complete data persistence
- [ ] Full CRUD operations for all entities
- [ ] Comprehensive error handling
- [ ] Input validation across all forms

#### Phase 2: Feature Completion (v0.4 - v0.6)
- [ ] Weekly/monthly analytics views
- [ ] Achievement system with 50+ achievements
- [ ] Project templates and presets
- [ ] Bulk operations (archive, delete, move)
- [ ] Keyboard shortcuts for power users
- [ ] Export functionality (CSV, JSON)
- [ ] Backup and restore system
- [ ] Dark/light theme toggle

#### Phase 3: Polish & Enhancement (v0.7 - v0.9)
- [ ] Performance optimization
- [ ] Accessibility improvements (WCAG AA)
- [ ] Advanced filtering and search
- [ ] Custom achievement creation
- [ ] Statistics and insights engine
- [ ] Time-based notifications
- [ ] Session replay functionality
- [ ] Integration with calendar systems

#### Phase 4: Production Ready (v1.0)
- [ ] Comprehensive test coverage (>80%)
- [ ] Documentation for all features
- [ ] Migration system for updates
- [ ] Telemetry and crash reporting (opt-in)
- [ ] Multi-platform packaging (Windows, Mac, Linux)
- [ ] Auto-update mechanism
- [ ] User feedback system

## 🔮 Future Vision (Post v1.0)
- Cloud sync and backup
- Mobile companion app
- Team collaboration features
- AI-powered insights
- Third-party integrations (Notion, Obsidian, etc.)
- Plugin system for extensibility
- Multiple language support

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS + Neo-brutalist theme
- **Build**: Vite
- **Testing**: Vitest + Playwright

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 📊 Project Structure
```
src/
├── components/     # React components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utilities and database
├── pages/          # Page components
├── themes/         # Design system
└── types/          # TypeScript definitions
```

## 🐛 Known Issues
- Session timer may drift during long sessions
- Achievement calculations need optimization
- Some animations cause layout shift
- Database migrations not yet implemented

## 🤝 Contributing
This project is in active development. Contributions are welcome but please note that the architecture and design decisions are still evolving.

## 📝 License
[License to be determined]

## 🔗 Links
- [Implementation Plan](docs/implementation-plan.md)
- [Product Philosophy](docs/product-philosophy.md)
- [Database Schema](docs/schema-complete.sql)
- [Versioning Strategy](docs/versioning-strategy.md)

---

**Current Focus**: Stabilizing core features and establishing robust data persistence before adding new functionality.