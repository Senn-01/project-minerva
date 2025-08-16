-- Focus Architect Complete Database Schema
-- Version: 1.0 (MVP)
-- Description: Complete schema with all fixes from validation
-- Timezone: All week calculations use Brussels timezone (UTC+1/+2)

-- ============================================
-- CORE TABLES
-- ============================================

-- Capture items table for GTD-style quick capture
CREATE TABLE capture_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    source VARCHAR(20) DEFAULT 'manual', -- 'manual' or 'hotkey'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triaged_at TIMESTAMP,
    triage_decision VARCHAR(50), -- 'project', 'quick_task', 'routed', 'deleted'
    outcome_data JSON, -- Store additional context
    resulting_project_id INTEGER, -- NEW: Link to created project
    FOREIGN KEY (resulting_project_id) REFERENCES projects(id)
);

-- Projects table with complete tracking
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL CHECK (cost >= 1 AND cost <= 10),
    benefit INTEGER NOT NULL CHECK (benefit >= 1 AND benefit <= 10),
    priority VARCHAR(20) NOT NULL DEFAULT 'should_do', -- 'must_do', 'should_do', 'nice_to_have'
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'parking_lot', 'completed', 'graveyard'
    category VARCHAR(20) NOT NULL, -- Primary: 'work', 'growth', 'projects', 'life'
    custom_tags JSON, -- Array of user-defined tags
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Completion tracking
    actual_completed_at TIMESTAMP, -- NEW: When actually completed (not graveyard)
    completion_week INTEGER, -- NEW: Week number when completed (Brussels time)
    completed_at TIMESTAMP, -- When moved to completed or graveyard status
    
    -- Metrics
    total_focus_time INTEGER DEFAULT 0, -- Accumulated from sessions (minutes)
    session_count INTEGER DEFAULT 0, -- NEW: Total number of sessions
    
    -- Graveyard data
    lessons_learned TEXT, -- Captured when moving to graveyard
    
    -- Indexes for common queries
    INDEX idx_projects_status (status),
    INDEX idx_projects_category (category),
    INDEX idx_projects_completion_week (completion_week)
);

-- Daily objectives for accountability
CREATE TABLE daily_objectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL, -- One objective per day
    session_count INTEGER NOT NULL, -- Target number of sessions
    session_duration INTEGER, -- NEW: Changed from VARCHAR to INTEGER (minutes)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_sessions INTEGER DEFAULT 0, -- Updated as sessions complete
    total_minutes_planned INTEGER, -- Calculated from count × duration
    total_minutes_actual INTEGER DEFAULT 0, -- Actual time spent
    
    INDEX idx_daily_objectives_date (date)
);

-- Focus sessions with complete metrics
CREATE TABLE focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    daily_objective_id INTEGER,
    
    -- Duration tracking
    planned_duration INTEGER NOT NULL, -- in minutes
    actual_duration INTEGER NOT NULL, -- in minutes
    
    -- Session quality metrics
    willpower_level VARCHAR(20) NOT NULL, -- 'high', 'medium', 'low' (start)
    energy_level VARCHAR(20), -- 'fired_up', 'need_break', 'spent' (end)
    quality_rating VARCHAR(20), -- NEW: 'excellent', 'good', 'average', 'challenging', 'bad'
    
    -- Difficulty and XP
    difficulty_quote VARCHAR(50), -- NEW: Store the actual quote shown
    difficulty_multiplier DECIMAL(3,2), -- NEW: Store calculated multiplier
    session_number_today INTEGER DEFAULT 1, -- NEW: For daily XP decay
    
    -- Status tracking
    completion_status VARCHAR(20) NOT NULL, -- 'completed', 'interrupted'
    interruption_reason TEXT,
    break_duration INTEGER, -- in minutes, if break taken
    
    -- Timestamps
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP NOT NULL,
    
    -- Calculated fields (can be derived but stored for performance)
    time_of_day VARCHAR(20), -- 'morning', 'afternoon', 'evening', 'night'
    day_of_week INTEGER, -- 0=Sunday, 6=Saturday
    week_number INTEGER, -- Week of year (Brussels time)
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (daily_objective_id) REFERENCES daily_objectives(id),
    
    INDEX idx_sessions_project (project_id),
    INDEX idx_sessions_date (started_at),
    INDEX idx_sessions_week (week_number)
);

-- Quick tasks (2-minute rule from GTD)
CREATE TABLE quick_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    capture_item_id INTEGER,
    label VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER,
    
    FOREIGN KEY (capture_item_id) REFERENCES capture_items(id)
);

-- ============================================
-- GAMIFICATION TABLES
-- ============================================

-- XP logs for tracking points
CREATE TABLE xp_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    points_earned INTEGER NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'session', 'completion'
    source_id INTEGER, -- session_id or project_id
    
    -- Multiplier breakdown for transparency
    multipliers JSON, -- {difficulty: 2.0, daily_position: 0.75, bonus: 1.0}
    
    -- Timestamps and aggregation
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    week_number INTEGER NOT NULL, -- For weekly aggregation (Brussels time)
    
    INDEX idx_xp_week (week_number),
    INDEX idx_xp_date (earned_at)
);

-- Achievements table
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(50) NOT NULL, -- 'consistency', 'category_master', 'difficulty_champion', 'strategic'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements JSON, -- {days: 21, projects: 10, etc.}
    points_value INTEGER DEFAULT 0,
    icon VARCHAR(50), -- Icon identifier
    unlocked_at TIMESTAMP,
    user_id INTEGER DEFAULT 1, -- For future multi-user support
    
    INDEX idx_achievements_type (type),
    INDEX idx_achievements_unlocked (unlocked_at)
);

