import { configureStore } from "@reduxjs/toolkit";
import productslice from "./Productslice";
import CartSlice from "./CartSlice";
import loginslice from "./loginslice";
import TokenSlice from "./TokenSlice";
import transactionSlice from "./AdminSlice";

const store = configureStore({
  reducer: {
    product: productslice.product,
    breakfast: productslice.breakfast,
    meal: productslice.meal,
    randommeal: productslice.randommeal,
    seafood: productslice.seafood,
    cart: CartSlice,
    login: loginslice,
    token: TokenSlice,
    recommendproduct: productslice.recommendproduct,
    transactions: transactionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
