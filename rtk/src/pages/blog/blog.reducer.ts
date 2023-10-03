import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface BlogState {
  postId: string;
}
const initialState: BlogState = {
  postId: "",
};
const BlogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    startUpdatingPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    cancelUpdatingPost: (state) => {
      state.postId = "";
    },
  },
});
export const { cancelUpdatingPost, startUpdatingPost } = BlogSlice.actions;
const blogReducer = BlogSlice.reducer;
export default blogReducer;
