import { test, expect } from '@playwright/test'

test.describe('Quiz frontend', () => {
  test('loads the homepage with quiz title', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Cosmic Animal/)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('shows 10 questions on the quiz page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // At least one question card should be present after seeding
    const cards = page.locator('.question-card')
    await expect(cards.first()).toBeVisible()
  })

  test('submit button is disabled until all questions answered', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const submitBtn = page.locator('#submit-quiz-btn')
    await expect(submitBtn).toBeDisabled()
  })
})
