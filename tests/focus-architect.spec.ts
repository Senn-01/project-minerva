import { test, expect } from '@playwright/test'

test.describe('Focus Architect MVP', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should show onboarding for first-time users', async ({ page }) => {
    await page.goto('/')
    
    // Check onboarding overlay is visible
    await expect(page.locator('.fixed.inset-0.z-\\[100\\]')).toBeVisible()
    await expect(page.locator('text=The Capture System')).toBeVisible()
    
    // Skip onboarding
    await page.click('text=Skip Tutorial')
    await expect(page.locator('.fixed.inset-0.z-\\[100\\]')).not.toBeVisible()
  })

  test('should navigate between pages using navigation buttons', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Navigate to Map (default)
    await expect(page).toHaveURL('/map')
    await expect(page.locator('text=Strategic Map')).toBeVisible()
    
    // Navigate to Focus - using more specific selector
    await page.locator('nav button:has-text("Focus")').click()
    await expect(page).toHaveURL('/focus')
    
    // Navigate to Analytics - using more specific selector
    await page.locator('nav button:has-text("Data")').click()
    await expect(page).toHaveURL('/analytics')
    await expect(page.locator('h2:has-text("Analytics")').first()).toBeVisible()
  })

  test('should capture and triage items', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Wait for the page to be ready
    await page.waitForLoadState('networkidle')
    
    // Add a capture item - click on the capture input first to expand it
    const captureInput = page.locator('header input[type="text"]').first()
    await captureInput.click()
    await page.waitForTimeout(200) // Wait for expand animation
    await captureInput.fill('Test capture item')
    await captureInput.press('Enter')
    
    // Check capture counter appears
    await expect(page.locator('header >> text=1').first()).toBeVisible()
    
    // Open triage
    await page.click('button:has-text("Triage (1)")')
    await expect(page.locator('text=Test capture item')).toBeVisible()
    
    // Delete the item
    await page.click('button:has-text("Not Relevant")')
    await expect(page.locator('button:has-text("Triage")')).not.toBeVisible()
  })

  test('should create and display a project', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Open project form
    await page.click('text=Add Project')
    
    // Fill project form
    await page.fill('input[placeholder*="Launch new feature"]', 'Test Project')
    await page.fill('textarea', 'Test description')
    await page.locator('input[type="range"]').first().evaluate(el => (el as HTMLInputElement).value = '7')
    await page.locator('input[type="range"]').nth(1).evaluate(el => (el as HTMLInputElement).value = '8')
    
    // Select category
    await page.click('button:has-text("work")')
    
    // Submit form
    await page.click('text=Create Project')
    
    // Check project appears on scatter plot
    await expect(page.locator('.relative.w-full.h-\\[600px\\]')).toBeVisible()
  })

  test('should handle empty state in focus page', async ({ page }) => {
    await page.goto('/focus')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Check empty state
    await expect(page.locator('text=No Active Projects')).toBeVisible()
    await expect(page.locator('text=GO TO STRATEGIC MAP')).toBeVisible()
    
    // Click button should navigate to map
    await page.click('text=GO TO STRATEGIC MAP')
    await expect(page).toHaveURL('/map')
  })

  test('should display XP indicator', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Check XP indicator is visible
    await expect(page.locator('text=XP').first()).toBeVisible()
    await expect(page.locator('.font-mono.font-bold').first()).toContainText('0')
  })

  test('should show analytics page components', async ({ page }) => {
    await page.goto('/analytics')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Check main components are visible
    await expect(page.locator('text=Weekly XP')).toBeVisible()
    await expect(page.locator('text=Total XP')).toBeVisible()
    await expect(page.locator('text=14-Day Focus Heatmap')).toBeVisible()
    await expect(page.locator('h3:has-text("Achievements")')).toBeVisible()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Test CMD+Q for Map
    await page.keyboard.press('Meta+q')
    await expect(page).toHaveURL('/map')
    
    // Test CMD+S for Focus
    await page.keyboard.press('Meta+s')
    await expect(page).toHaveURL('/focus')
    
    // Test CMD+D for Analytics
    await page.keyboard.press('Meta+d')
    await expect(page).toHaveURL('/analytics')
  })

  test('should persist data in localStorage', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Add a project
    await page.click('button:has-text("Add Project")')
    
    // Wait for modal to appear
    await page.waitForSelector('input[placeholder*="Launch new feature"]')
    
    // Fill in the form
    await page.fill('input[placeholder*="Launch new feature"]', 'Persistent Project')
    await page.fill('textarea', 'Test description')
    
    // Select category
    await page.click('button:has-text("work")')
    
    // Submit the form
    await page.click('button:has-text("Create Project")')
    
    // Wait for the modal to close
    await page.waitForSelector('text=Add Project', { state: 'visible' })
    
    // Wait a bit for state update
    await page.waitForTimeout(1000)
    
    // Check localStorage was updated
    const projects = await page.evaluate(() => {
      const stored = localStorage.getItem('fa_projects')
      console.log('Stored projects:', stored)
      return stored ? JSON.parse(stored) : []
    })
    
    expect(projects).toHaveLength(1)
    expect(projects[0].title).toBe('Persistent Project')
    
    // Reload page and verify persistence
    await page.reload()
    
    // Check project still exists after reload
    const projectsAfterReload = await page.evaluate(() => {
      const stored = localStorage.getItem('fa_projects')
      return stored ? JSON.parse(stored) : []
    })
    
    expect(projectsAfterReload).toHaveLength(1)
    expect(projectsAfterReload[0].title).toBe('Persistent Project')
  })

  test('should show parking lot modal', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('fa_onboarding_complete', 'true'))
    await page.reload()
    
    // Open parking lot
    await page.click('button:has-text("Parking Lot")')
    
    // Check modal appears
    await expect(page.locator('text=Someday/maybe projects')).toBeVisible()
    await expect(page.locator('text=No projects in parking lot')).toBeVisible()
    
    // Close modal - click the close button which is in the sticky header
    const closeButton = page.locator('div.sticky button.p-2').first()
    await closeButton.click()
    
    // Verify modal closed
    await expect(page.locator('text=Someday/maybe projects')).not.toBeVisible()
  })
})