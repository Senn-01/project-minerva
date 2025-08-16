# Focus Architect - Implementation Plan & Best Practices

## Core Philosophy
A productivity meta-layer tool that transforms how users capture, organize, and execute on ideas. It integrates GTD (Getting Things Done) principles with strategic visualization, data-driven insights, and subtle gamification for motivation. The user experience flows through three distinct "paintings" (pages): Strategic Map, Deep Focus, and Analytics.

## Three UI Variants (for MVP, Option 1 chosen)

### 1. Neo-Brutalism
- Bold colors, high contrast
- Thick borders (4-8px)
- Harsh shadows
- Raw typography
- Unconventional layouts

### 2. Glassmorphism  
- Frosted glass effects
- Transparency and blur
- Subtle borders
- Depth through layering
- Soft, elegant feel

### 3. Material Design
- Paper metaphor
- Bold colors with grid system
- Responsive animations
- Elevation shadow system
- Clean, structured layouts

## Implementation Strategy

### Phase 1: Foundation & Data Layer
**Goal**: Simple, robust foundation

1. **Project Setup**
   - React app with TypeScript
   - SQLite database setup
   - Tailwind CSS with three theme variants
   - Shadcn/ui components (Toast, Dialog, Button, etc.)
   - React Router for navigation
   - Entity schemas: CaptureItem, Project, FocusSession, Achievement
   - **Design Decision**: Use shadcn/ui components with neo-brutal styling rather than pure CSS
     - Leverage existing tools for accessibility and polish
     - Apply harsh shadows and thick borders via Tailwind classes
   - **TODO**: Define clear data model with relationships and constraints

2. **Navigation System**
   - Fixed bottom-right 2x2 quadrant ("Map", "Focus", "Data")
   - Keyboard shortcuts (CMD+Q/S/D)
   - Page transitions with Framer Motion

3. **Onboarding Tutorial (First-Time Users)**
   - **Philosophy**: Educational highlights with understanding checkboxes
   - **Tutorial Trigger Logic**:
     - IF user has 'onboarding_complete' flag in localStorage THEN skip tutorial entirely, show main app
     - ELSE IF user has 'onboarding_step' saved THEN resume from that step (1, 2, or 3)
     - ELSE start from Step 1 and UPDATE localStorage with current step
   - **Step 1 - The Capture System**:
     - Highlight: Capture bar (glowing outline)
     - Message: "This is your cognitive relief valve - a GTD-inspired capture system that's always present on every page. Dump any thought, idea, or task here instantly (CMD+C for quick access). You'll triage these later when you have time, keeping your mind clear for deep work."
     - User action: [□ Got it, my second brain]
     - **Interactions**:
       - IF user clicks outside highlight THEN keep overlay, pulse the highlight border gently
       - IF user tries capture bar during tutorial THEN allow it, auto-advance after first capture
       - IF checkbox clicked THEN save Step 2 to localStorage, fade transition (300ms) to next step
   - **Step 2 - Your Strategic Map**:
     - Highlight: Entire scatter plot area
     - Message: "Your projects visualized by cost (effort) vs benefit (impact). Add real projects you're working on - that client deadline, the side app you're building, or personal goals. The quadrants help you see at a glance what deserves your focus. Triage your captured items here when ready."
     - User action: [□ I see how this works]
     - **Interactions**:
       - IF checkbox clicked THEN save Step 3 to localStorage, fade transition (300ms) to next step
   - **Step 3 - Deep Focus Sessions**:
     - Highlight: Focus navigation button
     - Message: "This is where real work happens. Pick an active project, check your willpower level (be honest!), and dive into distraction-free focus. No pause button - we're building discipline here. Complete sessions earn XP based on difficulty."
     - User action: [□ Ready to focus]
     - **Interactions**:
       - IF checkbox clicked THEN mark tutorial complete in localStorage, remove step tracker, navigate to Strategic Map
   - **Visual Design**:
     - Dark overlay: `rgba(0,0,0,0.5)` on non-highlighted areas
     - Highlight: Soft white glow with pulsing border
     - Message box: Neo-brutal style, positioned near highlight
     - Checkbox: Large, satisfying to click
     - Progress dots: ●○○ at bottom
   - **User Control**:
     - Skip tutorial link (always visible, top-right)
     - IF Skip clicked THEN mark complete in localStorage, fade out (200ms), navigate to Strategic Map
     - No auto-advance - user controls pace
     - Checking box advances to next step
     - After Step 3, tutorial completes and never shows again

