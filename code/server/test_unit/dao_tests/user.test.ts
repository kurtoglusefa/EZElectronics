import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"
import {open} from 'sqlite'
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { afterEach, beforeEach } from "node:test"
import { Product } from "../../src/components/product"
import { Role, User } from "../../src/components/user"
interface user{username: string, name: string, surname: string, role: string, address: string|null, birthdate: string|null};
jest.mock("crypto")
jest.mock("../../src/db/db.ts")
test("It should resolve true", async () => {
    const userDAO = new UserDAO()
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null)
        return {} as Database
    });
    const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
        return (Buffer.from("salt"))
    })
    const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
        return Buffer.from("hashedPassword")
    })
    const result = await userDAO.createUser("username", "name", "surname", "password", "role")
    expect(result).toBe(true)
    mockRandomBytes.mockRestore()
    mockDBRun.mockRestore()
    mockScrypt.mockRestore()
})

    /////test unit tht get user by username//////////
test("It should resolve A Promise that resolves the information of the requested user", async () => {
    const userDAO = new UserDAO()
    const testUser = { //Define a test user object
        username: "TT" 
    }
    const shouldresult = {username: "TT", name: "TT", surname: "TT", role: Role.ADMIN, address: "NULL", birthdate: "NULL"}
    jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(shouldresult); //Mock the createUser method of the DAO
    const controller = new UserController(); //Create a new instance of the controller
    //Call the createUser method of the controller with the test user object
    const response = await controller.getUserByUsername(testUser.username);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(testUser.username);
    expect(response).toBe(shouldresult); //Check if the response is true
})

/////////test unit that get users//////////
test("It should resolve a list of all users", async () => {
    const userDAO = new UserDAO()
    const shouldresult = [{username: "TT", name: "TT", surname: "TT", role: Role.ADMIN, address: "NULL", birthdate: "NULL"}]
    jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce(shouldresult); 
    const controller = new UserController(); 

    const response = await controller.getUsers()
    expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.getUsers).toHaveBeenCalledWith();
    expect(response).toBe(shouldresult); //Check if the response is true
})
jest.mock('sqlite', () => ({
    open: jest.fn()
}));

type MockDatabase = {
    get: jest.Mock<any>;
    run: jest.Mock<any>;
    all: jest.Mock<any>;
};

describe("UserDAO Tests", () => {
    let userDAO: UserDAO;
    let mockDB: MockDatabase;

    beforeEach(async () => {
        mockDB = {
            get: jest.fn(),
            run: jest.fn(),
            all: jest.fn()
        };

        (open as jest.Mock).mockResolvedValue(mockDB as never);
        userDAO = new UserDAO();
        // await userDAO['initDB']();
        // Call the initDB to set the mocked DB
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should delete all uesers", async () => {
        const userDAO = new UserDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.deleteAllUsers()
        expect(result).toBe(true)
        mockDBRun.mockRestore()
    })
    test("should delete uesers", async () => {
        const userDAO = new UserDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql,params, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.deleteUser('TT')
        expect(result).toBe(true)
        mockDBRun.mockRestore()
    })
    
    test("update a specific uesers", async () => {
        const userDAO = new UserDAO()
        const testUser = {username: "TT", name: "TT", surname: "TT", role: Role.ADMIN, address: "NULL", birthdate: "NULL"}
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql,params, callback) => {
            callback(null)
            return {} as Database
        });
        const result = await userDAO.updateUser('TT',testUser)
        expect(result).toBe(testUser)
        mockDBRun.mockRestore()
    })
})