-- NEW: Achievement progress tracking
CREATE TABLE achievement_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    user_id INTEGER DEFAULT 1,
    
    -- Progress metrics
    current_value INTEGER DEFAULT 0,
    target_value INTEGER NOT NULL,
    
    -- Metadata for complex achievements
    metadata JSON, -- {streak_start_date, projects_completed: [...], etc.}
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    UNIQUE(achievement_type, achievement_name, user_id),
    INDEX idx_achievement_progress_user (user_id)
);

-- ============================================
-- TRACKING TABLES
-- ============================================

-- NEW: Project state transitions history
CREATE TABLE project_transitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    transitioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    INDEX idx_transitions_project (project_id),
    INDEX idx_transitions_date (transitioned_at)
);

-- NEW: Streak tracking for consecutive days
CREATE TABLE streak_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    streak_type VARCHAR(50) NOT NULL, -- 'daily_sessions', 'weekend_warrior', etc.
    
    -- Streak data
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Dates
    streak_start_date DATE,
    last_activity_date DATE,
    longest_streak_start DATE,
    longest_streak_end DATE,
    
    -- Metadata
    metadata JSON, -- Additional tracking data
    
    UNIQUE(user_id, streak_type),
    INDEX idx_streaks_user (user_id)
);

-- ============================================
-- ANALYTICS SUPPORT TABLES
-- ============================================

-- NEW: Weekly summaries for performance
CREATE TABLE weekly_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    user_id INTEGER DEFAULT 1,
    
    -- Metrics
    total_sessions INTEGER DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    projects_abandoned INTEGER DEFAULT 0,
    
    -- Quality metrics
    average_session_quality DECIMAL(3,2),
    high_willpower_percentage DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    
    -- Best performance
    best_day_sessions INTEGER,
    best_day_date DATE,
    longest_session_minutes INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(week_number, year, user_id),
    INDEX idx_weekly_summaries (week_number, year)
);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active projects with metrics
CREATE VIEW active_projects_view AS
SELECT 
    p.*,
    COUNT(DISTINCT fs.id) as total_sessions,
    SUM(fs.actual_duration) as total_minutes,
    AVG(CASE 
        WHEN fs.quality_rating = 'excellent' THEN 5
        WHEN fs.quality_rating = 'good' THEN 4
        WHEN fs.quality_rating = 'average' THEN 3
        WHEN fs.quality_rating = 'challenging' THEN 2
        WHEN fs.quality_rating = 'bad' THEN 1
        ELSE NULL
    END) as avg_quality
FROM projects p
LEFT JOIN focus_sessions fs ON p.id = fs.project_id
WHERE p.status = 'active'
GROUP BY p.id;

-- View for this week's completed projects
CREATE VIEW weekly_completed_projects AS
SELECT *
FROM projects
WHERE status = 'completed'
  AND completion_week = strftime('%W', 'now');

-- View for focus heatmap data
CREATE VIEW focus_heatmap AS
SELECT 
    DATE(started_at) as focus_date,
    COUNT(*) as session_count,
    SUM(actual_duration) as total_minutes,
    AVG(CASE 
        WHEN quality_rating = 'excellent' THEN 5
        WHEN quality_rating = 'good' THEN 4
        WHEN quality_rating = 'average' THEN 3
        WHEN quality_rating = 'challenging' THEN 2
        WHEN quality_rating = 'bad' THEN 1
    END) as avg_quality
FROM focus_sessions
WHERE completion_status = 'completed'
  AND started_at >= date('now', '-14 days')
GROUP BY DATE(started_at);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_capture_triage ON capture_items(triage_decision);
CREATE INDEX idx_projects_active ON projects(status) WHERE status = 'active';
CREATE INDEX idx_sessions_quality ON focus_sessions(quality_rating);
CREATE INDEX idx_sessions_completed ON focus_sessions(completion_status) WHERE completion_status = 'completed';
CREATE INDEX idx_xp_source ON xp_logs(source, source_id);

-- ============================================
-- TRIGGERS FOR DATA INTEGRITY
-- ============================================

-- Auto-update project metrics when session completes
CREATE TRIGGER update_project_metrics
AFTER INSERT ON focus_sessions
WHEN NEW.completion_status = 'completed'
BEGIN
    UPDATE projects 
    SET 
        total_focus_time = total_focus_time + NEW.actual_duration,
        session_count = session_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.project_id;
END;

-- Auto-set completion week when project completes
CREATE TRIGGER set_completion_week
AFTER UPDATE ON projects
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    UPDATE projects 
    SET 
        actual_completed_at = CURRENT_TIMESTAMP,
        completion_week = CAST(strftime('%W', 'now') AS INTEGER),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

-- Track project state transitions
CREATE TRIGGER track_project_transitions
AFTER UPDATE ON projects
WHEN NEW.status != OLD.status
BEGIN
    INSERT INTO project_transitions (project_id, from_status, to_status)
    VALUES (NEW.id, OLD.status, NEW.status);
END;

-- Update daily objective progress
CREATE TRIGGER update_daily_objective
AFTER INSERT ON focus_sessions
WHEN NEW.daily_objective_id IS NOT NULL AND NEW.completion_status = 'completed'
BEGIN
    UPDATE daily_objectives
    SET 
        completed_sessions = completed_sessions + 1,
        total_minutes_actual = total_minutes_actual + NEW.actual_duration
    WHERE id = NEW.daily_objective_id;
END;