### Phase 2: Capture & Triage (Painting 1 - Part A)
**Goal**: A universal inbox for capturing thoughts and ideas with an refined GTD-style triage process. (Frictionless capture with intelligent triage)

3. **Quick Capture**
   - Floating input in header (always accessible)
   - CMD+C global hotkey
   - **Capture Logic**:
     - IF capture input is empty THEN Don't Do nothing until user add a capture.
     - ELSE IF capture length > 280 characters THEN show character count warning in red
     - ELSE save capture, clear input, UPDATE counter 
   - **Data Log**: Capture timestamp, source (manual/hotkey), initial text
   - Simple visual counter showing items awaiting triage
   - Counter UPDATE: Increment immediately on capture, decrement on triage

4. **Smart Triage System**
   - **Triage Button Behavior**:
     - Shows count badge: "Triage (3)" when items exist
     - IF no items THEN button is Hidden from UI
     - IF clicked THEN open triage modal (not inline)
   - **Triage Modal**:
     - Shows one capture item at a time
     - **Triage Options:**  
       - "Promote to Project" → Opens project creation form
         - IF user cancels form THEN return to triage modal, item remains in queue
         - IF project created THEN link capture to project, remove from queue, UPDATE counter
       - "Less than 2min? Consider doing it now" → If clicked, remove from queue.
       - "Routing" → Placeholder for future integrations (Notion/Todoist/Calendar)
       - "Not Relevant, Delete" → remove from system, UPDATE counter
   - Triage button appears on Strategic Map (next to "Add Project" and "Parking Lot")
   - **Data Log**: Capture-to-triage duration, triage decision, timestamp

### Phase 3: Strategic Project Map (Painting 1 - Part B)
**Goal**: Visual command center with instant project understanding

5. **Project Creation Form**
   - **Fields with Guidance:**
     - **Cost (Effort Score)**: 
       - "Rate the effort (1-10) based on your gut feeling:"
       - 1-3: Quick wins (<5 hours) - "Could finish in one sitting"
       - 4-6: Moderate effort (5-20 hours) - "Multiple work sessions needed"
       - 7-10: Major undertaking (>20 hours) - "Significant time investment"
     - **Benefit (Impact Score)**:
       - "Rate the potential impact (1-10) on your goals:"
       - 1-3: Minor improvement - "Nice to have, marginal benefit"
       - 4-6: Notable progress - "Clear value, moves the needle"
       - 7-10: Game-changer - "Transformative, unlocks new possibilities"
     - **Priority**: 
       - Must-Do (Critical/Deadline-driven)
       - Should-Do (Important but flexible)
       - Nice-to-Have (Valuable when time permits)
     - **Due Date**: Optional calendar picker
     - **Description/Link**: Free text for context and references
     - **Tags**: Categories for organization and achievements
       - **Core categories** (determines shape on scatter plot):
         - **Work**: Career, clients, income-generating activities
         - **Growth**: Learning, education, skill development
         - **Projects**: Building, creating, side ventures
         - **Life**: Health, relationships, personal maintenance
       - Select ONE primary category (required)
       - Add unlimited custom tags for granular organization
       - Auto-suggest previously used tags
     - **Status**: 
       - Active: "This Week's Focus" (appears on map)
       - Inactive: Available but not current priority (appears on map, dimmed)
       - Parking Lot: Someday/maybe (hidden from map, accessible via menu)
       - Graveyard: Discontinued projects (tracked in analytics, with lessons learned)

