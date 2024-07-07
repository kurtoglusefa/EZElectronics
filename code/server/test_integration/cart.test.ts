import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from 'supertest';
import { app } from '../index'; 
import { cleanup } from '../src/db/cleanup';
import { Cart } from '../src/components/cart';
import { Category, Product } from "../src/components/product";

const routePath = '/ezelectronics';

// Sample products
const testProduct1 = new Product(1200, "MacBook Air", Category.LAPTOP, "2024-05-30", "High-end laptop", 5);
const testProduct2 = new Product(900, "iPhone 13", Category.SMARTPHONE, "2024-05-21", "Newest model", 8);

// Default admin user information
const admin = { username: "admin", name: "admin", surname: "admin", password: "password", role: "Admin" };
let adminCookie: string;

// Default customer user information
const customer = { username: "customer", name: "customer", surname: "customer", password: "password", role: "Customer" };
let customerCookie: string;

// Helper function to log in a user and return the cookie
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.header["set-cookie"][0]);
            });
    });
};

// Cleanup and setup before all tests
beforeAll(async () => {
    await cleanup(); // Ensure the database is cleaned up before tests
    await request(app).post(`${routePath}/users`).send(customer).expect(200); // Create customer user
    customerCookie = await login(customer); // Log in as customer and get the cookie
    await request(app).post(`${routePath}/users`).send(admin).expect(200); // Create admin user
    adminCookie = await login(admin); // Log in as admin and get the cookie

    // Add initial products
    await request(app).post(`${routePath}/products`).set("Cookie", adminCookie).send(testProduct1).expect(200);
    await request(app).post(`${routePath}/products`).set("Cookie", adminCookie).send(testProduct2).expect(200);
});

// Cleanup after all tests
afterAll(async () => {
    await cleanup();
});

describe('Cart routes integration tests', () => {
    describe('POST /ezelectronics/carts', () => {
        test('It should add a product to the cart', async () => {
            const newProduct = {
                model: 'iPad Pro',
                category: Category.APPLIANCE,
                arrivalDate: "2024-06-01",
                sellingPrice: 800,
                quantity: 10,
                details: "High-end tablet"
            };

            await request(app).post(`${routePath}/products`).set("Cookie", adminCookie).send(newProduct).expect(200);

            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: newProduct.model })
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.products).toHaveLength(1);
            expect(userCart.products.some((p) => p.model === newProduct.model)).toBe(true);
        });

        test('It should return a 404 error if the product model does not exist', async () => {
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: 'NonExistingProduct' })
                .expect(404);
        });
    });

    describe('GET /ezelectronics/carts', () => {
        test('It should retrieve current cart for logged in user', async () => {
            // Ensure a product is in the cart
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: testProduct1.model })
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.customer).toBe(customer.username);
            expect(userCart.products).toHaveLength(2);
        });

        test('It should return an empty cart if no unpaid cart exists', async () => {
            await request(app)
                .delete(`${routePath}/carts/current`)
                .set('Cookie', customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.customer).toBe(customer.username);
            expect(userCart.products).toHaveLength(0);
        });
    });

    describe('PATCH /ezelectronics/carts', () => {
        test('It should checkout the cart', async () => {
            // Add a product to the cart before checking out
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: testProduct1.model })
                .expect(200);

            await request(app)
                .patch(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.paid).toBe(false);
            expect(userCart.paymentDate).not.toBeNull();
        });

    });

    describe('GET /ezelectronics/carts/history', () => {
        test('It should retrieve cart history for logged in user', async () => {
            // Add a product to the cart and checkout
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: testProduct1.model })
                .expect(200);

            await request(app)
                .patch(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts/history`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userHistory: Cart[] = response.body;
            expect(userHistory).toHaveLength(2);
            expect(userHistory[0].paid).toBe(true);
        });
    });

    describe('DELETE /ezelectronics/carts/products/:model', () => {
        test('It should remove a product from the cart', async () => {
            // Add a product to the cart
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: testProduct1.model })
                .expect(200);

            await request(app)
                .delete(`${routePath}/carts/products/${testProduct1.model}`)
                .set('Cookie', customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.products.some((p) => p.model === testProduct1.model)).toBe(false);
        });

        test('It should return a 404 error if the product is not in the cart', async () => {
            await request(app)
                .delete(`${routePath}/carts/products/NonExistingProduct`)
                .set('Cookie', customerCookie)
                .expect(404);
        });
    });

    describe('DELETE /ezelectronics/carts/current', () => {
        test('It should clear the current cart', async () => {
            // Add a product to the cart
            await request(app)
                .post(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .send({ model: testProduct1.model })
                .expect(200);

            await request(app)
                .delete(`${routePath}/carts/current`)
                .set('Cookie', customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/carts`)
                .set('Cookie', customerCookie)
                .expect(200);

            const userCart: Cart = response.body;
            expect(userCart.products).toHaveLength(0);
        });
    });
});
