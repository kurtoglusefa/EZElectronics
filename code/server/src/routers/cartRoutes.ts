import { body, param } from "express-validator"
import { Cart } from "../components/cart"
import express, { Router } from "express";
import ErrorHandler from "../helper";
import CartController from "../controllers/cartController";
import Authenticator from "./auth";



/**
 * Represents a class that defines the routes for handling carts.
 */
class CartRoutes {
    private controller: CartController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authenticator: Authenticator;

    /**
     * Constructs a new instance of the CartRoutes class.
     * @param {Authenticator} authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator;
        this.controller = new CartController();
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.initRoutes();
    }

    /**
     * Returns the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router;
    }

    /**
     * Initializes the routes for the cart router.
     */
    initRoutes() {
        // Apply authentication middleware to all routes
        //this.router.use(this.authenticator.isLoggedIn.bind(this.authenticator));

        /**
         * Route for getting the cart of the logged-in customer.
         */
        this.router.get(
            "/",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.getCart(req.user)
                    .then((cart: any) => {
                        res.status(200).json(cart);
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        );

        /**
         * Route for adding a product unit to the cart of the logged-in customer.
         */
        this.router.post(
            "/",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.addToCart(req.user, req.body.model)
                    .then(() => res.status(200).end())
                    .catch((err) => {
                        next(err);
                    });
            }
        );

        /**
         * Route for checking out the cart of the logged-in customer.
         */
        this.router.patch(
            "/",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.checkoutCart(req.user)
                    .then(() => res.status(200).end())
                    .catch((err) => {
                        next(err);
                    });
            }
        );

        
        /**
         * Route for getting the history of the logged-in customer's carts.
         */
        this.router.get(
            "/history",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.getCustomerCarts(req.user)
                    .then((carts: any) => res.status(200).json(carts))
                    .catch((err) => next(err));
            }
        );
        
        /**
         * Route for removing a product unit from a cart.
         */
        this.router.delete(
            "/products/:model",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.removeProductFromCart(req.user, req.params.model)
                    .then(() => res.status(200).end())
                    .catch((err) => {
                        next(err);
                    });
            }
        );
        
        /**
         * Route for removing all products from the current cart.
         */
        this.router.delete(
            "/current",
            this.authenticator.isCustomer.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.clearCart(req.user)
                    .then(() => res.status(200).end())
                    .catch((err) => next(err));
            }
        );

        /**
         * Route for deleting all carts.
         */
        this.router.delete(
            "/",
            this.authenticator.isAdminOrManager.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.deleteAllCarts()
                    .then(() => res.status(200).end())
                    .catch((err: any) => next(err));
            }
        );

        /**
         * Route for retrieving all carts of all users.
         */
        this.router.get(
            "/all",
            this.authenticator.isAdminOrManager.bind(this.authenticator),
            (req: any, res: any, next: any) => {
                this.controller.getAllCarts()
                    .then((carts: any) => res.status(200).json(carts))
                    .catch((err: any) => next(err));
            }
        );
    }
}

export default CartRoutes;

