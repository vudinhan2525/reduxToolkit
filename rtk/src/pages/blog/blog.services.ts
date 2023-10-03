import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "../../types/blogs.type";
export const blogApi = createApi({
  reducerPath: "blogApi",
  tagTypes: ["Posts"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3004/" }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts",
      providesTags: (result) => {
        return result
          ? [...result.map(({ id }) => ({ type: "Posts" as const, id })), { type: "Posts" as const, id: "LIST" }]
          : [{ type: "Posts" as const, id: "LIST" }];
      },
    }),
    addPost: builder.mutation<Post, Omit<Post, "id">>({
      query(body) {
        return {
          url: "posts",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    getOnePost: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
    updatePost: builder.mutation<Post, Post>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, error, data) => [{ type: "Posts", id: data.id }],
    }),
    deletePost: builder.mutation<void, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, data) => [{ type: "Posts", id: data }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useGetOnePostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogApi;
