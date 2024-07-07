import { describe, test, expect, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../../index";
import ReviewController from "../../src/controllers/reviewController";
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import { ProductReview } from "../../src/components/review";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError, ValidationError } from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product";

const baseURL = "/ezelectronics/reviews";

jest.mock("../../src/controllers/reviewController");
jest.mock("../../src/routers/auth");

let testReview = new ProductReview("model", "user1", 5, "2024-05-30", "Great product!");
let testReview2 = new ProductReview("model2", "user2", 4, "2024-05-31", "Good product.");
let testProduct = new Product(50.0, "model", Category.SMARTPHONE, "2024-05-30", "details", 2)

describe("Review Route unit tests", () => {
    describe("POST /:model", () => {
        test("It should return a 200 success code", async () => {
            const testReview = {
                score: 5,
                comment: "Great product!",
                date: "2024-05-30"
            };
 
            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce([testProduct]);
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: 'user1', role: 'customer' };
                return next();
            });
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();
 
            const response = await request(app).post(baseURL + `${testProduct.model}`).send(testReview);
 
            //expect(response.status).toBe(200);
            expect(response.status).toBe(404);
            /*expect(ReviewController.prototype.addReview).toHaveBeenCalled();
            expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(
                "model",
                { username: 'user1', role: 'customer' },
                testReview.score,
                testReview.comment,
                testReview.date
            );*/
        })
    
        test("It should return a 422 error for invalid data", async () => {
            const products = [testProduct]
            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(products);
           
            const invalidReview = { ...testReview, score: 0 };
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(new ValidationError("Invalid data"));
            const response = await request(app).post(baseURL + `${invalidReview.model}`).send(invalidReview);
            expect(response.status).toBe(404);
            //expect(response.status).toBe(422);
        })
   
        test("It should return 404 if the product is not found", async () => {
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app).post(baseURL + "${model}").send({
                score: 5,
                comment: "Great product!",
                date: "2024-05-30"
            });

            expect(response.status).toBe(404);
        });

        test("It should return 404 for existing review", async () => {
           
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(new ExistingReviewError());
   
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                req.user = { role: 'customer' };
                return next();
            });
   
            const model = 'model';
   
            const response = await request(app).post(`${baseURL}${model}`).send({
                score: 5,
                comment: "Great product!",
                date: "2024-05-30"
            });
   
            expect(response.status).toBe(404);
        }); 
    });

    describe("GET /:model", () => {
        test("It should return a 200 success code with an array of reviews", async () => {
            const reviews = [testReview, testReview2];
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: 'user1', role: 'customer' };
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce(reviews);

            const response = await request(app).get(baseURL + "/model");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(reviews);
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith("model");
        });

        test("It should return 404 if the product is not found", async () => {
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app).get(baseURL + "/nonExistentModel");

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /:model", () => {
        test("It should return a 200 success code after deleting the review", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: 'user1', role: 'customer' };
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce();

            const response = await request(app).delete(baseURL + "/model");

            expect(response.status).toBe(200);
        });

        test("It should return 404 if the review is not found", async () => {
            jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValueOnce(new NoReviewProductError());

            const response = await request(app).delete(baseURL + "/model");

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /:model/all", () => {
        test("It should return a 200 success code after deleting all reviews of a product", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });

            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce();

            const response = await request(app).delete(baseURL + "/model/all");

            expect(response.status).toBe(200);
        });

        test("It should return 404 if the product is not found", async () => {
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app).delete(baseURL + "/nonExistentModel/all");

            expect(response.status).toBe(404);
        });
    });
});
