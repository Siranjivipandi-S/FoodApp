import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  _id: String,
  strMeal: String,
  strMealThumb: String,
  idMeal: String,
  price: Number,
  category: String,
});

export const MealDb = mongoose.model("FoodProducts", mealSchema);
