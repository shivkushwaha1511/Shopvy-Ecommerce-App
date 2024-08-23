import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Orders", "OrderDetail", "AdminOrders"],
  endpoints: (builder) => ({
    placeNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/orders",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Orders"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrderDetail: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["OrderDetail"],
    }),
    getOrderSales: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/sales/?startDate=${startDate}&endDate=${endDate}`,
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
    getAdminOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["OrderDetail", "AdminOrders"],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  usePlaceNewOrderMutation,
  useCreateStripeSessionMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
  useLazyGetOrderSalesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
