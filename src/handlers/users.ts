import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import { createToken, verifyToken } from '../utils/jwtHelper';

// useStore model object
const userStore = new UserStore();

// Index route is calling the index in the user model to get all the users list
const index = async (_req: Request, res: Response) => {
    try {
        const users = await userStore.index();
        res.json(users);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Show route is used to get the user by its id
const show = async (req: Request, res: Response) => {
    try {
        const user = await userStore.show(parseInt(req.params.id));
        res.json(user);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Create route is used to create a new user in the database
const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        };
        const newUser = await userStore.create(user);
        // create the token to return it to the user to use it later
        const token = createToken(newUser.id);
        res.json(token);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Destroy reoute used to delete user in the database by its id
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await userStore.delete(parseInt(req.params.id));
        res.json(deleted);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Login route is used to login the user and get the token to be used in the token required apis
const login = async (req: Request, res: Response) => {
    try {
        const user = await userStore.login(req.body.firstName, req.body.password);
        if(user) {
            // create the token to return it to the user to use it later
            const token = createToken(user.id);
            res.json(token);
        } else {
            res.status(401).send('Please provide a valid firstname and password');
        }
    } catch(err) {
        res.status(500).json(err);
    }
}
  
// All the userReoutes are held in this variable to be exposed and used in the express
const userRoutes = (app: express.Application) => {
app.get('/users', verifyToken, index);
app.get('/users/:id', verifyToken, show);
app.post('/users', create);
app.delete('/users/:id', verifyToken, destroy);
app.post('/users/login', login);
}
  
// Export the userRoutes to be used in the express app
export default userRoutes;
