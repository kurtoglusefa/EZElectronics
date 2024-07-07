import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from 'supertest';
import { app } from "../index";
import { cleanup } from "../src/db/cleanup";
import { ProductReview } from "../src/components/review";
import { Product, Category } from "../src/components/product";

const routePath = "/ezelectronics";

// Sample reviews
const testReview1 = new ProductReview("iPhone 12", "user1", 4, "2024-06-01", "Great phone");
const testReview2 = new ProductReview("MacBook Pro", "user2", 5, "2024-06-02", "Excellent laptop");


//Sample products
const testProduct1 = new Product(1200, "MacBook Pro", Category.LAPTOP, "2024-05-30", "High-end laptop", 5);
const testProduct2 = new Product(900, "iPhone 12", Category.SMARTPHONE, "2024-05-21", "Newest model", 8);

// Default admin user information
const admin = { username: "admin", name: "admin", surname: "admin", password: "password", role: "Admin" }
let adminCookie: string;

//Default customer user information
const customer = { username: "customer", name: "customer", surname: "customer", password: "password", role: "Customer" }
let customerCookie: string;


//Helper function to add a product
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

// Cleanup and setup before all tests
beforeAll(async () => {
    await cleanup(); // Ensure the database is cleaned up before tests
    await request(app).post(`${routePath}/users`).send(customer).expect(200); // Create customer user
    customerCookie = await login(customer); // Log in as admin and get the cookie
    await request(app).post(`${routePath}/users`).send(admin).expect(200); // Create customer user
    adminCookie = await login(admin); // Log in as admin and get the cookie
    //Add to products that will be used for reviews
    await addProduct(testProduct1, adminCookie)
    await addProduct(testProduct2, adminCookie)
});

// Cleanup after all tests
afterAll(async () => {
    await cleanup();
});

describe("Review routes integration tests", () => {
    describe("POST /reviews", () => {
        test("It should add a new review and return a 200 status code", async () => {
            const newReview = new ProductReview("iPhone 12", "customer", 4, "", "Solid performance");


            await request(app)
                .post(`${routePath}/reviews/${newReview.model}`)
                .set("Cookie", customerCookie)
                .send(newReview)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/reviews/${newReview.model}`)
                .set("Cookie", customerCookie)
                .expect(200);

            const reviews = response.body;
            expect(reviews).toHaveLength(1);
            expect(reviews[0].user).toBe(newReview.user);
        });

        test("It should return a 409 error if the user tries to review the same product again", async () => {
          
            await request(app).post(`${routePath}/reviews/iPhone 12`).set("Cookie", customerCookie).send({model: "iPhone 12", user:"customer", score: 4, date:"", comment: "Solid performance"   }).expect(409)
            
        });
    });

    describe("GET /reviews/:model", () => {
        test("It should retrieve all reviews for a product model", async () => {
            await request(app)
                .post(`${routePath}/reviews/${testReview2.model}`)
                .set("Cookie", customerCookie)
                .send(testReview2)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/reviews/${testReview2.model}`)
                .set("Cookie", customerCookie)
                .expect(200);

            const reviews = response.body;
            expect(reviews).toHaveLength(1);
            expect(reviews[0].model).toBe(testReview2.model);
        });

    });

    describe("DELETE /reviews/:model", () => {
        test("It should delete a review by product model and user", async () => {
            
            await request(app)
                .delete(`${routePath}/reviews/${testReview1.model}`)
                .set("Cookie", customerCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/reviews/${testReview1.model}`)
                .set("Cookie", customerCookie)
                .expect(200);

            const reviews = response.body;
            expect(reviews).toHaveLength(0);
        });

        test("It should return a 404 error if the review to delete does not exist", async () => {
            try {
                await request(app)
                    .delete(`${routePath}/reviews/NonExistingModel/${testReview1.user}`)
                    .set("Cookie", customerCookie)
                    .expect(404);
            } catch (error) {
                expect(error.response.body.message).toBe("Review not found");
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe("DELETE /reviews/:model", () => {
        test("It should delete all reviews for a product model", async () => {
            await request(app)
                .delete(`${routePath}/reviews/${testReview2.model}/all`)
                .set("Cookie", adminCookie)
                .expect(200);

            const response = await request(app)
                .get(`${routePath}/reviews/${testReview2.model}`)
                .set("Cookie", customerCookie)
                .expect(200);

            const reviews = response.body;
            expect(reviews).toHaveLength(0);
        });

        test("It should return a 404 error if there are no reviews to delete for a product model", async () => {
            try {
                await request(app)
                    .delete(`${routePath}/reviews/NonExistingModel`)
                    .set("Cookie", customerCookie)
                    .expect(404);
            } catch (error) {
                expect(error.response.body.message).toBe("No reviews found for this product");
                expect(error.response.status).toBe(404);
            }
        });
    });
});
