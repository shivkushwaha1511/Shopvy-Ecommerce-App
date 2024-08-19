import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          keyword: params?.keyword,
          "price[gte]": params?.min,
          "price[lte]": params?.max,
          category: params?.category,
          "ratings[gte]": params?.ratings,
        },
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Review"],
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Review"],
    }),
    canReview: builder.query({
      query: (id) => {
        return `/can_review?productId=${id}`;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanReviewQuery,
} = productApi;
