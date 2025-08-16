-- Focus Architect Database Helper Functions
-- Version: 1.0 (MVP)
-- Description: SQL functions and procedures for calculations and data integrity
-- Note: These are SQLite-compatible functions. For other databases, syntax may vary.

-- ============================================
-- SESSION HELPER FUNCTIONS
-- ============================================

-- Function to calculate session_number_today
-- Called before inserting a new focus session
-- Returns the next session number for today
CREATE FUNCTION get_session_number_today(p_user_id INTEGER)
RETURNS INTEGER
AS $$
BEGIN
    RETURN COALESCE(
        (SELECT MAX(session_number_today) + 1
         FROM focus_sessions
         WHERE DATE(started_at) = DATE(CURRENT_TIMESTAMP)
           AND project_id IN (SELECT id FROM projects WHERE user_id = p_user_id OR user_id IS NULL)),
        1
    );
END;
$$ LANGUAGE SQL;

-- Function to calculate time_of_day from timestamp
CREATE FUNCTION get_time_of_day(p_timestamp TIMESTAMP)
RETURNS VARCHAR(20)
AS $$
DECLARE
    hour INTEGER;
BEGIN
    hour := EXTRACT(HOUR FROM p_timestamp);
    
    IF hour >= 5 AND hour < 12 THEN
        RETURN 'morning';
    ELSIF hour >= 12 AND hour < 17 THEN
        RETURN 'afternoon';
    ELSIF hour >= 17 AND hour < 21 THEN
        RETURN 'evening';
    ELSE
        RETURN 'night';
    END IF;
END;
$$ LANGUAGE SQL;

-- Function to calculate difficulty multiplier
CREATE FUNCTION calculate_difficulty_multiplier(
    p_willpower VARCHAR(20),
    p_duration INTEGER
)
RETURNS DECIMAL(3,2)
AS $$
BEGIN
    -- Based on implementation-plan.md difficulty matrix
    IF p_willpower = 'high' AND p_duration = 25 THEN
        RETURN 0.5;  -- Piece of Cake
    ELSIF p_willpower = 'medium' AND p_duration = 25 THEN
        RETURN 1.0;  -- Hey, Not Too Rough
    ELSIF p_willpower = 'high' AND p_duration = 60 THEN
        RETURN 1.5;  -- Bring It On
    ELSIF p_willpower = 'medium' AND p_duration = 60 THEN
        RETURN 2.0;  -- Come Get Some
    ELSIF p_willpower = 'low' AND p_duration = 25 THEN
        RETURN 2.0;  -- Damn I'm Good
    ELSIF p_willpower = 'high' AND p_duration = 90 THEN
        RETURN 2.5;  -- Crunch Time
    ELSIF p_willpower = 'medium' AND p_duration = 90 THEN
        RETURN 3.0;  -- Balls of Steel
    ELSIF p_willpower = 'low' AND p_duration = 60 THEN
        RETURN 3.5;  -- Nightmare Deadline
    ELSIF p_willpower = 'low' AND p_duration = 90 THEN
        RETURN 4.0;  -- Hail to the King
    ELSE
        RETURN 1.0;  -- Default multiplier
    END IF;
END;
$$ LANGUAGE SQL;

-- Function to get difficulty quote
CREATE FUNCTION get_difficulty_quote(
    p_willpower VARCHAR(20),
    p_duration INTEGER
)
RETURNS VARCHAR(50)
AS $$
BEGIN
    IF p_willpower = 'high' AND p_duration = 25 THEN
        RETURN 'Piece of Cake';
    ELSIF p_willpower = 'medium' AND p_duration = 25 THEN
        RETURN 'Hey, Not Too Rough';
    ELSIF p_willpower = 'high' AND p_duration = 60 THEN
        RETURN 'Bring It On';
    ELSIF p_willpower = 'medium' AND p_duration = 60 THEN
        RETURN 'Come Get Some';
    ELSIF p_willpower = 'low' AND p_duration = 25 THEN
        RETURN 'Damn I''m Good';
    ELSIF p_willpower = 'high' AND p_duration = 90 THEN
        RETURN 'Crunch Time';
    ELSIF p_willpower = 'medium' AND p_duration = 90 THEN
        RETURN 'Balls of Steel';
    ELSIF p_willpower = 'low' AND p_duration = 60 THEN
        RETURN 'Nightmare Deadline';
    ELSIF p_willpower = 'low' AND p_duration = 90 THEN
        RETURN 'Hail to the King';
    ELSE
        RETURN 'Standard Session';
    END IF;
