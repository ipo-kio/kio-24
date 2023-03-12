import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email?: string | null;
  uid?: string | null;
  isAuth: boolean;
  isEmailVerified?: boolean;
  provider?: string;
  creationTime?: string;
  lastSingInTime?: string;
  displayName?: string | null;
  basePath?: string;
}

const initialState: UserState = {
  isAuth: false,
  isEmailVerified: true,
  basePath: ".",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    setBasePath(state, action: PayloadAction<string>) {
      state.basePath = action.payload || ".";
    },
  },
});

export const { setUser, setBasePath } = userSlice.actions;

export const userReducer = userSlice.reducer;
