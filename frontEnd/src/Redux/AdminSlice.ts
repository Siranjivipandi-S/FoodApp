import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Define the CartItem interface
interface CartItem {
  id: string;
  mealName: string;
  quantity: number;
  price: number;
  mealThumb: string;
  _id: string;
}

// Define the Transaction interface
interface Transaction {
  _id: string;
  username: string;
  email: string;
  totalprice: number;
  cartItems: CartItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

// Create an entity adapter for transactions
const adminAdapter = createEntityAdapter<Transaction>({
  selectId: (transaction) => transaction._id,
});

// Define the initial state using the adapter's getInitialState method
const initialState: EntityState<Transaction> & {
  loading: boolean;
  error: string | null;
} = adminAdapter.getInitialState({
  loading: false,
  error: null,
});

// Base URL for the API
const baseUrl = "http://127.0.0.1:5000";

// Create an async thunk for fetching transactions
export const fetchTransactionsData = createAsyncThunk<Transaction[], void>(
  "transactions/fetchTransactions", // Use a unique action type
  async () => {
    try {
      const response = await axios.get<Transaction[]>(
        `${baseUrl}/gettransaction`
      );
      return response.data; // Ensure this is an array of Transaction
    } catch (error) {
      console.error(error);
      throw new Error("Transaction fetching failed");
    }
  }
);

// Create a slice for transactions
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionsData.fulfilled, (state, action) => {
        state.loading = false;
        adminAdapter.setAll(action.payload, state); // This should work if action.payload is an array
      })
      .addCase(fetchTransactionsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      });
  },
});

// Export the adapter's selectors
export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionById,
} = adminAdapter.getSelectors<RootState>((state) => state.transactions);

// Export the async thunk and the reducer
export default transactionSlice.reducer;