END;
$$ LANGUAGE SQL;

-- ============================================
-- XP CALCULATION FUNCTIONS
-- ============================================

-- Function to calculate daily XP decay multiplier
CREATE FUNCTION get_daily_decay_multiplier(p_session_number INTEGER)
RETURNS DECIMAL(3,2)
AS $$
BEGIN
    IF p_session_number = 1 THEN
        RETURN 1.00;  -- 100%
    ELSIF p_session_number = 2 THEN
        RETURN 0.75;  -- 75%
    ELSIF p_session_number = 3 THEN
        RETURN 0.50;  -- 50%
    ELSE
        RETURN 0.25;  -- 25% for 4th and beyond
    END IF;
END;
$$ LANGUAGE SQL;

-- Function to calculate session XP
CREATE FUNCTION calculate_session_xp(
    p_session_id INTEGER
)
RETURNS INTEGER
AS $$
DECLARE
    v_base_xp INTEGER := 10;
    v_duration_bonus INTEGER;
    v_quality_bonus INTEGER;
    v_difficulty_mult DECIMAL(3,2);
    v_daily_decay DECIMAL(3,2);
    v_total_xp INTEGER;
    v_session RECORD;
BEGIN
    -- Get session details
    SELECT * INTO v_session
    FROM focus_sessions
    WHERE id = p_session_id;
    
    -- Duration bonus (minutes / 10)
    v_duration_bonus := v_session.actual_duration / 10;
    
    -- Quality bonus
    v_quality_bonus := CASE v_session.quality_rating
        WHEN 'excellent' THEN 10
        WHEN 'good' THEN 5
        WHEN 'challenging' THEN 2
        ELSE 0
    END;
    
    -- Get multipliers
    v_difficulty_mult := v_session.difficulty_multiplier;
    v_daily_decay := get_daily_decay_multiplier(v_session.session_number_today);
    
    -- Calculate total XP
    v_total_xp := ROUND(
        (v_base_xp + v_duration_bonus + v_quality_bonus) * 
        v_difficulty_mult * 
        v_daily_decay
    );
    
    RETURN v_total_xp;
END;
$$ LANGUAGE SQL;

-- Function to calculate project completion XP
CREATE FUNCTION calculate_project_xp(
    p_project_id INTEGER
)
RETURNS INTEGER
AS $$
DECLARE
    v_project RECORD;
BEGIN
    SELECT cost, benefit INTO v_project
    FROM projects
    WHERE id = p_project_id;
    
    -- Formula: Cost × Benefit × 10
    RETURN v_project.cost * v_project.benefit * 10;
END;
$$ LANGUAGE SQL;

-- ============================================
-- WEEK CALCULATION FUNCTIONS (Brussels Time)
-- ============================================

-- Function to get Brussels week number
-- SQLite doesn't have timezone support, so this assumes server is in UTC
-- and adds offset for Brussels time (UTC+1 or UTC+2 depending on DST)
CREATE FUNCTION get_brussels_week_number(p_timestamp TIMESTAMP)
RETURNS INTEGER
AS $$
BEGIN
    -- Simple implementation: adds 1 hour offset
    -- In production, would need proper timezone handling
    RETURN CAST(strftime('%W', p_timestamp, '+1 hour') AS INTEGER);
END;
$$ LANGUAGE SQL;

