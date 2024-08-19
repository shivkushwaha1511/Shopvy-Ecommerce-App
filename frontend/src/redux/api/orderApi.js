import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    placeNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/orders",
          method: "POST",
          body,
        };
      },
    }),
    getMyOrders: builder.query({
      query: () => "/orders",
    }),
    getOrderDetail: builder.query({
      query: (id) => `/orders/${id}`,
    }),
    createStripeSession: builder.mutation({
      query(body) {
        return {
          url: "/payment/checkout_session",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  usePlaceNewOrderMutation,
  useCreateStripeSessionMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
} = orderApi;
