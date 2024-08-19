import Stripe from "stripe";
import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../models/orderModel.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session -> api/payment/checkout_session
export const stripeCheckoutSession = catchAsyncError(async (req, res, next) => {
  const body = req?.body;

  const shipping_rate =
    body?.itemsPrice > 400
      ? "shr_1Pp3QaF3P5zuGRUSA8gTomey"
      : "shr_1Pp3RxF3P5zuGRUSlyW2yDWb";

  const line_items = body?.orderItems?.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          images: [item?.image],
          metadata: {
            productId: item?.product,
          },
        },
        unit_amount: item?.price * 100,
      },
      tax_rates: ["txr_1Pp4MMF3P5zuGRUSuRgTzKso"],
      quantity: item?.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: body?.user?.email,
    client_reference_id: req?.user?._id?.toString(),
    mode: "payment",
    metadata: { ...body?.shippingInfo, itemsPrice: body?.itemsPrice },
    shipping_options: [{ shipping_rate }],
    line_items,
  });

  res.status(200).json({
    url: session.url,
  });
});

const getOrderItems = (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        name: product.name,
        quantity: item.quantity,
        price: item.price.unit_amount_decimal / 100,
        image: product.images[0],
      });
      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

// Stripe webhook to save order after successful payment -> api/payment/webhook
export const stripeWebhook = catchAsyncError(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        state: session.metadata.state,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        user,
        paymentInfo,
        totalAmount,
        taxAmount,
        shippingAmount,
        paymentMethod: "card",
      };

      console.log(orderData);

      await Order.create(orderData);

      res.status(201).json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
});
