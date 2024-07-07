import express, { Router } from "express";
import ErrorHandler from "../helper";
import { body, param } from "express-validator";
import ReviewController from "../controllers/reviewController";
import Authenticator from "./auth";
import { ProductReview } from "../components/review";
import { ProductNotFoundError } from "../errors/productError";
/**
 * Represents a class that defines the routes for handling reviews.
 */
class ReviewRoutes {
    private controller: ReviewController;
    private router: Router;
    private errorHandler: ErrorHandler;
    private authenticator: Authenticator;

    /**
     * Constructs a new instance of the ReviewRoutes class.
     * @param {Authenticator} authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authenticator = authenticator;
        this.controller = new ReviewController();
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
     * Initializes the routes for the review router.
     * 
     * @remarks
     * This method sets up the HTTP routes for handling review-related operations such as adding reviews, retrieving reviews, and deleting reviews.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     * 
     */
    initRoutes() {

        /**
         * Route for adding a review to a product.
         * It requires the user calling it to be authenticated and to be a customer.
         * It expects a product model as a route parameter. This parameter must be a non-empty string and the product must exist.
         * It requires the following body parameters:
         * - score: number. It must be an integer between 1 and 5.
         * - comment: string. It cannot be empty.
         * - date: string. The date the review was made in the format YYYY-MM-DD.
         * It returns a 200 status code.
         */
        this.router.post(
            "/:model",
            this.authenticator.isCustomer,
            [
                param('model').isString().notEmpty(),
                body('score').isInt({ min: 1, max: 5 }),
                body('comment').isString().notEmpty(),
            ],
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    await this.controller.addReview(
                        req.params.model,
                        req.user,  
                        req.body.score,
                        req.body.comment,
                        req.date
                    );
                    res.status(200).send();
                } catch (err) {
                    console.error("Error in route handler:", err);
                    next(err);
                }
            }
        );

        /**
         * Route for retrieving all reviews of a product.
         * It requires the user to be authenticated.
         * It expects a product model as a route parameter. This parameter must be a non-empty string and the product must exist.
         * It returns an array of reviews.
         */
        
        this.router.get(
            "/:model",
            this.authenticator.isLoggedIn,
            [
                param('model').isString().notEmpty()
            ],
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    const reviews: ProductReview[] = await this.controller.getProductReviews(req.params.model);
                    res.status(200).json(reviews);
                } catch (err) {
                    console.error("Error in route handler:", err);
        
                    if (err instanceof ProductNotFoundError) {
                        res.status(404).json({ error: err.message });
                    } else {
                        next(err);
                    }
                }
            }
        );

        /**
         * Route for deleting the review made by a user for one product.
         * It requires the user to be authenticated and to be a customer.
         * It expects a product model as a route parameter. This parameter must be a non-empty string and the product must exist. The user must also have made a review for the product.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/:model",
            this.authenticator.isCustomer,
            [
                param('model').isString().notEmpty()
            ],
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    await this.controller.deleteReview(req.params.model, req.user); 
                    res.status(200).send();
                } catch (err) {
                    console.error("Error in route handler:", err);
                    next(err);
                }
            }
        );

        /**
         * Route for deleting all reviews of a product.
         * It requires the user to be authenticated and to be either an admin or a manager.
         * It expects a product model as a route parameter. This parameter must be a non-empty string and the product must exist.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/:model/all",
            this.authenticator.isAdminOrManager,
            [
                param('model').isString().notEmpty()
            ],
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) => {
                try {
                    await this.controller.deleteReviewsOfProduct(req.params.model);
                    res.status(200).send();
                } catch (err) {
                    console.error("Error in route handler:", err);
                    next(err);
                }
            }
        );

        /**
         * Route for deleting all reviews of all products.
         * It requires the user to be authenticated and to be either an admin or a manager.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/",
            this.authenticator.isAdminOrManager,
            async (req: any, res: any, next: any) => {
                try {
                    await this.controller.deleteAllReviews();
                    res.status(200).send();
                } catch (err) {
                    console.error("Error in route handler:", err);
                    next(err);
                }
            }
        );
    }
}

export default ReviewRoutes;
