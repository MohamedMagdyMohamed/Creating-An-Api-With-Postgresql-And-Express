import express, { Request, Response } from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import orderDetailRoutes from './handlers/order_details';

// Exprot the exress app to be used with the super test the apis
export const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());
// use cors as a middleware for the whole apis
app.use(cors());

// set the routes of the app
userRoutes(app);
productRoutes(app);
orderRoutes(app);
orderDetailRoutes(app);

// The initial route return hello world
app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
});

// Listen for the server and print out that the server is started
app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
});
