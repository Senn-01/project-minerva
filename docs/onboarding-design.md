# Focus Architect - Onboarding Design

## Philosophy
Arc Browser-inspired onboarding that teaches through doing, not explaining. Users discover functionality by using it, with subtle visual highlights guiding the way. One-time experience that respects user intelligence.

## Design Principles
1. **Educational Focus**: Explain the "why" behind each feature
2. **Progressive Disclosure**: 3 steps maximum
3. **User-Controlled Pace**: Checkbox acknowledgment to advance
4. **Always Skippable**: Respect user autonomy
5. **One-Time Only**: Never re-appears after completion

## Visual Design

### Overlay Style
```css
/* Non-highlighted areas */
.onboarding-overlay {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

/* Highlighted element */
.highlight-area {
  position: relative;
  z-index: 10001;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

/* Tooltip */
.onboarding-tooltip {
  background: white;
  color: black;
  border: 4px solid black;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.9);
  padding: 12px 20px;
  font-weight: bold;
  animation: subtle-bounce 2s ease-in-out infinite;
}

/* Progress dots */
.progress-dots {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0.6;
}
```

## Onboarding Flow

### Step 1: The Capture System
**Trigger**: Page load for first-time user
**Highlight**: Capture bar in header
**Action Required**: Check understanding checkbox

```
Visual Layout:
┌────────────────────────────────────────────────────────────────┐
│ [Skip Tutorial]                                                 │
│                                                                 │
│        [====Capture Bar Highlighted====]                       │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                  The Capture System                        │ │
│ │                                                             │ │
│ │ This is your cognitive relief valve - a GTD-inspired       │ │
│ │ capture system that's always present on every page.        │ │
│ │ Dump any thought, idea, or task here instantly (CMD+C      │ │
│ │ for quick access). You'll triage these later when you      │ │
│ │ have time, keeping your mind clear for deep work.          │ │
│ │                                                             │ │
│ │            [□ Got it, my second brain]                     │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    ● ○ ○                                       │
└────────────────────────────────────────────────────────────────┘
```

**Completion**: User checks box → Advance to Step 2

### Step 2: Your Strategic Map
**Trigger**: After Step 1 completion
**Highlight**: Strategic Map scatter plot area
**Action Required**: Check understanding checkbox

```
Visual Layout:
┌────────────────────────────────────────────────────────────────┐
│ [Skip Tutorial]                                                 │
│                                                                 │
│      [Strategic Map Area Highlighted - Scatter Plot]           │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                  Your Strategic Map                        │ │
│ │                                                             │ │
│ │ Your projects visualized by cost (effort) vs benefit       │ │
│ │ (impact). Add real projects you're working on - that       │ │
│ │ client deadline, the side app you're building, or          │ │
│ │ personal goals. The quadrants help you see at a glance     │ │
│ │ what deserves your focus. Triage your captured items       │ │
│ │ here when ready.                                           │ │
│ │                                                             │ │
│ │            [□ I see how this works]                        │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    ○ ● ○                                       │
└────────────────────────────────────────────────────────────────┘
```

**Completion**: User checks box → Advance to Step 3

### Step 3: Deep Focus Sessions
**Trigger**: After Step 2 completion
**Highlight**: Focus navigation button
**Action Required**: Check understanding checkbox

```
Visual Layout:
┌────────────────────────────────────────────────────────────────┐
│ [Skip Tutorial]                                                 │
│                                                                 │
│              Navigation Grid                                   │
│         ┌─────────┬─────────┐                                 │
│         │   Map   │ [FOCUS] │← Highlighted                    │
│         ├─────────┼─────────┤                                 │
│         │  Data   │         │                                 │
│         └─────────┴─────────┘                                 │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │                Deep Focus Sessions                         │ │
│ │                                                             │ │
│ │ This is where real work happens. Pick an active project,   │ │
│ │ check your willpower level (be honest!), and dive into     │ │
│ │ distraction-free focus. No pause button - we're building   │ │
│ │ discipline here. Complete sessions earn XP based on        │ │
│ │ difficulty.                                                 │ │
│ │                                                             │ │
│ │                 [□ Ready to focus]                         │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    ○ ○ ●                                       │
└────────────────────────────────────────────────────────────────┘
```

**Completion**: User checks box → Tutorial completes, overlay fades

## Technical Implementation

### localStorage Keys
```javascript
const ONBOARDING_KEYS = {
  COMPLETE: 'fa_onboarding_complete',     // 'true' | 'false'
  CURRENT_STEP: 'fa_onboarding_step',     // 'capture' | 'project' | 'focus'
  SKIPPED: 'fa_onboarding_skipped',       // 'true' if user skipped
  STARTED_AT: 'fa_onboarding_started'     // timestamp
};
```

### Component Structure
```typescript
// OnboardingOverlay.tsx
interface OnboardingState {
  isActive: boolean;
  currentStep: 'capture' | 'project' | 'focus' | 'complete';
  hasSkipped: boolean;
}

// Auto-advance triggers
const stepTriggers = {
  capture: 'first_capture_submitted',
  project: 'first_project_created',
  focus: 'navigated_to_focus'
};

// Completion actions
const onComplete = () => {
  localStorage.setItem(ONBOARDING_KEYS.COMPLETE, 'true');
  fadeOutOverlay();
  // Never show again
};
```

### Skip Behavior
- Skip button always visible in top-right
- Clicking skip:
  1. Immediately removes overlay
  2. Sets `fa_onboarding_skipped: true`
  3. Sets `fa_onboarding_complete: true`
  4. Never shows onboarding again

### Edge Cases
1. **User refreshes during onboarding**: Resume from current step
2. **User navigates away**: Maintain step state
3. **User creates project before capture**: Skip to appropriate step
4. **User immediately goes to Focus**: Show "no active projects" state normally

## Animation Details

### Subtle Bounce (for tooltips)
```css
@keyframes subtle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

### Highlight Pulse (for buttons)
```css
@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Fade Transitions
- Overlay fade in: 300ms ease-out
- Step transitions: 200ms ease-in-out
- Completion fade out: 500ms ease-in

## What We're NOT Doing
- ❌ No welcome screens
- ❌ No feature explanations
- ❌ No "tour" of all features
- ❌ No video tutorials
- ❌ No re-engagement prompts
- ❌ No progress bars (just dots)
- ❌ No celebration on completion
- ❌ No user data collection

## Success Metrics
- User completes all 3 steps: Success
- User skips but creates project: Success
- User skips but completes session: Success
- User never returns: Learn and iterate

## Inspiration Reference
Arc Browser's onboarding:
- Highlights one thing at a time
- Teaches by doing
- Respects user time
- Assumes intelligence
- Delightful but not overwhelming

---

*Remember: The best onboarding is invisible. Users should feel like they discovered the app themselves.*