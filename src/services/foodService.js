/**
 * @file foodService.js
 * Service module for managing food items database.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Migrate these LocalStorage methods to call `apiClient.get('/foods')`, `apiClient.post('/foods')`,
 * `apiClient.put('/foods/:id')`, and `apiClient.delete('/foods/:id')` backed by DynamoDB.
 */

import { INITIAL_FOODS } from '../data/initialMockData';

const FOODS_STORAGE_KEY = 'smartmeal_foods_data';

/**
 * Initialize storage if empty.
 */
function initializeFoodsStorage() {
  const existing = localStorage.getItem(FOODS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(INITIAL_FOODS));
  }
}

/**
 * Get all foods from database.
 * @returns {Promise<Array<{ id: string, name: string, mealType: string, ingredients: string[], calories?: number, protein?: string, carbs?: string, fat?: string }>>}
 */
export async function getFoods() {
  initializeFoodsStorage();
  await new Promise((resolve) => setTimeout(resolve, 150));
  const data = localStorage.getItem(FOODS_STORAGE_KEY);
  return JSON.parse(data || '[]');
}

/**
 * Get single food item by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function getFoodById(id) {
  const foods = await getFoods();
  return foods.find((f) => f.id === id) || null;
}

/**
 * Get foods grouped or filtered by meal type.
 * @param {string} mealType 
 * @returns {Promise<Array>}
 */
export async function getFoodsByMealType(mealType) {
  const foods = await getFoods();
  if (!mealType) return foods;
  return foods.filter((f) => f.mealType.toLowerCase() === mealType.toLowerCase());
}

/**
 * Add a new food item.
 * @param {{ name: string, mealType: string, ingredients: string[]|string, calories?: number, protein?: string, carbs?: string, fat?: string }} foodData 
 * @returns {Promise<Object>} The newly created food item
 */
export async function addFood(foodData) {
  const foods = await getFoods();
  const ingredientsArray = Array.isArray(foodData.ingredients)
    ? foodData.ingredients
    : foodData.ingredients.split(',').map((s) => s.trim()).filter(Boolean);

  const newFood = {
    id: `food_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: foodData.name.trim(),
    mealType: foodData.mealType,
    ingredients: ingredientsArray,
    calories: foodData.calories ? Number(foodData.calories) : 250,
    protein: foodData.protein || '10g',
    carbs: foodData.carbs || '30g',
    fat: foodData.fat || '8g',
  };

  const updated = [newFood, ...foods];
  localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(updated));
  return newFood;
}

/**
 * Update an existing food item.
 * @param {string} id 
 * @param {Object} updatedFields 
 * @returns {Promise<Object>} Updated food item
 */
export async function updateFood(id, updatedFields) {
  const foods = await getFoods();
  const index = foods.findIndex((f) => f.id === id);
  if (index === -1) {
    throw new Error(`Food with id ${id} not found.`);
  }

  const ingredientsArray = Array.isArray(updatedFields.ingredients)
    ? updatedFields.ingredients
    : updatedFields.ingredients
      ? updatedFields.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : foods[index].ingredients;

  foods[index] = {
    ...foods[index],
    ...updatedFields,
    ingredients: ingredientsArray,
    calories: updatedFields.calories !== undefined ? Number(updatedFields.calories) : foods[index].calories,
  };

  localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(foods));
  return foods[index];
}

/**
 * Delete a food item by ID.
 * @param {string} id 
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteFood(id) {
  const foods = await getFoods();
  const filtered = foods.filter((f) => f.id !== id);
  localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
