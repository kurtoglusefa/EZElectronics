import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { Role, User } from "../../src/components/user"
import UserController from "../../src/controllers/userController"
import Authenticator from "../../src/routers/auth"
import { error } from "console"
import { describe } from "node:test"
import { Product } from "../../src/components/product"
import { param } from "express-validator"
import ErrorHandler from "../../src/helper"
const baseURL = "/ezelectronics"

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters

jest.mock("../../src/controllers/userController")
jest.mock("../../src/routers/auth")

let testAdmin = new User("admin", "admin", "admin", Role.ADMIN, "", "")
let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")


test("It should return a 200 success code", async () => {
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "testtest",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})


describe("Route unit tests", ()=>{
    describe("GET /users", ()=>{
        test("It returns an array of users", async ()=>{
            jest.spyOn(UserController.prototype,"getUsers").mockResolvedValueOnce([testAdmin, testCustomer])
            jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
                return next();
            })
            const response = await request(app).get(baseURL+"/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1)
        })

        test("It returns an array of users with a specific role", async () => {
            jest.spyOn(UserController.prototype,"getUsersByRole").mockResolvedValueOnce([testAdmin])
            jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
                return next();
            })
            jest.mock('express-validator', ()=>({
                param: jest.fn().mockImplementation(()=>({
                    isString: ( )=> ({ isLength: ({})}),
                    isIn: ()=> ({ isLength: () => ({}) }),
                })),
            }))
            const response = await request(app).get(baseURL+"/users/roles/Admin")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1)
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith("Admin")
        })
        test("It should fail if the role is not valid", async () => {
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req,res,next)=>{
                return next();
            })
            jest.mock('express-validator',()=>(()=>{
                throw new Error("Invalid value");
            }))
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next)=>{
                return res.status(422).json({error: "The parameters are not formatted properly\r\n"});
            })
            const response = await request(app).get(baseURL + "/users/roles/Invalid")
            expect(response.status).toBe(422)
        })
        test("It should fail if the role is not admin", async () => {
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req,res,next)=>{
                return next();
            })
            jest.mock('express-validator',()=>(()=>{
                throw new Error("Invalid value");
            }))
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next)=>{
                return res.status(422).json({error: "The parameters are not formatted properly\r\n"});
            })
            const response = await request(app).get(baseURL + "/users/roles/Admin")
            expect(response.status).toBe(422)
        })
        test("It return true if delete all users", async () => {
            jest.spyOn(UserController.prototype,"deleteAll").mockResolvedValueOnce(true)
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req,res,next)=>{
                return next();
            })
            jest.mock('express-validator', ()=>({
                param: jest.fn().mockImplementation(()=>({
                    isString: ( )=> ({ isLength: ({})}),
                    isIn: ()=> ({ isLength: () => ({}) }),
                })),
            }))
            const response = await request(app).delete(baseURL + "/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteAll).toHaveBeenCalledTimes(1)
        })


        // test("It delete a specific users", async () => {
        //     jest.spyOn(UserController.prototype,"deleteUser").mockResolvedValueOnce(true)
        //     jest.spyOn(UserController.prototype,"getUserByUsername").mockResolvedValueOnce(testCustomer)
        //     jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
        //         return next();
        //     })
        //     jest.mock('express-validator', ()=>({
        //         param: jest.fn().mockImplementation(()=>({
        //             isString: ( )=> ({ isLength: ({})}),
        //             isIn: ()=> ({ isLength: () => ({}) }),
        //         })),
        //     }))
        //     const response = await request(app).delete(baseURL+"/users/Customer")
        //     expect(response.status).toBe(200)
        // })


        // test("It return  a specific users", async () => {
        //     jest.spyOn(UserController.prototype,"getUserByUsername").mockResolvedValueOnce(testAdmin)
        //     jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
        //         return next();
        //     })
        //     jest.mock('express-validator', ()=>({
        //         param: jest.fn().mockImplementation(()=>({
        //             isString: ( )=> ({ isLength: ({})}),
        //             isIn: ()=> ({ isLength: () => ({}) }),
        //         })),
        //     }))
        //     const response = await request(app).get(baseURL+"/users/Admin")
        //     expect(response.status).toBe(200)
        // })

        // test("It return 422 if it is a  wrong updated user information", async () => {
        //     const testUser = { //Define a test user object sent to the route
        //         username: "test",
        //         name: "test",
        //         surname: "test",
        //         password: "testtest",
        //         role: "Manager"
        //     }
        //     jest.spyOn(UserController.prototype,"updateUserInfo").mockResolvedValueOnce(testAdmin)
        //     jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
        //         return next();
        //     })
        //     jest.mock('express-validator', ()=>({
        //         param: jest.fn().mockImplementation(()=>({
        //             isString: ( )=> ({ isLength: ({})}),
        //             isIn: ()=> ({ isLength: () => ({}) }),
        //         })),
        //     }))
        //     const response = await request(app).patch(baseURL+"/users/admin").send(testUser);
        //     expect(response.status).toBe(422)
        // })
        // test("It return  404 if  updated user information not found ", async () => {
        //     const testUser = { //Define a test user object sent to the route
        //         username: "test",
        //         surname: "test",
        //         name: "test",
        //         role: "Admin",
        //         address: "sdasdas",
        //         birthdate: "2000-01-01"
        //     }

        //     //jest.spyOn(UserController.prototype,"getUserByUsername").mockResolvedValueOnce(testCustomer)
        //     jest.spyOn(UserController.prototype,"updateUserInfo").mockResolvedValueOnce(testAdmin)
        //     jest.spyOn(Authenticator.prototype,"isAdmin").mockImplementation((req, res, next) =>{
        //         return next();
        //     })
        //     jest.mock('express-validator', ()=>({
        //         param: jest.fn().mockImplementation(()=>({
        //             isString: ( )=> ({ isLength: ({})}),
        //             isIn: ()=> ({ isLength: () => ({}) }),
        //         })),
        //     }))
        //     const response = await request(app).patch(baseURL+"/users/admin").send(testUser);
        //     expect(response.status).toBe(404)
        // })
    })

})

