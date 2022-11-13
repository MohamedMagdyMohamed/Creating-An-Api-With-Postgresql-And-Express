import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { verifyToken } from '../utils/jwtHelper';

// orderStore model object
const orderStore = new OrderStore();

// Index route is calling the index in the order model to get all the orders list
const index = async (_req: Request, res: Response) => {
    try {
        const orders = await orderStore.index();
        res.json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Show route is order to get the order by its id
const show = async (req: Request, res: Response) => {
    try {
        const order = await orderStore.show(parseInt(req.params.id));
        res.json(order);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Create route is used to create a new order in the database
const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id
        };
        const newOrder = await orderStore.create(order);
        res.json(newOrder);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Destroy reoute used to delete order in the database by its id
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await orderStore.delete(parseInt(req.params.id));
        res.json(deleted);
    } catch(err) {
        res.status(500).json(err);
    }
}
  
// All the orderRoutes are held in this variable to be exposed and used in the express
const orderRoutes = (app: express.Application) => {
app.get('/orders', verifyToken, index);
app.get('/orders/:id', verifyToken, show);
app.post('/orders', verifyToken, create);
app.delete('/orders/:id', verifyToken, destroy);
}
  
// Export the orderRoutes to be used in the express app
export default orderRoutes;