-- Function to get start of Brussels week (Monday 00:00)
CREATE FUNCTION get_week_start_brussels(p_date DATE)
RETURNS TIMESTAMP
AS $$
BEGIN
    -- Get Monday of the week in Brussels time
    RETURN DATE(p_date, 'weekday 1', '-7 days');
END;
$$ LANGUAGE SQL;

-- ============================================
-- STREAK CALCULATION FUNCTIONS
-- ============================================

-- Function to check if streak continues
CREATE FUNCTION is_streak_continuous(
    p_last_date DATE,
    p_current_date DATE,
    p_streak_type VARCHAR(50)
)
RETURNS BOOLEAN
AS $$
BEGIN
    IF p_streak_type = 'daily_sessions' THEN
        -- Daily streak: must be consecutive days
        RETURN p_current_date = DATE(p_last_date, '+1 day');
    ELSIF p_streak_type = 'weekend_warrior' THEN
        -- Weekend streak: must be same weekend or next weekend
        RETURN (
            strftime('%w', p_current_date) IN ('0', '6') AND
            p_current_date <= DATE(p_last_date, '+9 days')
        );
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE SQL;

-- Procedure to update streak
CREATE PROCEDURE update_streak(
    p_user_id INTEGER,
    p_streak_type VARCHAR(50),
    p_activity_date DATE
)
AS $$
DECLARE
    v_streak RECORD;
    v_continuous BOOLEAN;
BEGIN
    -- Get current streak
    SELECT * INTO v_streak
    FROM streak_tracking
    WHERE user_id = p_user_id AND streak_type = p_streak_type;
    
    IF v_streak.id IS NULL THEN
        -- Create new streak
        INSERT INTO streak_tracking (user_id, streak_type, current_streak, longest_streak, 
                                    streak_start_date, last_activity_date)
        VALUES (p_user_id, p_streak_type, 1, 1, p_activity_date, p_activity_date);
    ELSE
        -- Check if streak continues
        v_continuous := is_streak_continuous(v_streak.last_activity_date, p_activity_date, p_streak_type);
        
        IF v_continuous THEN
            -- Continue streak
            UPDATE streak_tracking
            SET current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_activity_date = p_activity_date
            WHERE id = v_streak.id;
        ELSE
            -- Reset streak
            UPDATE streak_tracking
            SET current_streak = 1,
                streak_start_date = p_activity_date,
                last_activity_date = p_activity_date
            WHERE id = v_streak.id;
        END IF;
    END IF;
END;
$$ LANGUAGE SQL;

-- ============================================
-- ACHIEVEMENT PROGRESS FUNCTIONS
-- ============================================

-- Procedure to check and update achievement progress
CREATE PROCEDURE check_achievement_progress(
    p_user_id INTEGER,
    p_trigger_type VARCHAR(50), -- 'session_complete', 'project_complete', etc.
    p_trigger_id INTEGER
)
AS $$
BEGIN
    -- Check consistency achievements
    IF p_trigger_type = 'session_complete' THEN
        -- Update "Iron Will" (21 consecutive days)
        UPDATE achievement_progress
        SET current_value = (
            SELECT current_streak 
            FROM streak_tracking 
            WHERE user_id = p_user_id AND streak_type = 'daily_sessions'
        ),
        last_updated = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id 
          AND achievement_type = 'consistency'
          AND achievement_name = 'Iron Will';
        
        -- Check if achievement unlocked
        UPDATE achievement_progress
        SET completed_at = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id 
          AND achievement_type = 'consistency'
          AND achievement_name = 'Iron Will'
          AND current_value >= target_value
          AND completed_at IS NULL;
    END IF;
    
    -- Check category master achievements
    IF p_trigger_type = 'project_complete' THEN
        -- Update category-based achievements
        -- Example: "Career Climber" (100hr Work category)
        UPDATE achievement_progress
        SET current_value = (
            SELECT SUM(total_focus_time) / 60 -- Convert to hours
            FROM projects
            WHERE category = 'work' AND status = 'completed'
        ),
        last_updated = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id 
          AND achievement_type = 'category_master'
          AND achievement_name = 'Career Climber';
    END IF;
