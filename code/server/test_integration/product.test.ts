import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from 'supertest';
import { app } from "../index";
import { cleanup } from "../src/db/cleanup";
import { Product, Category } from "../src/components/product";

const routePath = "/ezelectronics";

//Sample products
const testProduct1 = new Product(1200, "MacBook Pro", Category.LAPTOP, "2024-05-30", "High-end laptop", 5);
const testProduct2 = new Product(900, "iPhone 12", Category.SMARTPHONE, "2024-05-21", "Newest model", 8);


// Helper function to add a product
const addProduct = async (product: Product, cookie: string) => {
    await request(app)
        .post(`${routePath}/products`)
        .set("Cookie", cookie)
        .send(product)
        .expect(200);
};

// Helper function to log in a user and return the cookie
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

// Default admin user information
const admin = { username: "admin", name: "admin", surname: "admin", password: "password", role: "Admin" }
let adminCookie: string;

// Cleanup and setup before all tests
beforeAll(async () => {
    await cleanup(); // Ensure the database is cleaned up before tests
    await request(app).post(`${routePath}/users`).send(admin).expect(200); // Create admin user
    adminCookie = await login(admin); // Log in as admin and get the cookie
    await addProduct(testProduct1, adminCookie)
    await addProduct(testProduct2, adminCookie)
});

// Cleanup after all tests
afterAll(async () => {
    await cleanup();
});


describe("Product routes integration tests", () => {
    describe("POST /products", () => {
        test("It should add a new product and return a 200 status code", async () => {
            const newProduct = new Product(600, "Samsung Galaxy", Category.SMARTPHONE, "2024-06-01", "New release", 15);

            await request(app)
                .post(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .send(newProduct)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(3); // Initially 2 products + 1 new product
            expect(products.some((product: any) => product.model === newProduct.model)).toBe(true);
        });
    });

    describe("GET /products", () => {
        test("It should retrieve all products", async () => {
            const response = await request(app)
                .get(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(3); // Initially added 2 products + 1 new added
        });

        test("It should retrieve products by category", async () => {
            const response = await request(app)
                .get(`${routePath}/products?grouping=category&category=Smartphone`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(2); //Two products are Smartphone
            expect(products[0].category).toBe("Smartphone");
        });

        test("It should retrieve products by model", async () => {
            const response = await request(app)
                .get(`${routePath}/products?grouping=model&model=iPhone 12`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(1); // Only one product matches the model
            expect(products[0].model).toBe("iPhone 12");
        });
    });

    describe("PATCH /products/:model", () => {
        test("It should update the quantity of a product", async () => {
            const updatedQuantity = 15;
            const response = await request(app)
                .patch(`${routePath}/products/iPhone 12`)
                .set("Cookie", adminCookie)
                .send({ quantity: updatedQuantity, changeDate: "2024-06-01" })
                .expect(200);

            expect(response.body.totalQuantity).toBe(updatedQuantity + 8);

            const productsResponse = await request(app)
                .get(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);

            const updatedProduct = productsResponse.body.find((product: any) => product.model === "iPhone 12");
            expect(updatedProduct.quantity).toBe(updatedQuantity + 8);
        });
    });

    describe("DELETE /products/:model", () => {
        test("It should delete a product by model", async () => {
            await request(app)
                .delete(`${routePath}/products/iPhone 12`)
                .set("Cookie", adminCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/products`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(2); // Initially 3 products - 1 deleted product
            expect(products.some((product: any) => product.model === "iPhone 12")).toBe(false);
        });
    });

    describe("GET /products/available", () => {
        test("It should retrieve available products (quantity > 0)", async () => {
            const response = await request(app)
                .get(`${routePath}/products/available`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(2); // All initially added products have quantity > 0
        });

        test("It should retrieve available products by category", async () => {
            const response = await request(app)
                .get(`${routePath}/products/available?grouping=category&category=Smartphone`)
                .set("Cookie", adminCookie)
                .expect(200);

            const products = response.body;
            expect(products).toHaveLength(1); // Only one available product in category Smartphone
            expect(products[0].category).toBe("Smartphone");
        });
    });

});
