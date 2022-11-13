import express, { Request, Response } from 'express';
import { OrderDetail, OrderDetailStore } from '../models/order_detail';
import { verifyToken } from '../utils/jwtHelper';

// orderDetailStore model object
const orderDetailStore = new OrderDetailStore();

// Index route is calling the index in the orderDetail model to get all the orderDetails list
const index = async (_req: Request, res: Response) => {
    try {
        const orderDetails = await orderDetailStore.index();
        res.json(orderDetails);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Show route is orderDetail to get the orderDetail by its id
const show = async (req: Request, res: Response) => {
    try {
        const orderDetail = await orderDetailStore.show(parseInt(req.params.id));
        res.json(orderDetail);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Create route is used to create a new orderDetail in the database
const create = async (req: Request, res: Response) => {
    try {
        const orderDetail: OrderDetail = {
            quantity: req.body.quantity,
            product_id: req.body.product_id,
            order_id: req.body.order_id,
        };
        const newOrderDetail = await orderDetailStore.create(orderDetail);
        res.json(newOrderDetail);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Destroy reoute used to delete orderDetail in the database by its id
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await orderDetailStore.delete(parseInt(req.params.id));
        res.json(deleted);
    } catch(err) {
        res.status(500).json(err);
    }
}
  
// All the orderDetailRoutes are held in this variable to be exposed and used in the express
const orderDetailRoutes = (app: express.Application) => {
app.get('/order_details', verifyToken, index);
app.get('/order_details/:id', verifyToken, show);
app.post('/order_details', verifyToken, create);
app.delete('/order_details/:id', verifyToken, destroy);
}
  
// Export the orderDetailRoutes to be used in the express app
export default orderDetailRoutes;
