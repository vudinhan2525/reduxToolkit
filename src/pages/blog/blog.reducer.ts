import { createReducer, createAction } from "@reduxjs/toolkit";
import { Post } from "types/blogs.type";
import { initialBlogList } from "constants/blog";
interface BlogState {
  postList: Post[];
}

export const addPost = createAction<Post>("blog/addPost");
export const deletePost = createAction<string>("blog/deletePost");

const initialState: BlogState = {
  postList: initialBlogList,
};
const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload);
    })
    .addCase(deletePost, (state, action) => {
      const postId = action.payload;
      const postIndex = state.postList.findIndex((el: Post) => (el.id = postId));
      if (postIndex < 0) return;
      state.postList.splice(postIndex, 1);
    });
});
export default blogReducer;
