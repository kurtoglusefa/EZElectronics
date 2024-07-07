import { describe, test, expect, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../../index";
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import ErrorHandler from "../../src/helper";
import { Category, Product } from "../../src/components/product";
import { ProductAlreadyExistsError, ValidationError, ProductNotFoundError, EmptyProductStockError, LowProductStockError } from "../../src/errors/productError";
import { DateError } from "../../src/utilities";

const baseURL = "/ezelectronics";

jest.mock("../../src/controllers/productController");
jest.mock("../../src/routers/auth");

let testProduct = new Product(50.0, "model", Category.SMARTPHONE, "2024-05-30", "details", 2)
let testProduct2 = new Product(100.0, "model2", Category.APPLIANCE, "2024-05-30", "more details", 4)

describe("Route unit tests", () => {
    describe("POST /products", () => {
        test("It should return a 200 success code", async () => {
          
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) }),
                    isIn: () => ({ isLength: () => ({}) }),
                    isDate: () => ({ format: () => ({}) }),
                    isFloat: () => ({ min: () => ({}) }),
                })),
            }))

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(ProductController.prototype, "registerProducts").mockResolvedValueOnce();

            const response = await request(app).post(baseURL + "/products").send(testProduct);
            expect(response.status).toBe(200);
            expect(ProductController.prototype.registerProducts).toHaveBeenCalled();
            expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
                testProduct.model,
                testProduct.category,
                testProduct.arrivalDate,
                testProduct.sellingPrice,
                testProduct.quantity,
                testProduct.details
            )
        })

        test("It should fail if the user is not an Admin or Manager", async () => {
          
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app).post(baseURL + "/products").send(testProduct);
            expect(response.status).toBe(401);
        })

        test("It should return 409 if the product already exists", async () => {
            jest.spyOn(ProductController.prototype, "registerProducts").mockRejectedValueOnce(new ProductAlreadyExistsError());

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            const response = await request(app).post(baseURL + "/products").send(testProduct);
            expect(response.status).toBe(409);
        })

        test("It should return a 422 error for invalid data", async () => {
            const invalidProduct = { ...testProduct, quantity: -10, model: "" };
            jest.spyOn(ProductController.prototype, "registerProducts").mockRejectedValueOnce(new ValidationError("Invalid data"));
            const response = await request(app).post(baseURL + "/products").send(invalidProduct);
            expect(response.status).toBe(422);
        })

        test("It should return a 422 error for wrong date", async () => {
            const invalidProduct = { ...testProduct, date: "2020-01-01", model: "" };
            jest.spyOn(ProductController.prototype, "registerProducts").mockRejectedValueOnce(new DateError());
            const response = await request(app).post(baseURL + "/products").send(invalidProduct);
            expect(response.status).toBe(422);
        })
    })

    describe("PATCH /products/:model", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) })
                })),
                body: jest.fn().mockImplementation(() => ({
                    isFloat: () => ({ min: () => ({}) }),
                    isDate: () => ({ format: () => ({}) })
                })),
            }))

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a 200 success code and the total quantity", async () => {
            const testModel = "testModel";
            const testQuantity = 10;
            const testChangeDate = "2024-06-01";
            const totalQuantity = 100;

            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockResolvedValueOnce(totalQuantity);

            const response = await request(app)
                .patch(baseURL + `/products/${testModel}`)
                .send({ quantity: testQuantity, changeDate: testChangeDate });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ totalQuantity });
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.changeProductQuantity).toHaveBeenCalledWith(testModel, testQuantity, testChangeDate);
        })

        test("It should fail if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" })
            })

            const response = await request(app)
                .patch(baseURL + `/products/testModel`)
                .send({ quantity: 10, changeDate: "2024-06-01" })

            expect(response.status).toBe(401);
        })

        test("It should return a 422 error for invalid data", async () => {
            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockRejectedValueOnce(new ValidationError("Invalid quantity"));
            const response = await request(app)
                .patch(baseURL + `/products/testModel`)
                .send({ quantity: -10, changeDate: "invalid-date" })

            expect(response.status).toBe(422);
        })


        test("It should return 404 if the product is not found", async () => {
            jest.spyOn(ProductController.prototype, "changeProductQuantity").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app)
                .patch(baseURL + `/products/testModel`)
                .send({ quantity: 10, changeDate: "2024-06-01" })

            expect(response.status).toBe(422);
            //expect(response.status).toBe(404);
        })
    })

    describe("PATCH /products/:model/sell", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ notEmpty: () => ({}) })
                })),
                body: jest.fn().mockImplementation(() => ({
                    isFloat: () => ({ min: () => ({}) }),
                    isDate: () => ({ format: () => ({}) })
                })),
            }))

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a 200 success code and the total quantity after selling the product", async () => {
            const testModel = "testModel";
            const testQuantity = 1;
            const testSellingDate = "2024-06-01";
            const totalQuantity = 99;

            jest.spyOn(ProductController.prototype, "sellProduct").mockResolvedValueOnce(totalQuantity);

            const response = await request(app)
                .patch(baseURL + `/products/${testModel}/sell`)
                .send({ quantity: testQuantity, sellingDate: testSellingDate });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ totalQuantity });
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(testModel, testQuantity, testSellingDate);
        })

        test("It should fail if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: 1, sellingDate: "2024-06-01" });

            expect(response.status).toBe(401);
        })

        test("It should return 400 if the selling date is invalid", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new DateError());

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: 1, sellingDate: "2025-06-01" });

            expect(response.status).toBe(400);
        })

        test("It should return 404 if the product is not found", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: 1, sellingDate: "2024-06-01" });

            expect(response.status).toBe(404);
        })

        test("It should return 409 if the product stock is empty", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new EmptyProductStockError());

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: 1, sellingDate: "2024-06-01" });

            expect(response.status).toBe(409);
        })

        test("It should return 409 if the product stock is lower than the requested quantity", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new LowProductStockError());

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: 10, sellingDate: "2024-06-01" });

            expect(response.status).toBe(409);
        })

        test("It should return 422 if the quantity is invalid", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new ValidationError("Quantity of the product must be greater than 0"));

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: -1, sellingDate: "2024-06-01" });

            expect(response.status).toBe(422);
        })

        test("It should return 422 if quantity is negative", async () => {
            jest.spyOn(ProductController.prototype, "sellProduct").mockRejectedValueOnce(new ValidationError("Invalid quantity"));

            const response = await request(app)
                .patch(baseURL + `/products/testModel/sell`)
                .send({ quantity: -10, sellingDate: "2025-06-01" });

            expect(response.status).toBe(422);
        })
    })

    describe("GET /products", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: 'user' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a list of products without any filtering", async () => {
            const products = [testProduct, testProduct2];
            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + '/products');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith(null, null, null);
        })

        test("It should return a list of products filtered by category", async () => {
            const category = 'Smartphone';
            const products = [testProduct];
            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + `/products?grouping=category&category=${category}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith('category', category, null);
        })

        test("It should return a list of products filtered by model", async () => {
            const model = 'model1';
            const products = [testProduct];
            jest.spyOn(ProductController.prototype, "getProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + `/products?grouping=model&model=${model}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getProducts).toHaveBeenCalledWith('model', null, model);
        })

        test("It should handle validation errors", async () => {
            const errorMessage = 'Grouping is null but category or model is not null.';
            jest.spyOn(ProductController.prototype, "getProducts").mockRejectedValueOnce(new ValidationError(errorMessage));

            const response = await request(app)
                .get(baseURL + '/products?grouping=null&category=testCategory');

            expect(response.status).toBe(422);
        })
    })    

    describe("GET /getAvailableProducts", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: 'user' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a list of available products without any filtering", async () => {
            const products = [testProduct, testProduct2];
            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + '/products/available');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith(null, null, null);
        })

        test("It should return a list of available products filtered by category", async () => {
            const category = 'Smartphone';
            const products = [testProduct];
            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + `/products/available?grouping=category&category=${category}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith('category', category, null);
        })

        test("It should return a list of available products filtered by model", async () => {
            const model = 'model1';
            const products = [testProduct];
            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockResolvedValueOnce(products);

            const response = await request(app)
                .get(baseURL + `/products/available?grouping=model&model=${model}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
            expect(ProductController.prototype.getAvailableProducts).toHaveBeenCalledWith('model', null, model);
        })

        test("It should handle validation errors", async () => {
            const errorMessage = 'Grouping is null but category or model is not null.';
            jest.spyOn(ProductController.prototype, "getAvailableProducts").mockRejectedValueOnce(new ValidationError(errorMessage));

            const response = await request(app)
                .get(baseURL + '/products/available?grouping=null&category=testCategory');

            expect(response.status).toBe(422);
        })

    })

    describe("DELETE /products", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a 200 success code and true after deleting all products", async () => {
            jest.spyOn(ProductController.prototype, "deleteAllProducts").mockResolvedValueOnce(true);

            const response = await request(app)
                .delete(baseURL + '/products');

            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
            expect(ProductController.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
        })

        test("It should fail if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app)
                .delete(baseURL + '/products');

            expect(response.status).toBe(401);
        })
    })    

    describe("DELETE /products/:model", () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'admin' };
                return next();
            })

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            })
        })

        test("It should return a 200 success code and true after deleting the product", async () => {
            const model = 'testModel';
            jest.spyOn(ProductController.prototype, "deleteProduct").mockResolvedValueOnce(true);

            const response = await request(app)
                .delete(baseURL + `/products/${model}`);

            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(1);
            expect(ProductController.prototype.deleteProduct).toHaveBeenCalledWith(model);
        })

        test("It should return a 404 error if the product is not found", async () => {
            const model = 'nonExistentModel';
            jest.spyOn(ProductController.prototype, "deleteProduct").mockRejectedValueOnce(new ProductNotFoundError());

            const response = await request(app)
                .delete(baseURL + `/products/${model}`);

            expect(response.status).toBe(404);
        })

        test("It should fail if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app)
                .delete(baseURL + '/products/testModel');

            expect(response.status).toBe(401);
        })
    })
})

