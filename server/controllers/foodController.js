/**
 * Food controller providing API placeholders for food catalog operations.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Replace in-memory array operations with AWS DynamoDB DocumentClient calls targeting the 'smartmeal-foods' table.
 */

// Temporary in-memory food catalog for Phase 2A testing
let memoryFoods = [
  {
    id: 'food_1',
    name: 'Warm Lemon Water with Chia Seeds',
    mealType: 'Pre-Breakfast',
    ingredients: ['Warm Water', 'Lemon Juice', 'Chia Seeds', 'Honey'],
    calories: 45,
    protein: '1g',
    carbs: '8g',
    fat: '1g',
  },
  {
    id: 'food_4',
    name: 'Masala Oats with Vegetables',
    mealType: 'Breakfast',
    ingredients: ['Rolled Oats', 'Onions', 'Tomatoes', 'Green Peas', 'Carrots', 'Indian Spices', 'Olive Oil'],
    calories: 280,
    protein: '9g',
    carbs: '45g',
    fat: '6g',
  },
  {
    id: 'food_11',
    name: 'Dal Tadka, Bhindi Masala & Multigrain Roti',
    mealType: 'Lunch',
    ingredients: ['Yellow Arhar Dal', 'Okra (Bhindi)', 'Multigrain Roti (2)', 'Cucumber Salad', 'Ghee'],
    calories: 520,
    protein: '20g',
    carbs: '78g',
    fat: '14g',
  },
];

/**
 * GET /api/foods
 * Fetch list of all foods in library.
 * TODO: Replace with DynamoDB ScanCommand or QueryCommand.
 */
export function getFoods(req, res) {
  res.status(200).json({
    success: true,
    data: memoryFoods,
    message: 'Phase 2A Express endpoint placeholder. DynamoDB connection planned for Phase 2B.',
  });
}

/**
 * POST /api/foods
 * Add a new food item.
 * TODO: Replace with DynamoDB PutItemCommand.
 */
export function createFood(req, res) {
  const { name, mealType, ingredients, calories, protein, carbs, fat } = req.body;
  if (!name || !mealType) {
    return res.status(400).json({
      success: false,
      error: { message: 'Food name and mealType are required', code: 'BAD_REQUEST' },
    });
  }

  const newFood = {
    id: `food_${Date.now()}`,
    name,
    mealType,
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    calories: Number(calories) || 250,
    protein: protein || '10g',
    carbs: carbs || '30g',
    fat: fat || '8g',
  };

  memoryFoods.unshift(newFood);

  res.status(201).json({
    success: true,
    data: newFood,
    message: 'Food created in-memory. Will be persisted in DynamoDB in Phase 2B.',
  });
}

/**
 * PUT /api/foods/:id
 * Update an existing food item.
 * TODO: Replace with DynamoDB UpdateItemCommand.
 */
export function updateFood(req, res) {
  const { id } = req.params;
  const index = memoryFoods.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Food with id ${id} not found`, code: 'NOT_FOUND' },
    });
  }

  memoryFoods[index] = { ...memoryFoods[index], ...req.body };

  res.status(200).json({
    success: true,
    data: memoryFoods[index],
    message: 'Food updated in-memory.',
  });
}

/**
 * DELETE /api/foods/:id
 * Delete a food item.
 * TODO: Replace with DynamoDB DeleteItemCommand.
 */
export function deleteFood(req, res) {
  const { id } = req.params;
  const initialLength = memoryFoods.length;
  memoryFoods = memoryFoods.filter((f) => f.id !== id);

  if (memoryFoods.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: { message: `Food with id ${id} not found`, code: 'NOT_FOUND' },
    });
  }

  res.status(200).json({
    success: true,
    message: `Food item ${id} deleted successfully.`,
  });
}
