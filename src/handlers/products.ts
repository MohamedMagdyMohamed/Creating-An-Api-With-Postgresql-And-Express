import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from '../utils/jwtHelper';

// productStore model object
const productStore = new ProductStore();

// Index route is calling the index in the product model to get all the products list
const index = async (_req: Request, res: Response) => {
    try {
        const products = await productStore.index();
        res.json(products);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Show route is product to get the product by its id
const show = async (req: Request, res: Response) => {
    try {
        const product = await productStore.show(parseInt(req.params.id));
        res.json(product);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Create route is used to create a new product in the database
const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price
        };
        const newProduct = await productStore.create(product);
        res.json(newProduct);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Update route is used to update an existing product in the database
const update = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        };
        const updatedProduct = await productStore.update(product);
        res.json(updatedProduct);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Destroy reoute used to delete product in the database by its id
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await productStore.delete(parseInt(req.params.id));
        res.json(deleted);
    } catch(err) {
        res.status(500).json(err);
    }
}
  
// All the productRoutes are held in this variable to be exposed and used in the express
const productRoutes = (app: express.Application) => {
app.get('/products', index);
app.get('/products/:id', show);
app.post('/products', verifyToken, create);
app.patch('/products', verifyToken, update);
app.delete('/products/:id', verifyToken, destroy);
}
  
// Export the productRoutes to be used in the express app
export default productRoutes;