6. **Interactive Scatter Plot**
   - X-axis: Cost (effort required)
   - Y-axis: Benefit (impact/value)
   - **Visual Encoding:**
     - Shape: Geometric forms by primary category:
       - ● Circle: Work
       - ■ Square: Growth
       - ▲ Triangle: Projects
       - ◆ Diamond: Life
     - Color Intensity: Priority level (subtle to aggressive gold)
     - Pulse Animation: Projects approaching due date
     - Opacity: Full for active, 60% for inactive projects
   - **Smart Clustering**: When projects overlap at same cost/benefit position:
     - Check 15px radius for collisions
     - Try positions in order: N, E, S, W (at 15px), then NE, SE, SW, NW (at 21px)
     - Maximum displacement: 30px from true position
     - Draw thin connector line (1px, 30% opacity) to actual position if displaced
     - Hover shows true cost/benefit values
   - **Hover Interaction:**
     - Quick preview card shows: title, description, cost, benefit, priority, due date
     - **Quick Actions** appear without clicking:
       - [▶ Start Session] - Jump directly to focus mode
       - [★ Set Active] / [☆ Set Inactive] - Toggle weekly focus
       - [P] Parking Lot - Quick defer
   - **Click Interaction**:
     - Opens full edit modal with all options:
       - Toggle Active/Inactive status (checkbox: "This Week's Focus")
       - Mark Complete or Move to Graveyard
       - Edit all project details
       - Delete project
   - Quadrant labels (subtle, No-Brainer/Boss-Battle/Side-Quest/Trap-Zone)

7. **Project Management**
   - "Add Project" button - Direct project creation
   - "Parking Lot" button - Opens modal with someday/maybe projects
     - Projects in parking lot don't appear on map
     - Can promote to Active or Inactive status from modal
   - "Triage" button - Process captured items queue
     - Shows count: "Triage (3)"
     - Disabled/greyed when empty: "Triage (0)"
   - **Active Project Selection**:
     - **Visual Indicators**:
       - Active = Full opacity + "★" star indicator
       - Inactive = 60% opacity (dimmed)
     - **How to Activate**:
       - Hover → Click [★ Set Active] quick action
       - OR Click project → Check "This Week's Focus" in modal
       - Multiple projects can be active (your weekly commitments)
     - **Active Project Limits**:
       - Soft limit: 5 projects (shows warning: "Consider focusing on fewer projects")
       - Hard limit: 10 projects (prevents activation: "Deactivate a project first")
     - **Focus Session**: Only active projects appear in project selector
     - **Week Cycle**: Monday morning (Brussels time) to Sunday night
   - Status transitions:
     - Active ↔ Inactive (toggle weekly focus)
     - Any status → Parking Lot (defer for later)
     - Parking Lot → Active/Inactive (resurrect project)
     - Active/Inactive → Graveyard (discontinue with optional lessons learned)
     - Graveyard → Inactive (rare resurrection)

### Phase 4: Deep Focus (Painting 2)
**Goal**: Mindful monotasking with willpower awareness

8. **Pre-Focus Check & Daily Objective**
   - **Daily Objective Setting (Optional, First Session of Day)**:
     - Appears only on first focus session after midnight
     - "What's your commitment today?"
     - Session count selector: 1-10 sessions
     - Duration specification: "× 25min" / "× 60min" / "× 90min" / "Mixed"
     - Example display: "3 sessions × 60min" or "5 sessions × Mixed"
     - Warning: "This commitment resets at midnight"
     - Can skip: "No commitment today" option
     - Creates subtle accountability without constraint
     - User can do different durations than planned (flexibility)
   - **Empty State (No Active Projects)**:
     - Simple message: "📍 No Active Projects"
     - Single CTA: [GO TO STRATEGIC MAP]
     - No explanatory text
   - **Normal State (Has Active Projects)**:
     - Shows daily objective if set: "Today: 2/3 sessions × 60min" (updates live)
     - **Willpower Level Query** (with humor):
       - "🔥 On Fire!" (High willpower)
       - "☕ Caffeinated" (Medium)
       - "🥱 Running on Fumes" (Low)
     - Project selector (only active projects)
     - Session duration selector (25/60/90 min)

