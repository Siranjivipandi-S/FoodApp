import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface CartItem {
  id: string;
  mealName: string;
  quantity: number;
  mealThumb: string;
  price: number; // Price per unit
}

export interface UpdateCartType {
  id: string;
  quantity: number;
}

const CartAdapter = createEntityAdapter<CartItem>({
  selectId: (item) => item.id,
});

const baseUrl = "http://127.0.0.1:5000";

export const AddtoCart = createAsyncThunk(
  "/addCart",
  async (cartItem: CartItem) => {
    const { id, mealName, quantity, price, mealThumb } = cartItem;
    try {
      return { id, mealName, quantity, price, mealThumb };
    } catch (error) {
      console.log(error);
    }
  }
);

export const UpdateCartEvent = createAsyncThunk(
  "/updateCart",
  async (item: UpdateCartType, { getState }) => {
    const { id, quantity } = item;
    const state = getState() as {
      cart: ReturnType<typeof CartAdapter.getInitialState>;
    };
    const cartItem = CartAdapter.getSelectors().selectById(state.cart, id);

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Calculate the new price based on the quantity
    const newPrice = cartItem.price * quantity;

    return { id, quantity, price: newPrice };
  }
);

export const DeleteCartEvent = createAsyncThunk(
  "/DeleteItemInCart",
  async (id: string) => {
    try {
      return { id };
    } catch (error) {
      console.log(error);
    }
  }
);

interface CheckoutPayload {
  username: string;
  email: string;
  totalprice: number;
  product: CartItem[];
}

export const checkoutEvent = createAsyncThunk(
  "checkout/checkoutEvent",
  async (payload: CheckoutPayload, { rejectWithValue }) => {
    const { username, email, product, totalprice } = payload;
    console.log(username, email, product);

    try {
      const response = await axios.post(
        `${baseUrl}/checkout`,
        { username, email, cartItems: product, totalprice },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState: CartAdapter.getInitialState({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddtoCart.fulfilled, (state, action) => {
      CartAdapter.addOne(state, action.payload);
    });

    builder.addCase(UpdateCartEvent.fulfilled, (state, action) => {
      const { id, quantity, price } = action.payload;
      CartAdapter.updateOne(state, {
        id,
        changes: { quantity, price }, // Update both quantity and price
      });
    });

    builder.addCase(DeleteCartEvent.fulfilled, (state, action) => {
      CartAdapter.removeOne(state, action.payload.id);
    });

    builder.addCase(checkoutEvent.fulfilled, (state, action) => {
      CartAdapter.removeAll(state);
    });
  },
});

export const {
  selectAll: selectAllCartItems,
  selectById: selectCartItemById,
  selectIds: selectCartItemIds,
} = CartAdapter.getSelectors(
  (state: { cart: ReturnType<typeof CartAdapter.getInitialState> }) =>
    state.cart
);

export default CartSlice.reducer;
