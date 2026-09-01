/**
 * Initial mock data for SmartMeal application.
 * Contains Indian food items, default meal plans, and mock user profile.
 */

export const INITIAL_USER = {
  id: 'usr_101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@smartmeal.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  dietPreference: 'Healthy Indian Vegetarian',
  dailyCalorieGoal: 2000,
};

export const INITIAL_FOODS = [
  // Pre-Breakfast
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
    id: 'food_2',
    name: 'Soaked Almonds & Walnuts',
    mealType: 'Pre-Breakfast',
    ingredients: ['Almonds (5 pcs)', 'Walnuts (2 pcs)', 'Water'],
    calories: 110,
    protein: '4g',
    carbs: '3g',
    fat: '9g',
  },
  {
    id: 'food_3',
    name: 'Methi Water & Roasted Seeds',
    mealType: 'Pre-Breakfast',
    ingredients: ['Fenugreek Seeds', 'Warm Water', 'Pumpkin Seeds'],
    calories: 35,
    protein: '2g',
    carbs: '4g',
    fat: '1g',
  },

  // Breakfast
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
    id: 'food_5',
    name: 'Moong Dal Cheela with Green Chutney',
    mealType: 'Breakfast',
    ingredients: ['Yellow Moong Dal', 'Paneer Stuffing', 'Coriander', 'Green Chilies', 'Ghee'],
    calories: 320,
    protein: '16g',
    carbs: '38g',
    fat: '10g',
  },
  {
    id: 'food_6',
    name: 'Steamed Idli with Sambhar & Coconut Chutney',
    mealType: 'Breakfast',
    ingredients: ['Rice & Urad Dal Batter', 'Toor Dal Sambhar', 'Fresh Coconut Chutney', 'Drumsticks'],
    calories: 340,
    protein: '11g',
    carbs: '62g',
    fat: '5g',
  },
  {
    id: 'food_7',
    name: 'Kanda Poha with Peanuts',
    mealType: 'Breakfast',
    ingredients: ['Flattened Rice (Poha)', 'Onions', 'Roasted Peanuts', 'Mustard Seeds', 'Curry Leaves', 'Lemon'],
    calories: 290,
    protein: '7g',
    carbs: '48g',
    fat: '8g',
  },

  // Mid-morning Snacks
  {
    id: 'food_8',
    name: 'Green Tea & Roasted Makhana',
    mealType: 'Mid-morning Snacks',
    ingredients: ['Fox Nuts (Makhana)', 'Rock Salt', 'Black Pepper', 'Green Tea Bag'],
    calories: 120,
    protein: '3g',
    carbs: '20g',
    fat: '2g',
  },
  {
    id: 'food_9',
    name: 'Sprouted Moong Salad',
    mealType: 'Mid-morning Snacks',
    ingredients: ['Sprouted Green Moong', 'Cucumber', 'Tomato', 'Lemon Juice', 'Chaat Masala'],
    calories: 150,
    protein: '9g',
    carbs: '24g',
    fat: '1g',
  },
  {
    id: 'food_10',
    name: 'Fresh Papaya & Flaxseeds Bowl',
    mealType: 'Mid-morning Snacks',
    ingredients: ['Ripe Papaya Cubes', 'Roasted Flaxseeds', 'Mint Leaves'],
    calories: 95,
    protein: '2g',
    carbs: '22g',
    fat: '2g',
  },

  // Lunch
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
  {
    id: 'food_12',
    name: 'Palak Paneer with Brown Rice',
    mealType: 'Lunch',
    ingredients: ['Fresh Spinach Puree', 'Low-fat Paneer', 'Brown Rice', 'Garlic', 'Indian Spices'],
    calories: 480,
    protein: '22g',
    carbs: '56g',
    fat: '18g',
  },
  {
    id: 'food_13',
    name: 'Rajma Chawal with Kachumber Salad',
    mealType: 'Lunch',
    ingredients: ['Kidney Beans (Rajma)', 'Basmati Rice', 'Onion-Tomato Gravy', 'Kachumber Salad'],
    calories: 540,
    protein: '18g',
    carbs: '85g',
    fat: '10g',
  },

  // Dinner
  {
    id: 'food_14',
    name: 'Grilled Paneer Salad with Mint Dressing',
    mealType: 'Dinner',
    ingredients: ['Cottage Cheese Cubes', 'Bell Peppers', 'Cherry Tomatoes', 'Greek Yogurt Mint Dressing', 'Olive Oil'],
    calories: 360,
    protein: '24g',
    carbs: '16g',
    fat: '22g',
  },
  {
    id: 'food_15',
    name: 'Lauki Sabzi & Jowar Roti with Curd',
    mealType: 'Dinner',
    ingredients: ['Bottle Gourd (Lauki)', 'Sorghum Flatbread (Jowar Roti)', 'Low-fat Curd', 'Cumin Seeds'],
    calories: 380,
    protein: '14g',
    carbs: '60g',
    fat: '8g',
  },
  {
    id: 'food_16',
    name: 'Vegetable Moong Dal Khichdi with Tadka Curd',
    mealType: 'Dinner',
    ingredients: ['Yellow Moong Dal', 'Rice', 'Carrots', 'Beans', 'Cumin Ghee Tadka', 'Plain Yogurt'],
    calories: 410,
    protein: '16g',
    carbs: '68g',
    fat: '9g',
  },
];

// Helper to get formatted date string YYYY-MM-DD
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_MEAL_PLANS = {
  [getTodayDateString()]: [
    {
      id: 'plan_item_1',
      foodId: 'food_1',
      name: 'Warm Lemon Water with Chia Seeds',
      mealType: 'Pre-Breakfast',
      ingredients: ['Warm Water', 'Lemon Juice', 'Chia Seeds', 'Honey'],
      calories: 45,
      completed: true,
    },
    {
      id: 'plan_item_2',
      foodId: 'food_4',
      name: 'Masala Oats with Vegetables',
      mealType: 'Breakfast',
      ingredients: ['Rolled Oats', 'Onions', 'Tomatoes', 'Green Peas', 'Carrots', 'Indian Spices', 'Olive Oil'],
      calories: 280,
      completed: true,
    },
    {
      id: 'plan_item_3',
      foodId: 'food_8',
      name: 'Green Tea & Roasted Makhana',
      mealType: 'Mid-morning Snacks',
      ingredients: ['Fox Nuts (Makhana)', 'Rock Salt', 'Black Pepper', 'Green Tea Bag'],
      calories: 120,
      completed: false,
    },
    {
      id: 'plan_item_4',
      foodId: 'food_11',
      name: 'Dal Tadka, Bhindi Masala & Multigrain Roti',
      mealType: 'Lunch',
      ingredients: ['Yellow Arhar Dal', 'Okra (Bhindi)', 'Multigrain Roti (2)', 'Cucumber Salad', 'Ghee'],
      calories: 520,
      completed: false,
    },
    {
      id: 'plan_item_5',
      foodId: 'food_14',
      name: 'Grilled Paneer Salad with Mint Dressing',
      mealType: 'Dinner',
      ingredients: ['Cottage Cheese Cubes', 'Bell Peppers', 'Cherry Tomatoes', 'Greek Yogurt Mint Dressing', 'Olive Oil'],
      calories: 360,
      completed: false,
    },
  ],
};
