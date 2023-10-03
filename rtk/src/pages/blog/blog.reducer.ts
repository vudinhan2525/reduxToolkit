import { createSlice } from "@reduxjs/toolkit";
interface BlogState {
  postId: string;
}
const initialState: BlogState = {
  postId: "",
};
const BlogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});
const blogReducer = BlogSlice.reducer;
export default blogReducer;
