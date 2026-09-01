/**
 * Meal plan controller providing API placeholders for daily & monthly plans.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Replace in-memory store with AWS DynamoDB DocumentClient querying 'smartmeal-plans' table.
 */

// Temporary in-memory meal plan store for Phase 2A testing
let memoryPlans = {};

/**
 * GET /api/plans?date=YYYY-MM-DD
 * Get planned meals for a date.
 * TODO: Query DynamoDB using partition key `userId` and sort key prefix `DATE#YYYY-MM-DD`.
 */
export function getPlanByDate(req, res) {
  const dateStr = req.query.date || new Date().toISOString().split('T')[0];
  const datePlans = memoryPlans[dateStr] || [];

  res.status(200).json({
    success: true,
    data: datePlans,
    date: dateStr,
    message: 'Phase 2A Express endpoint placeholder. DynamoDB connection planned for Phase 2B.',
  });
}

/**
 * POST /api/plans
 * Add a meal item to a date plan.
 * TODO: Put item into DynamoDB 'smartmeal-plans' table.
 */
export function createPlanItem(req, res) {
  const { date, name, mealType, ingredients, calories } = req.body;
  if (!date || !name || !mealType) {
    return res.status(400).json({
      success: false,
      error: { message: 'date, name, and mealType are required', code: 'BAD_REQUEST' },
    });
  }

  const newItem = {
    id: `plan_${Date.now()}`,
    name,
    mealType,
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    calories: Number(calories) || 250,
    completed: false,
  };

  if (!memoryPlans[date]) {
    memoryPlans[date] = [];
  }
  memoryPlans[date].push(newItem);

  res.status(201).json({
    success: true,
    data: newItem,
    date,
    message: 'Meal added to plan in-memory.',
  });
}

/**
 * PATCH /api/plans/:id/complete
 * Toggle meal item completion status.
 * TODO: Update item in DynamoDB setting `completed = :val`.
 */
export function togglePlanItemCompletion(req, res) {
  const { id } = req.params;
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: { message: 'Date parameter required in request body', code: 'BAD_REQUEST' },
    });
  }

  const datePlans = memoryPlans[date] || [];
  const item = datePlans.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: { message: `Plan item ${id} not found for date ${date}`, code: 'NOT_FOUND' },
    });
  }

  item.completed = !item.completed;

  res.status(200).json({
    success: true,
    data: item,
    message: 'Plan item completion status updated.',
  });
}

/**
 * DELETE /api/plans/:id
 * Delete a meal item from plan.
 * TODO: Delete item from DynamoDB 'smartmeal-plans' table.
 */
export function deletePlanItem(req, res) {
  const { id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: { message: 'date query parameter required', code: 'BAD_REQUEST' },
    });
  }

  if (memoryPlans[date]) {
    memoryPlans[date] = memoryPlans[date].filter((i) => i.id !== id);
  }

  res.status(200).json({
    success: true,
    message: `Plan item ${id} deleted from date ${date}.`,
  });
}