9. **Focus Session (During Session View)**
   - **Display Elements**:
     - Top: Daily objective progress if set: "Today: 2/3 sessions"
     - Center: Large countdown timer (e.g., "59:42")
     - Difficulty quote (e.g., "BALLS OF STEEL" ⚪⚪)
     - Project name prominently shown
     - Progress bar showing elapsed/remaining time
     - [STOP SESSION] button (no pause)
   - **Difficulty Quotes** (based on willpower + duration at start):
     - "Piece of Cake" (High willpower + 25min)
     - "Hey, Not Too Rough" (Medium willpower + 25min)
     - "Bring It On" (High willpower + 60min)
     - "Come Get Some" (Medium willpower + 60min)
     - "Damn I'm Good" (Low willpower + 25min)
     - "Crunch Time" (High willpower + 90min)
     - "Balls of Steel" ⚪⚪ (Medium willpower + 90min)
     - "Nightmare Deadline" (Low willpower + 60min)
     - "Hail to the King" 👑 (Low willpower + 90min)
   - No pause allowed (only stop, which marks session as incomplete)
   - **Interrupted Session Handling**:
     - Modal with optional categorization (Emergency/Lost Focus/Notification)
     - No XP awarded (respects "Earn, Don't Participate")
     - **Data Log**: Reason for stopping, timestamp, elapsed time
     - XP only displayed on Analytics page, never during session
   
   - **Post-Session Flow (Completed Session)**:
     - **Step 1 - Session Complete (Intrinsic Reward)**:
       - "60 minutes done ✓" (completion satisfaction)
       - "Time for your reward" (gentle nudge)
       - **Energy Check**: "Energy now?"
         - [🔥 Still fired up] [☕ Need that break] [🥱 Totally spent]
     - **Step 2 - Break/Reward Time**:
       - "Take a break?"
       - [5 min] [10 min] [15 min] [Custom ___]
       - [Continue without break]
       - Framing: User decides their reward (break, snack, walk, etc.)
     - **Break Timer (if selected)**:
       - Shows: "Break: 4:32"
       - No advice or suggestions
       - Soft sound when complete (optional)
     - **Subtle Gamification Rewards (Not Shown Here)**:
       - XP calculated and stored (only visible on Analytics)
       - Achievement progress updated (discovered later)
       - Daily objective incremented (visible on next session)
     - **After Break or Continue**:
       - Session logged to database
       - Page refreshes to start
       - Fresh willpower check ready
       - Habit loop complete
     - **Data Log**: All session metrics including:
       - Duration (planned vs actual)
       - Project ID
       - Willpower level (start)
       - Energy level (end)
       - Break duration (if taken)
       - Time of day
       - Completion status
       - Session difficulty score 


### Phase 5: Analytics (Painting 3)
**Goal**: Pure insights and silent rewards

10. **Data Visualizations**
    - **Focus Heatmap**: 14-day consistency view
    - **Daily Objective Tracking** (Future Implementation):
      - Compare committed vs completed sessions
      - Show patterns: "You hit 80% of your commitments"
      - No judgment, just data: "Committed: 3×60min, Completed: 5×25min"
      - Weekly trends of commitment accuracy
    - **Project Completed this Week**: Review of projects done and a counter
    - **Project Time Treemap**: Where time was invested
    - **Willpower Patterns**: Best times for deep work (high willpower/good session)
    - **Session Quality Trends**: Good/Average/Bad over time
    - **Personal Records**: Longest streak, best day, total hours

11. **Achievement System (MVP - Placeholder)**
    - Simple "Coming Soon" section at bottom of analytics
    - Greyed out achievement icons as teaser
    - Text: "Achievements - Coming Soon"
    - Visual: 3-4 locked badge icons with "?" marks
    - Sets expectation for future gamification

12. **Experience Points (XP) System**
    - **Visual Display**: ⚡ icon with number (e.g., "⚡ 1,250") near navigation
    - Hover tooltip: "XP earned this week"
    - Golden pulse animation when earning XP
    
    - **Difficulty Matrix** (willpower + duration combinations):
      - "Piece of Cake": High willpower + 25min = 0.5x multiplier
      - "Hey, Not Too Rough": Medium willpower + 25min = 1x multiplier
      - "Bring It On": High willpower + 60min = 1.5x multiplier
      - "Come Get Some": Medium willpower + 60min = 2x multiplier
      - "Damn I'm Good": Low willpower + 25min = 2x multiplier
      - "Crunch Time": High willpower + 90min = 2.5x multiplier
      - "Balls of Steel": Medium willpower + 90min = 3x multiplier
      - "Nightmare Deadline": Low willpower + 60min = 3.5x multiplier
      - "Hail to the King": Low willpower + 90min = 4x multiplier
    
    - **XP Calculation**:
      - **Focus Sessions**:
        - Base XP: 10 points (participation reward)
        - Duration bonus: (actual_minutes / 10)
        - Quality bonus: Excellent +10, Good +5, Challenging +2
        - Apply difficulty multiplier
        - Daily decay: 1st session 100%, 2nd 75%, 3rd 50%, 4th+ 25%
        - Typical range: 10-100 XP per session
      - **Project Completion**:
        - Formula: (Cost × Benefit × 10)
        - Example: Cost 8, Benefit 9 = 720 XP
        - Rewards tackling high-value, high-effort projects

