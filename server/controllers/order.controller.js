import Stripe from '../config/stripe.js';
import CartProductModel from '../models/cartproduct.model.js';
import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import mongoose from 'mongoose';

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: '',
        payment_status: 'CASH ON DELIVERY',
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
        order_status: 'Confirmed',
        quantity: el.quantity || 1,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    ///remove from the cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return response.json({
      message: 'Order successfully',
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            pricewithDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
        order_status: 'Confirmed',
        quantity: item.quantity || 1,
      };

      productList.push(paylod);
    }
  }

  return productList;
};

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

  console.log('event', event);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const order = await OrderModel.insertMany(orderProduct);

      console.log(order);
      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });
        const removeCartProductDB = await CartProductModel.deleteMany({
          userId: userId,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId; // order id

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate('delivery_address');

    return response.json({
      message: 'order list',
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Admin function to get all orders
export async function getAllOrdersAdminController(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 50;
    const skip = (page - 1) * limit;

    const orderlist = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email mobile')
      .populate('delivery_address')
      .populate('productId', 'name category')
      .skip(skip)
      .limit(limit);

    const totalOrders = await OrderModel.countDocuments();

    return response.json({
      message: 'All orders list',
      data: orderlist,
      totalOrders: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Admin function to update order status
export async function updateOrderStatusController(request, response) {
  try {
    const { orderId, status } = request.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return response.status(400).json({
        message: 'Invalid order status',
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { order_status: status },
      { new: true }
    )
      .populate('userId', 'name email mobile')
      .populate('delivery_address');

    if (!updatedOrder) {
      return response.status(404).json({
        message: 'Order not found',
        error: true,
        success: false,
      });
    }

    return response.json({
      message: 'Order status updated successfully',
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get order statistics for admin dashboard
export async function getOrderStatsController(request, response) {
  try {
    const totalOrders = await OrderModel.countDocuments();
    const pendingOrders = await OrderModel.countDocuments({
      order_status: 'Pending',
    });
    const confirmedOrders = await OrderModel.countDocuments({
      order_status: 'Confirmed',
    });
    const preparingOrders = await OrderModel.countDocuments({
      order_status: 'Preparing',
    });
    const outForDeliveryOrders = await OrderModel.countDocuments({
      order_status: 'Out for Delivery',
    });
    const deliveredOrders = await OrderModel.countDocuments({
      order_status: 'Delivered',
    });
    const cancelledOrders = await OrderModel.countDocuments({
      order_status: 'Cancelled',
    });

    // Calculate total revenue
    const revenueData = await OrderModel.aggregate([
      { $match: { order_status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmt' } } },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    return response.json({
      message: 'Order statistics',
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
