import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  paymentController,
  webhookStripe,
  getAllOrdersAdminController,
  updateOrderStatusController,
  getOrderStatsController,
} from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);
orderRouter.post('/webhook', webhookStripe);
orderRouter.get('/order-list', auth, getOrderDetailsController);

// Admin routes
orderRouter.get('/admin/all-orders', auth, admin, getAllOrdersAdminController);
orderRouter.post(
  '/admin/update-status',
  auth,
  admin,
  updateOrderStatusController
);
orderRouter.get('/admin/stats', auth, admin, getOrderStatsController);

export default orderRouter;
