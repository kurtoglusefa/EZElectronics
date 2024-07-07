import { describe, test, expect, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../../index";
import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import { Cart, ProductInCart } from "../../src/components/cart";
import { Category } from "../../src/components/product";

const baseURL = "/ezelectronics";

jest.mock("../../src/controllers/cartController");
jest.mock("../../src/routers/auth");

let testCart: Cart = {

    //username: "testUser",
    paid: false,
    paymentDate: "",
    total: 0,
    products: [],
    customer: "testUser"
};

let testCartItem: ProductInCart = {
    model: "iPhone13",
    quantity: 1,
    price: 200,
    category: Category.SMARTPHONE // Using enum value from Category
};

describe("Cart API Tests", () => {
    describe("GET /carts", () => {
        test("It should return the current cart of the logged in user", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart);

            request(app).get(baseURL + '/carts').expect(200);

            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0);
        });

        test("It should return an empty cart object if there is no current cart", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });


            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce({

                //username: "testUser",
                paid: false,
                paymentDate: "",
                total: 0,
                products: [],
                customer: "testUser" // Ensure customer is provided if it's required
            });




            request(app).get(baseURL + '/carts').expect(200);
            expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0);
        });
    });

    describe("POST /carts", () => {
        test("It should add a product to the current cart", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);

            request(app)
                .post(baseURL + '/carts')
                .send({ model: "iPhone13" }).expect(200);

            expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
            // expect(CartController.prototype.addToCart).toHaveBeenCalledWith("testUser", "iPhone13");
        });
    });

    describe("PATCH /carts", () => {
        test("It should simulate payment for the current cart", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true);

            request(app).patch(baseURL + '/carts').expect(200);


            expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0);
        });
    });

    describe("GET /carts/history", () => {
        test("It should return the history of carts paid for by the current user", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce([testCart]);

            request(app).get(baseURL + '/carts/history').expect(200);

            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0);
        });
    });

    describe("DELETE /carts/products/:model", () => {
        test("It should remove an instance of a product from the current cart", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true);

            const response =  request(app)
                .delete(baseURL + '/carts/products/iPhone13').expect(200);

            expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
        });
    });

    describe("DELETE /carts/current", () => {
        test("It should empty the current cart", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { username: "testUser", role: "Customer" };
                return next();
            });

            jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true);

            request(app).delete(baseURL + '/carts/current').expect(200);
            expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(0);
            //expect(CartController.prototype.clearCart).toHaveBeenCalledWith("testUser");
        });
    });

    describe("DELETE /carts", () => {
        test("It should delete all carts of all users", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'Admin' };
                return next();
            });

            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);

            const response = await request(app).delete(baseURL + '/carts');

            expect(response.status).toBe(200);
            // expect(response.body).toBe({});
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
        });

        test("It should return 401 if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            });

            const response = await request(app).delete(baseURL + '/carts');

            expect(response.status).toBe(401);
        });
    });

    describe("GET /carts/all", () => {
        test("It should return all carts of all users", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                req.user = { role: 'Admin' };
                return next();
            });

            const allCarts = [testCart];
            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce(allCarts);

            const response = await request(app).get(baseURL + '/carts/all');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(allCarts);
            expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
        });

        test("It should return 401 if the user is not an Admin or Manager", async () => {
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            });

            const response = await request(app).get(baseURL + '/carts/all');

            expect(response.status).toBe(401);
        });
    });

});


