import { configureStore } from "@reduxjs/toolkit";
import blogSlice from "pages/blog/blog.reducer";
import { useDispatch } from "react-redux";
export const store = configureStore({
  reducer: {
    blog: blogSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