13. **Project Graveyard**
    - **Visual**: 🪦 icon with count (e.g., "🪦 5") at bottom of analytics
    - No text label - icon communicates purpose
    - **Interactions**:
      - Default: Shows icon + count only
      - Hover on icon: Expands to show last 5 discontinued projects
      - Hover on project name: Details card appears with:
        - Date discontinued
        - Total hours invested
        - Lessons learned (if captured)
    - Muted colors, respectful presentation
    - Honors effort without judgment

## Best Practices

### 1. Cognitive Load Management
- **2-Second Rule**: Any visual should communicate its meaning within 2 seconds
- **Progressive Disclosure**: Show only what's needed, reveal details on demand
- **Consistent Visual Language**: Same colors, shapes, animations across all paintings

### 2. Habit Formation Principles
- **Immediate Rewards**: Every action should have instant positive feedback
- **Reduce Friction**: Maximum 2 clicks/taps to any core action
- **Build Streaks**: Visual continuity encourages consistency
- **Celebrate Small Wins**: First capture is as important as 100th

### 3. Visual Hierarchy
- **Gold Gradient**: Reserved for priority/importance
- **Pulse**: Urgency and deadlines
- **Size**: #todo - Not yet defined 
- **Position**: Strategic value (quadrants)
- **Shape**: Categories and tags

### 4. Data Philosophy & Logging Strategy
- **Track Everything, Show Selectively**:
  - Capture all interactions and metrics
  - Display only motivational insights to users
  - Store detailed logs for pattern analysis
  
- **Key Data Points to Log**:
  - **Capture Phase**: Timestamp, source, text, time-to-triage
  - **Triage Phase**: Decision type, processing duration, outcome
  - **Project Lifecycle**: Creation time, status changes, completion metrics
  - **Focus Sessions**: All timing data, difficulty scores, quality ratings
  - **User Patterns**: Peak productivity times, willpower trends, achievement progress
  
- **Privacy & Storage**:
  - All data stored locally in SQLite
  - No external analytics or tracking
  - User owns all their data
  
- **Presentation Principles**:
  - Frame all metrics positively
  - Compare to personal baselines, not others
  - Highlight improvements and streaks

### 5. User Flow Optimization
```
CAPTURE FLOW (Cognitive Relief):
Thought occurs → CMD+C (0.5 sec) → Type idea (2-5 sec) → Enter → 
Visual confirmation (toast) → Mind cleared → Continue current task

TRIAGE FLOW (Weekly Processing):
See "Triage (7)" badge → Click → Review first item (3 sec) → 
Decision: Project? 2-min task? Delete? → Process (5-30 sec) → 
Next item → Complete queue (3-5 min total) → Badge disappears

PROJECT CREATION FLOW (Strategic Planning):
From triage OR direct "Add Project" → Cost/Benefit sliders (10 sec) → 
Category selection (2 sec) → Optional details (20 sec) → 
Save → Animated appearance on map → Visual satisfaction

DAILY FOCUS FLOW (Execution):
Navigate to Focus → IF first session: Set daily objective (10 sec) → 
Select active project (2 sec) → Willpower check (2 sec) → 
Start timer → Deep work (25/60/90 min) → Timer ends → 
Energy check (2 sec) → Optional break → Session logged

WEEKLY REVIEW FLOW (Insights):
Monday morning → Navigate to Analytics → View heatmap (5 sec) → 
Check XP earned → Review completed projects → 
Notice patterns → Feel progress → Plan week ahead

ACHIEVEMENT DISCOVERY FLOW (Delight):
Complete action → Background calculation → IF achievement unlocked → 
Toast notification (4 sec) → Navigate to Analytics → 
View new badge → Read description → Dopamine hit
```

### 6. Emotional Design

