import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import http from "utils/http";
import { Post } from "types/blogs.type";
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
interface BlogState {
  postList: Post[];
  updatingPost: Post | null;
  loading: boolean;
  currentReqId: undefined | string;
}
const initialState: BlogState = {
  postList: [],
  updatingPost: null,
  loading: false,
  currentReqId: undefined,
};
export const getPostList = createAsyncThunk("blog/getPostList", async (_, thunkAPI) => {
  const res = await http.get<Post[]>("posts", {
    signal: thunkAPI.signal,
  });

  return res.data;
});
export const addPost = createAsyncThunk("blog/addPost", async (body: Omit<Post, "id">, thunkAPI) => {
  try {
    const res = await http.post<Post>("posts", body, {
      signal: thunkAPI.signal,
    });
    return res.data;
  } catch (error: any) {
    if (error.name === "AxiosError" && error.response.status === 422) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    throw error;
  }
});
export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    try {
      const res = await http.put<Post>(`posts/${postId}`, body, {
        signal: thunkAPI.signal,
      });
      return res.data;
    } catch (error: any) {
      if (error.name === "AxiosError" && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);
export const deletePost = createAsyncThunk("blog/deletePost", async (postId: string, thunkAPI) => {
  await http.delete(`posts/${postId}`, {
    signal: thunkAPI.signal,
  });
  return postId;
});
const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
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
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const postIndex = state.postList.findIndex((el: Post) => el.id === action.payload.id);
        state.postList[postIndex] = action.payload;
        state.updatingPost = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postIndex = state.postList.findIndex((el: Post) => el.id === action.payload);
        if (postIndex < 0) return;
        state.postList.splice(postIndex, 1);
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentReqId = action.meta.requestId;
        },
      )
      .addMatcher<FulfilledAction | RejectedAction>(
        (action) => action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
        (state, action) => {
          if (state.loading === true && state.currentReqId === action.meta.requestId) {
            state.loading = false;
            state.currentReqId = undefined;
          }
        },
      );
  },
});
export const { cancelUpdatingPost, startUpdatingPost } = blogSlice.actions;
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
