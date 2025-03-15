import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";

export interface Product {
  mealName: any;
  mealThumb: string | undefined;
  id?: string;
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
  price?: number;
}

export interface Breakfast {
  id: string;
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price?: number;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price?: number;
}

// Create adapters for each entity type
const productAdapter = createEntityAdapter<Product>({
  selectId: (product) => product.idCategory,
});
// Define an adapter for recommended products
const recommendProductAdapter = createEntityAdapter({
  selectId: (product) => product._id, // Using `_id` as the unique identifier
});

// Initial state using the adapter's getInitialState

const breakfastAdapter = createEntityAdapter<Breakfast>({
  selectId: (breakfast) => breakfast.idMeal,
});

const mealAdapter = createEntityAdapter<Meal>({
  selectId: (meal) => meal.idMeal,
});

const randomMealAdapter = createEntityAdapter<Meal>({
  selectId: (meal) => meal.idMeal,
});

const seeFoodAdapter = createEntityAdapter<Meal>({
  selectId: (meal) => meal.idMeal,
});

// Async thunk for fetching products
export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async () => {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    return response.data.categories as Product[];
  }
);

// Async thunk for fetching breakfast
export const fetchBreakfast = createAsyncThunk(
  "breakfast/fetchBreakfast",
  async () => {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast"
    );
    return response.data.meals as Breakfast[];
  }
);

// Async thunk for fetching random meal
export const fetchRandomMeal = createAsyncThunk(
  "randommeal/fetchRandomMeal",
  async () => {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    return response.data.meals as Meal[];
  }
);

// Async thunk for fetching meals with special ingredient
export const fetchSpecialIngredientMeal = createAsyncThunk(
  "meal/fetchSpecialIngredientMeal",
  async () => {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast"
    );
    return response.data.meals as Meal[];
  }
);

// Async thunk for fetching seafood
export const fetchSeeFood = createAsyncThunk(
  "seafood/fetchSeeFood",
  async () => {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
    );
    return response.data.meals as Meal[];
  }
);

// Async thunk for fetching Recommend Product
export const fetchRecommendProduct = createAsyncThunk(
  "/recommendProduct",
  async (cart) => {
    const response = await axios.post(
      "http://127.0.0.1:5000/recommendproduct",
      {
        cart: cart,
      }
    );
    return response.data as Product[];
  }
);

// Initial states
const initialProductState: EntityState<Product> & { status: string } =
  productAdapter.getInitialState({
    status: "idle",
  });

const initialRecommendProductState = recommendProductAdapter.getInitialState({
  status: "idle",
});
const initialBreakfastState: EntityState<Breakfast> & { status: string } =
  breakfastAdapter.getInitialState({
    status: "idle",
  });

const initialMealState: EntityState<Meal> & { status: string } =
  mealAdapter.getInitialState({
    status: "idle",
  });

const initialRandomMealState: EntityState<Meal> & { status: string } =
  randomMealAdapter.getInitialState({
    status: "idle",
  });

const initialSeeFoodState: EntityState<Meal> & { status: string } =
  seeFoodAdapter.getInitialState({
    status: "idle",
  });

// Product slice
const productSlice = createSlice({
  name: "product",
  initialState: initialProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      const prices = [120, 320, 450, 299, 349];
      const productsWithPrice = action.payload.map((product) => ({
        ...product,
        price: prices[Math.floor(Math.random() * prices.length)],
      }));
      productAdapter.setAll(state, productsWithPrice);
      state.status = "succeeded";
    });
    builder.addCase(fetchProduct.rejected, (state) => {
      state.status = "failed";
    });
  },
});
// Recommend Product slice
const recommendProductSlice = createSlice({
  name: "recommendProduct",
  initialState: initialRecommendProductState,
  reducers: {}, // No manual reducers needed as of now
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        recommendProductAdapter.setAll(state, action.payload);
      })
      .addCase(fetchRecommendProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Breakfast slice
const breakfastSlice = createSlice({
  name: "breakfast",
  initialState: initialBreakfastState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBreakfast.fulfilled, (state, action) => {
      const prices = [99, 148, 89, 229, 299];
      const breakfastsWithPrice = action.payload.map((breakfast) => ({
        ...breakfast,
        price: prices[Math.floor(Math.random() * prices.length)],
      }));
      breakfastAdapter.setAll(state, breakfastsWithPrice);
      state.status = "succeeded";
    });
  },
});

// Meal slice
const mealSlice = createSlice({
  name: "meal",
  initialState: initialMealState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSpecialIngredientMeal.fulfilled, (state, action) => {
      const prices = [100, 200, 300, 400, 500];
      const mealsWithPrice = action.payload.map((meal) => ({
        ...meal,
        price: prices[Math.floor(Math.random() * prices.length)],
      }));
      mealAdapter.setAll(state, mealsWithPrice);
      state.status = "succeeded";
    });
  },
});

// Random meal slice
const randomMealSlice = createSlice({
  name: "randommeal",
  initialState: initialRandomMealState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRandomMeal.fulfilled, (state, action) => {
      const prices = [150, 250, 350, 450, 550];
      const mealsWithPrice = action.payload.map((meal) => ({
        ...meal,
        price: prices[Math.floor(Math.random() * prices.length)],
      }));
      randomMealAdapter.setAll(state, mealsWithPrice);
      state.status = "succeeded";
    });
  },
});

// Seafood slice
const seeFoodSlice = createSlice({
  name: "seafood",
  initialState: initialSeeFoodState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSeeFood.fulfilled, (state, action) => {
      const prices = [199, 249, 399, 119, 299];
      const mealsWithPrice = action.payload.map((meal) => ({
        ...meal,
        price: prices[Math.floor(Math.random() * prices.length)],
      }));
      seeFoodAdapter.setAll(state, mealsWithPrice);
      state.status = "succeeded";
    });
  },
});

// Selectors
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productAdapter.getSelectors((state: RootState) => state.product);
// Selectors
export const {
  selectAll: selectAllRecommendProducts,
  selectById: selectRecommendProductById,
} = recommendProductAdapter.getSelectors(
  (state: RootState) => state.recommendProduct
);

export const {
  selectAll: selectAllBreakfasts,
  selectById: selectBreakfastById,
  selectIds: selectBreakfastIds,
} = breakfastAdapter.getSelectors((state: RootState) => state.breakfast);

export const {
  selectAll: selectAllMeals,
  selectById: selectMealById,
  selectIds: selectMealIds,
} = mealAdapter.getSelectors((state: RootState) => state.meal);

export const {
  selectAll: selectAllRandomMeals,
  selectById: selectRandomMealById,
  selectIds: selectRandomMealIds,
} = randomMealAdapter.getSelectors((state: RootState) => state.randommeal);

export const {
  selectAll: selectAllSeeFoods,
  selectById: selectSeeFoodById,
  selectIds: selectSeeFoodIds,
} = seeFoodAdapter.getSelectors((state: RootState) => state.seafood);

// Export reducers
export default {
  product: productSlice.reducer,
  breakfast: breakfastSlice.reducer,
  meal: mealSlice.reducer,
  randommeal: randomMealSlice.reducer,
  seafood: seeFoodSlice.reducer,
  recommendproduct: recommendProductSlice.reducer,
};
