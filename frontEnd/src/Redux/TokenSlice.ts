import { createSlice } from "@reduxjs/toolkit";

export type TokenType = {
  token: string;
};
const TokenSlice = createSlice({
  name: "token",
  initialState: <TokenType>{
    token: "",
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    removeToken: (state, action) => {
      state.token = "";
    },
  },
});

export const { setToken, removeToken } = TokenSlice.actions;
export default TokenSlice.reducer;
export const TokenForUser = (state) => state.token;
