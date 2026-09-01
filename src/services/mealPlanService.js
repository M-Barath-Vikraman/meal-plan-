/**
 * @file mealPlanService.js
 * Service module for meal planning state and operations across dates.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Migrate these LocalStorage methods to call `apiClient.get('/plans?date=...')`, `apiClient.post('/plans')`,
 * `apiClient.patch('/plans/:id/complete')`, and `apiClient.delete('/plans/:id')` backed by DynamoDB.
 */

import { INITIAL_MEAL_PLANS, getTodayDateString } from '../data/initialMockData';

const PLANS_STORAGE_KEY = 'smartmeal_plans_data';

/**
 * Initialize meal plans storage if empty.
 */
function initializePlansStorage() {
  const existing = localStorage.getItem(PLANS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_MEAL_PLANS));
  }
}

/**
 * Get all stored plans map.
 * @returns {Record<string, Array>} Map of dateStr -> array of plan items
 */
function getAllPlans() {
  initializePlansStorage();
  const data = localStorage.getItem(PLANS_STORAGE_KEY);
  try {
    return JSON.parse(data || '{}');
  } catch (e) {
    console.error('Error reading meal plans:', e);
    return {};
  }
}

/**
 * Save updated plans map to storage.
 * @param {Record<string, Array>} plans 
 */
function saveAllPlans(plans) {
  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
}

/**
 * Get planned meals for a specific date (YYYY-MM-DD).
 * @param {string} dateStr 
 * @returns {Promise<Array<{ id: string, foodId?: string, name: string, mealType: string, ingredients: string[], calories?: number, completed: boolean }>>}
 */
export async function getPlanByDate(dateStr = getTodayDateString()) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const plans = getAllPlans();
  return plans[dateStr] || [];
}

/**
 * Add a meal item to a specific date and meal section.
 * @param {string} dateStr - Date YYYY-MM-DD
 * @param {{ foodId?: string, name: string, mealType: string, ingredients: string[], calories?: number }} mealItem 
 * @returns {Promise<Object>} Added plan item
 */
export async function addMealToPlan(dateStr, mealItem) {
  const plans = getAllPlans();
  const datePlans = plans[dateStr] ? [...plans[dateStr]] : [];

  const newPlanItem = {
    id: `plan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    foodId: mealItem.foodId || null,
    name: mealItem.name,
    mealType: mealItem.mealType,
    ingredients: Array.isArray(mealItem.ingredients) ? mealItem.ingredients : [],
    calories: mealItem.calories ? Number(mealItem.calories) : 250,
    completed: false,
  };

  datePlans.push(newPlanItem);
  plans[dateStr] = datePlans;
  saveAllPlans(plans);

  return newPlanItem;
}

/**
 * Toggle completed state of a meal item.
 * @param {string} dateStr 
 * @param {string} planItemId 
 * @returns {Promise<Object>} Updated meal item
 */
export async function toggleMealCompletion(dateStr, planItemId) {
  const plans = getAllPlans();
  const datePlans = plans[dateStr] || [];
  const index = datePlans.findIndex((item) => item.id === planItemId);

  if (index === -1) {
    throw new Error(`Plan item ${planItemId} not found for date ${dateStr}`);
  }

  datePlans[index] = {
    ...datePlans[index],
    completed: !datePlans[index].completed,
  };

  plans[dateStr] = datePlans;
  saveAllPlans(plans);

  return datePlans[index];
}

/**
 * Delete a meal item from a date plan.
 * @param {string} dateStr 
 * @param {string} planItemId 
 * @returns {Promise<boolean>}
 */
export async function deleteMealFromPlan(dateStr, planItemId) {
  const plans = getAllPlans();
  const datePlans = plans[dateStr] || [];
  const filtered = datePlans.filter((item) => item.id !== planItemId);
  
  plans[dateStr] = filtered;
  saveAllPlans(plans);
  return true;
}

/**
 * Get monthly meal counts map for calendar UI indicators.
 * @param {number} year 
 * @param {number} month - 0 indexed
 * @returns {Promise<Record<string, { count: number, completedCount: number }>>}
 */
export async function getMonthlySummary(year, month) {
  const plans = getAllPlans();
  const result = {};

  Object.keys(plans).forEach((dateStr) => {
    const [y, m] = dateStr.split('-').map(Number);
    if (y === year && m === month + 1) {
      const items = plans[dateStr] || [];
      result[dateStr] = {
        count: items.length,
        completedCount: items.filter((i) => i.completed).length,
      };
    }
  });

  return result;
}
