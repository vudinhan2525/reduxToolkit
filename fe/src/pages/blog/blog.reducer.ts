import { createReducer, createAction, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import http from "utils/http";
import { Post } from "types/blogs.type";
interface BlogState {
  postList: Post[];
  updatingPost: Post | null;
}
const initialState: BlogState = {
  postList: [],
  updatingPost: null,
};
export const getPostList = createAsyncThunk("blog/getPostList", async (_, thunkAPI) => {
  const res = await http.get<Post[]>("posts", {
    signal: thunkAPI.signal,
  });

  return res.data;
});
export const addPost = createAsyncThunk("blog/addPost", async (body: Omit<Post, "id">, thunkAPI) => {
  const res = await http.post<Post>("posts", body, {
    signal: thunkAPI.signal,
  });
  return res.data;
});
const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase("blog/getPostListSuccess", (state, action: any) => {
        state.postList = action.payload;
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      });
  },
});
export const { cancelUpdatingPost, deletePost, endUpdatingPost, startUpdatingPost } = blogSlice.actions;
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
