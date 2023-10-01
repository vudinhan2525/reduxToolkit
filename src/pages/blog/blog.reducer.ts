import { createReducer, createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "types/blogs.type";
import { initialBlogList } from "constants/blog";
interface BlogState {
  postList: Post[];
  updatingPost: Post | null;
}
const initialState: BlogState = {
  postList: initialBlogList,
  updatingPost: null,
};
const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.postList.push(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const postIndex = state.postList.findIndex((el: Post) => el.id === postId);
      if (postIndex < 0) return;
      state.postList.splice(postIndex, 1);
    },
    startUpdatingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const post = state.postList.find((el: Post) => el.id === postId);
      if (post) {
        state.updatingPost = post;
      }
    },
    cancelUpdatingPost: (state) => {
      state.updatingPost = null;
    },
    endUpdatingPost: (state, action: PayloadAction<Post>) => {
      const postIndex = state.postList.findIndex((el: Post) => el.id === action.payload.id);
      state.postList[postIndex] = action.payload;
      state.updatingPost = null;
    },
  },
  extraReducers: (builder) => {},
});
export const { addPost, cancelUpdatingPost, deletePost, endUpdatingPost, startUpdatingPost } = blogSlice.actions;
export default blogSlice.reducer;
// export const addPost = createAction<Post>("blog/addPost");
// export const deletePost = createAction<string>("blog/deletePost");
// export const startUpdatingPost = createAction<string>("blog/startUpdatingPost");
// export const cancelUpdatingPost = createAction("blog/cancelUpdatingPost");
// export const endUpdatingPost = createAction<Post>("blog/endUpdatingPost");

// const blogReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(addPost, (state, action) => {
//       state.postList.push(action.payload);
//     })
//     .addCase(deletePost, (state, action) => {
//       const postId = action.payload;
//       const postIndex = state.postList.findIndex((el: Post) => el.id === postId);
//       if (postIndex < 0) return;
//       state.postList.splice(postIndex, 1);
//     })
//     .addCase(startUpdatingPost, (state, action) => {
//       const postId = action.payload;
//       const post = state.postList.find((el: Post) => el.id === postId);
//       if (post) {
//         state.updatingPost = post;
//       }
//     })
//     .addCase(cancelUpdatingPost, (state, action) => {
//       state.updatingPost = null;
//     })
//     .addCase(endUpdatingPost, (state, action) => {
//       const postIndex = state.postList.findIndex((el: Post) => el.id === action.payload.id);
//       state.postList[postIndex] = action.payload;
//       state.updatingPost = null;
//     })
//     .addDefaultCase((state, action) => {});
// });
// export default blogReducer;
