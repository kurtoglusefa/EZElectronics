
import db from "../src/db/db"
import { User, Role } from "../src/components/user"
import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from 'supertest';
import { app } from "../index";
import { cleanup } from "../src/db/cleanup";
import { response } from "express";


const routePath = "/ezelectronics";

const admin = {username: "admin", name: "admin", surname: "admin", password: "adminadmin", role: "Admin"}
const admin_login = {
    username: "admin",
    password: "adminadmin"
}
const customer = {username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer"}
const manager = {username: "manager", name: "manager", surname: "manager", password: "managermanager", role: "Manager"}

const addUser = async (user: {username: string, name: string, surname: string, password: string, role: string|Role}) =>{
    await request(app)
        .post(`${routePath}/users`)
        .send(user)
        .expect(200);
}

const login = async (userInfo: {username: string, password: string}) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send(userInfo)
            .expect(200)
            .end(((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            }))
    })
}
let adminCookie: string;
let customerCookie: string;
let managerCookie: string;

// Cleanup and setup before all tests
beforeAll(async () => {
    //await cleanup(); // Ensure the database is cleaned up before tests
    await addUser(admin);// register admin
    await addUser(customer);// register customer
    await addUser(manager);//register manager

    adminCookie = await login(admin); // Log in as admin
    customerCookie = await login(customer);//ogin in as customer
    managerCookie = await login(manager);// login in as manager 
});

// Cleanup after all tests
afterAll(async () => {
    await cleanup();
});

describe("User routes integration tests", ()=> {
    describe("POST users/", ()=>{
        test("It should return a wrong info if password not reach needed", async () => {
            const adminTest = {username: "admin", name: "admin", surname: "admin", password: "123", role: "Admin"}
            const response =     await request(app)
            .post(`${routePath}/users`)
            .send(adminTest)
            .expect(422);
        })
    })
    describe("GET /users", ()=>{
        test("It should retrieve all users olny by admin but others return 401", async () => {
            const response= await request(app)
                            .get(`${routePath}/users`)
                            .set("Cookie", adminCookie)
                            .expect(200);
            const response_customer = await await request(app)
                                .get(`${routePath}/users`)
                                .set("Cookie", customerCookie)
                                .expect(401);
            const response_manager = await await request(app)
                                .get(`${routePath}/users`)
                                .set("Cookie", managerCookie)
                                .expect(401);                    
            const users = response.body;
            expect(users).toHaveLength(3);
        })
    })

    describe("GET users/username",()=>{
        test("It should retrieve a certain name by admin", async () => {
            const testUser = "customer"
            const response= await request(app)
                            .get(`${routePath}/users/${testUser}`)
                            .set("Cookie", adminCookie)
                            .expect(200)
            const user = response.body;
            expect(user.username).toBe("customer");
        })
    })
    describe("GET users/roles/:role",()=>{
        test("It should return a certain role by admin", async () => {
            const testRole0 = "Admin";
            const testRole1 = "Customer";
            const testRole2 = "Manager";
            const response_0 = await request(app).get(`${routePath}/users/roles/${testRole0}`)
                                    .set("Cookie", adminCookie)
                                    .expect(200);
            const response_1 = await request(app).get(`${routePath}/users/roles/${testRole1}`)
                                    .set("Cookie", adminCookie)
                                    .expect(200);
            const response_2 = await request(app).get(`${routePath}/users/roles/${testRole2}`)
                                    .set("Cookie", adminCookie)
                                    .expect(200);
            const user1 = response_0.body;
            const user2 = response_1.body;
            const user3 = response_2.body;
            expect(user1[0].role).toBe("Admin")
            expect(user2).toHaveLength(1)
            expect(user3).toHaveLength(1)
        })
        test("it will return a 422 because the role wrong format",async () =>{
            const testRole0 = "Accdmin";
            const response_0 = await request(app).get(`${routePath}/users/roles/${testRole0}`)
                                    .set("Cookie", adminCookie)
                                    .expect(422);
        })
    })


    describe("PATCH/users/:username",()=>{

        test("It will change information of a user", async ()=>{
            const testusername = "admin";
            const testinfo = new User('admin', 'test', 'test', Role.ADMIN, 'anywhere', '2022-10-10');
            const response = await request(app).patch(`${routePath}/users/${testusername}`).set("Cookie", adminCookie).send(testinfo).expect(200)
            const user = response.body;
            expect(user.address).toBe('anywhere')
        })

        test("It will return a wrong information if not admin and try to change other one", async ()=>{
            const testusername = "admin";
            const testinfo = new User('admin', 'test', 'test', Role.ADMIN, 'anywhere', '2022-10-10');
            const response = await request(app).patch(`${routePath}/users/${testusername}`).set("Cookie", managerCookie).send(testinfo).expect(401)
        })

    })

    describe("GET /sessions/current",  ()=>{
        test("It will return 200 to the cuurent session",async()=>{
            const respomse = request(app).get(`${routePath}/sessions`).set("Cookie", managerCookie).expect(200)
        })
    })
    describe("DELETE /sessions/current",  ()=>{
        test("It will delete the cuurent session",async()=>{
            const respomse = request(app).delete(`${routePath}/sessions`).set("Cookie", managerCookie).expect(200)
        })
    })

    describe("DELETE /users/", () =>{

        test("it will delete all users execpt Admin",async ()=>{
            await request(app).delete(`${routePath}/users`).set("Cookie", adminCookie).expect(200);
        })
    })

    describe("DELETE /users/:username", () =>{
        test("it will delete a users execpt Admin",async ()=>{
            const testusername = "admin";
            await request(app).delete(`${routePath}/users/${testusername}`).set("Cookie", adminCookie).expect(200);
        })
    })
})