END;
$$ LANGUAGE SQL;

-- ============================================
-- ANALYTICS AGGREGATION FUNCTIONS
-- ============================================

-- Function to generate weekly summary
CREATE PROCEDURE generate_weekly_summary(
    p_week_number INTEGER,
    p_year INTEGER,
    p_user_id INTEGER
)
AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Calculate week boundaries
    v_start_date := DATE(p_year || '-01-01', '+' || ((p_week_number - 1) * 7) || ' days');
    v_end_date := DATE(v_start_date, '+6 days');
    
    -- Insert or update weekly summary
    INSERT OR REPLACE INTO weekly_summaries (
        week_number, year, user_id,
        total_sessions, total_minutes, total_xp,
        projects_completed, projects_abandoned,
        average_session_quality, high_willpower_percentage,
        completion_rate
    )
    SELECT 
        p_week_number,
        p_year,
        p_user_id,
        COUNT(DISTINCT fs.id) as total_sessions,
        SUM(fs.actual_duration) as total_minutes,
        SUM(xp.points_earned) as total_xp,
        COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as projects_completed,
        COUNT(DISTINCT CASE WHEN p.status = 'graveyard' THEN p.id END) as projects_abandoned,
        AVG(CASE 
            WHEN fs.quality_rating = 'excellent' THEN 5
            WHEN fs.quality_rating = 'good' THEN 4
            WHEN fs.quality_rating = 'average' THEN 3
            WHEN fs.quality_rating = 'challenging' THEN 2
            WHEN fs.quality_rating = 'bad' THEN 1
        END) as average_session_quality,
        (SUM(CASE WHEN fs.willpower_level = 'high' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as high_willpower_percentage,
        (SUM(CASE WHEN fs.completion_status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as completion_rate
    FROM focus_sessions fs
    LEFT JOIN projects p ON fs.project_id = p.id
    LEFT JOIN xp_logs xp ON xp.source = 'session' AND xp.source_id = fs.id
    WHERE fs.started_at >= v_start_date 
      AND fs.started_at <= v_end_date;
END;
$$ LANGUAGE SQL;

-- ============================================
-- DATA VALIDATION FUNCTIONS
-- ============================================

-- Function to validate session data before insert
CREATE FUNCTION validate_session_data(
    p_willpower VARCHAR(20),
    p_energy VARCHAR(20),
    p_quality VARCHAR(20),
    p_duration INTEGER
)
RETURNS BOOLEAN
AS $$
BEGIN
    -- Check willpower values
    IF p_willpower NOT IN ('high', 'medium', 'low') THEN
        RETURN FALSE;
    END IF;
    
    -- Check energy values (can be null for interrupted sessions)
    IF p_energy IS NOT NULL AND 
       p_energy NOT IN ('fired_up', 'need_break', 'spent') THEN
        RETURN FALSE;
    END IF;
    
    -- Check quality rating
    IF p_quality IS NOT NULL AND
       p_quality NOT IN ('excellent', 'good', 'average', 'challenging', 'bad') THEN
        RETURN FALSE;
    END IF;
    
    -- Check duration is reasonable (1-180 minutes)
    IF p_duration < 1 OR p_duration > 180 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE SQL;

-- Function to validate project data
CREATE FUNCTION validate_project_data(
    p_cost INTEGER,
    p_benefit INTEGER,
    p_category VARCHAR(20),
    p_status VARCHAR(20)
)
RETURNS BOOLEAN
AS $$
BEGIN
    -- Check cost and benefit ranges
    IF p_cost < 1 OR p_cost > 10 OR p_benefit < 1 OR p_benefit > 10 THEN
        RETURN FALSE;
    END IF;
    
    -- Check category
    IF p_category NOT IN ('work', 'growth', 'projects', 'life') THEN
        RETURN FALSE;
    END IF;
    
    -- Check status
    IF p_status NOT IN ('active', 'inactive', 'parking_lot', 'completed', 'graveyard') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE SQL;