/**
 * @file aiService.js
 * Service module simulating SmartMeal AI Chef & Nutritionist.
 * 
 * TODO [Phase 2B - AWS Integration]:
 * Migrate photo scanning to `apiClient.post('/uploads/presign')` + S3 upload + Amazon Bedrock/Gemini API backend call.
 */

const MOCK_AI_RESPONSES = [
  "Based on your dietary preferences, I recommend adding **High Protein Moong Dal Cheela** to your breakfast. It provides 16g of protein and keeps you energetic!",
  "Here is a great quick lunch idea: **Palak Paneer with Brown Rice & Cucumber Salad**. Packed with iron and healthy fats!",
  "Looking for a light evening snack? Try **Roasted Makhana with Green Tea**. It has less than 120 calories and rich anti-oxidants.",
  "For dinner, a **Grilled Paneer Salad with Mint Yogurt Dressing** gives you great protein without heavy carbohydrates before sleep."
];

/**
 * Send a prompt message to the AI Assistant.
 * @param {string} userPrompt 
 * @returns {Promise<{ id: string, sender: 'ai', text: string, timestamp: string, suggestedRecipe?: Object }>}
 */
export async function sendChatMessage(userPrompt) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const promptLower = userPrompt.toLowerCase();
  let responseText = "";
  let recipeSuggestion = null;

  if (promptLower.includes('breakfast') || promptLower.includes('morning')) {
    responseText = "Here is a nutrient-dense Indian breakfast recipe tailored for your active day!";
    recipeSuggestion = {
      name: 'Sprouted Oats & Veggie Upma',
      mealType: 'Breakfast',
      ingredients: ['Semolina / Oats', 'Sprouted Moong', 'Curry Leaves', 'Mustard Seeds', 'Carrots', 'Green Peas'],
      calories: 310,
      protein: '14g',
      carbs: '46g',
      fat: '7g',
      description: 'A traditional wholesome South Indian breakfast elevated with sprouts and oats for extra fiber and protein.'
    };
  } else if (promptLower.includes('lunch') || promptLower.includes('protein')) {
    responseText = "I found a perfect high-protein lunch option for your meal plan!";
    recipeSuggestion = {
      name: 'Tofu & Mixed Veggie Soya Stir-fry',
      mealType: 'Lunch',
      ingredients: ['Firm Tofu / Paneer', 'Soya Chunks', 'Bell Peppers', 'Broccoli', 'Soy-Ginger Sauce', 'Brown Rice'],
      calories: 450,
      protein: '28g',
      carbs: '42g',
      fat: '14g',
      description: 'A delicious lean protein packed bowl infused with fresh aromatic ginger and crunchy vegetables.'
    };
  } else if (promptLower.includes('dinner') || promptLower.includes('light')) {
    responseText = "For a light and easy-to-digest dinner, here is a healthy choice:";
    recipeSuggestion = {
      name: 'Panchratna Dal Khichdi with Roasted Papad',
      mealType: 'Dinner',
      ingredients: ['5 Lentil Mix', 'Brown Rice', 'Cumin Seed Tadka', 'Desi Ghee', 'Turmeric'],
      calories: 370,
      protein: '15g',
      carbs: '58g',
      fat: '8g',
      description: 'Comforting, soothing dish high in complete protein amino acids.'
    };
  } else {
    // Random fallback
    responseText = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
  }

  return {
    id: `ai_msg_${Date.now()}`,
    sender: 'ai',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedRecipe: recipeSuggestion,
  };
}

/**
 * Simulate food photo recognition AI scan.
 * @param {File|string} photo 
 * @returns {Promise<{ name: string, mealType: string, confidence: number, ingredients: string[], calories: number, protein: string, carbs: string, fat: string, imageUrl: string }>}
 */
export async function analyzeFoodPhoto(photo) {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const sampleScans = [
    {
      name: 'Paneer Tikka Salad with Mint Chutney',
      mealType: 'Dinner',
      confidence: 0.94,
      ingredients: ['Grilled Cottage Cheese (150g)', 'Sliced Bell Peppers', 'Red Onion Rings', 'Mint Yogurt Dressing', 'Chaath Masala'],
      calories: 340,
      protein: '22g',
      carbs: '12g',
      fat: '20g',
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Masala Dosa with Sambhar',
      mealType: 'Breakfast',
      confidence: 0.91,
      ingredients: ['Fermented Rice Dosa', 'Spiced Potato Masala', 'Lentil Sambhar', 'Coconut Chutney'],
      calories: 410,
      protein: '10g',
      carbs: '68g',
      fat: '12g',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Chana Masala with Jeera Rice',
      mealType: 'Lunch',
      confidence: 0.96,
      ingredients: ['Chickpeas (Chana)', 'Onion Tomato Gravy', 'Cumin Rice (Jeera Rice)', 'Fresh Coriander'],
      calories: 490,
      protein: '18g',
      carbs: '74g',
      fat: '11g',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const result = sampleScans[Math.floor(Math.random() * sampleScans.length)];
  return result;
}