**WILLPOWER CHECK (Permission to be Human)**
- Morning, high energy: "🔥 On Fire!" → User feels validated in their energy
- Post-lunch slump: "☕ Caffeinated" → Acknowledges the midday reality  
- End of day: "🥱 Running on Fumes" → No shame in being tired
- **Emotional Impact**: Removes guilt about energy levels, creates honest self-assessment

**POST-SESSION QUALITY RATING (Reflection Without Judgment)**
- After excellent session: "That felt great!" → Reinforces the high
- After struggling: "Hey, you showed up" → Validates effort over outcome
- After interruption: "Life happens" → Normalizes imperfection
- **Never says**: "You failed" or "Try harder" or "Disappointing"

**DIFFICULTY QUOTES (Gaming Nostalgia & Pride)**
- "Piece of Cake" → Slight disappointment? Too easy? Adjust next time
- "Balls of Steel" → Pride in attempting something hard when tired
- "Hail to the King 👑" → Ultimate bragging rights, screenshot-worthy
- **Emotional Arc**: From assessment → to challenge accepted → to pride in completion

**XP MOMENTS (Subtle Dopamine)**
- See "+47 XP" float up → Small hit of satisfaction
- Weekly total "⚡ 1,250" → Accumulated progress feels substantial
- Monday reset → Fresh start, not loss (previous week saved in history)
- **Never shown during focus**: Protects flow state from gamification interruption

**PROJECT GRAVEYARD (Honoring Effort)**
- 🪦 icon with count → Curiosity, not shame
- Hover reveals: "Client Project - 12 hours invested - Pivot to new direction"
- **Reframe**: Not failures, but learned experiences
- Option to resurrect → Nothing is permanently lost

**ACHIEVEMENT UNLOCKS (Genuine Surprise)**
- No progress bars during work → Discovery feels organic
- "Iron Will - 21 days straight" → Moment of "Wait, I did that?"
- Hidden achievements → "Phoenix Rising" appears unexpectedly
- **Timing**: Toast appears 2 seconds after action, not immediately (feels earned, not triggered)

**EMPTY STATES (Gentle Guidance)**
- No active projects: "📍 No Active Projects" → Simple, no lecture
- No captures: Empty space, no "Start capturing!" nag
- Zero XP: Just shows "⚡ 0" → Beginning, not behind
- **Philosophy**: Space to breathe, not pressure to perform

**ERROR STATES (Compassionate Recovery)**
- Session data lost: "We saved what we could. Your effort still counts."
- Can't activate 11th project: "Your focus has limits. Which project can wait?"
- Capture too long: Character count in red, not "ERROR: TOO LONG"
- **Tone**: Helper, not enforcer

### 7. Technical Implementation

#### Database Schema
The complete database schema with all corrections and enhancements is maintained in:
- **`schema-complete.sql`** - Full schema with tables, views, triggers, and indexes
- **`database-functions.sql`** - Helper functions for calculations and validations
- **`validation-tests.md`** - Validation test suite ensuring data integrity

Key tables include:
- `capture_items` - GTD-style capture with triage tracking
- `projects` - Full project lifecycle with completion tracking
- `focus_sessions` - Session metrics with quality ratings
- `daily_objectives` - Daily commitment tracking
- `xp_logs` - Experience points with multipliers
- `achievements` & `achievement_progress` - Gamification tracking
- `project_transitions` - State change history
- `streak_tracking` - Consecutive day tracking
- `weekly_summaries` - Analytics aggregation

See the schema files for complete implementation details including:
- All field definitions with proper constraints
- Foreign key relationships
- Calculated fields and triggers
- Performance indexes
- Helper views for common queries

#### Component Architecture
```
/src
  /components
    /shared 
      - Navigation.tsx
      - CaptureBar.tsx
      - ThemeProvider.tsx
    /strategic-map 
      - ScatterPlot.tsx
      - ProjectCard.tsx
      - QuadrantLabels.tsx
      - TriageModal.tsx
    /deep-focus 
      - Timer.tsx
      - WillpowerCheck.tsx
      - SessionFeedback.tsx
      - DifficultyIndicator.tsx
    /analytics 
      - FocusHeatmap.tsx
      - ProjectTreemap.tsx
      - AchievementGrid.tsx
      - SessionStats.tsx
      - XPIndicator.tsx
      - ProjectGraveyard.tsx
  /themes
    /neo-brutalism
    /glassmorphism
    /material
  /services
    - database.ts
    - analytics.ts
    - achievements.ts
    - xpCalculator.ts
  /animations
    - XPPulse.tsx
    - AchievementUnlock.tsx
```

