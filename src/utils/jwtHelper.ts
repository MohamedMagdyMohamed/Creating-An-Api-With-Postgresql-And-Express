import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// Init the dotenv
dotenv.config();

// Get the Token_Secret from the env file
const { TOKEN_SECRET } = process.env;

/**
 * Export the method for creating the JWT token which takes the userId
 * @param userId of the user
 * @returns JWT token
 */
export const createToken = (userId?: number): string => {
    return jwt.sign(
        { userId: userId },
        TOKEN_SECRET as unknown as string
    );
};

/**
 * Expose the verifyToken middleware to verify that the Authorization token exists and valid
 * @param req express request
 * @param res express response
 * @param next express next function
 * @returns void
 */
export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const headerAuth = req.headers.authorization;
        if (headerAuth) {
            const token = headerAuth.split(' ')[1];
            // verify the token with the token_secret which is used to generate the token
            jwt.verify(token, TOKEN_SECRET as unknown as string);
            next();
        } else {
            res.status(401).send("Login Error, Please login again");
            return;
        }
    } catch(error) {
        res.status(401).send(error);
        return;
    }
};