### 8. Performance Targets
- Initial load: <2 seconds
- Capture response: <100ms
- Page transitions: <300ms
- Database queries: <50ms
- Animation FPS: 60fps minimum

### 9. Accessibility Guidelines
- Keyboard navigation for all interactions
- High contrast mode support
- Screen reader friendly labels
- Focus indicators visible
- Reduced motion option

### 10. Testing Strategy
- Unit tests for data logic
- Integration tests for user flows
- Visual regression tests for three themes
- Performance benchmarks
- User testing for willpower check humor

## Scope Boundaries (What We're NOT Building)
- **Not Included in MVP**:
  - Sub-task management within projects
  - Social features or sharing capabilities
  - Mobile app (web-first approach)
  - Project dependencies or Gantt charts
  - External integrations (except routing placeholders)
  - Health/wellness tracking (fitness, meditation, nutrition)
  - Team collaboration or multi-user support
  - Automatic time tracking outside focus sessions
  - AI-powered suggestions or insights
  - Project templates or automation
  - **TODO**: Add rationale for each exclusion (focus on core value, reduce complexity, maintain simplicity)

## Success Indicators
- User completes first capture within 30 seconds
- Triage queue processed weekly
- Average 3+ focus sessions per week
- 50% of sessions rated "Good"
- First achievement unlocked in first session
- Projects move from parking lot to active monthly

## Future Enhancements (Post-MVP)

### Achievement System (Full Implementation)
- **Achievement Notification**: 
  - Shadcn/ui Toast with neo-brutal styling
  - Position: top-right, auto-dismiss after 4 seconds
  - Styling: `border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.9)]`
- **Challenging Achievements** (require genuine effort):
  - **Consistency**: "Iron Will" (21 consecutive days), "Weekend Warrior" (4 weeks of weekends)
  - **Category Masters**: "Career Climber" (100hr Work), "Knowledge Seeker" (15 Growth projects)
  - **Difficulty Champions**: "Balls of Steel Legend" (25 sessions), "Low Battery Champion" (20 low willpower)
  - **Strategic**: "Boss Slayer" (10 high-cost/high-benefit), "Trap Dodger" (2 months no trap-zone)
  - **Hidden**: "Phoenix Rising" (resurrect 3 projects), "Perfect Week" (100% completion)
- Achievement detection logic after each user action
- Progress tracking toward each achievement

### Other Post-MVP Features
- Integration with external tools (Notion, Todoist, Calendar)
- Voice capture option
- Mobile responsive design
- Export data functionality
- Custom achievement creation
- Team/accountability features
- AI insights from patterns
- Time block planning
- Project templates
- **Character Classes System**: Unlock user archetypes after 1 week of data
  - Time-based classes (Night Owl, Morning Warrior, etc.)
  - Style-based classes (Sprint Master, Marathon Runner, etc.)
  - Strategy-based classes (Quick Winner, Boss Battler, etc.)
  - Display primary and secondary class with visual badges
- **Weekly Boss Battles**: Featured project with bonus XP
  - Auto-select highest cost+benefit project each Monday
  - Or manual designation option
  - 2.5x XP multiplier for focus sessions
  - Special visual indicator on map
- **End-of-Week Recap**: Personalized insights email/notification
  - XP earned this week vs last week
  - Projects completed and time invested
  - Character class progression
  - Motivational message based on performance

## Design Principles Summary
1. **Visual is Prime**: Communicate through visual cues, not text
2. **Minimum Friction**: Reduce cognitive load at every step
3. **Everything is Data**: Track for insights, display for motivation
4. **Silent Gamification**: Reward without disrupting flow
5. **Cognitive Relief**: Free the mind by externalizing thoughts
6. **Mindful Monotasking**: One project, one focus, one outcome

This implementation plan balances simplicity with perfect execution, ensuring each feature serves the core mission of transforming mental projects into visual, manageable, and rewarding experiences.