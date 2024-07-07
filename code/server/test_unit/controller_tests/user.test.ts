import { test, describe, expect, jest, beforeEach } from "@jest/globals";
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { Role, User } from "../../src/components/user"
import { DateError } from "../../src/utilities";
jest.mock("../../src/dao/userDAO")
jest.mock("../../src/db/db.ts")
//Example of a unit test for the createUser method of the UserController
//The test checks if the method returns true when the DAO method returns true
//The test also expects the DAO method to be called once with the correct parameters

test("It should return true", async () => {
    const testUser = { //Define a test user object
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
    const controller = new UserController(); //Create a new instance of the controller
    //Call the createUser method of the controller with the test user object
    const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role);
        
    expect(response).toBe(true); //Check if the response is true
});


////////////get User by username/////////////
test("It should return Class", async () => {
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
});
///////////////get all users////////////////
test("It should return all users Class", async () => {
    // const testUser = { //Define a test user object
    //     username: "TT"
    // }
    const shouldresult = [{username: "TT", name: "TT", surname: "TT", role: Role.ADMIN, address: "NULL", birthdate: "NULL"}]
    jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce(shouldresult); //Mock the createUser method of the DAO
    const controller = new UserController(); //Create a new instance of the controller
    //Call the createUser method of the controller with the test user object
    const response = await controller.getUsers();

    //Check if the createUser method of the DAO has been called once with the correct parameters
    expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
    expect(UserDAO.prototype.getUsers).toHaveBeenCalledWith();
    expect(response).toBe(shouldresult); //Check if the response is true
});
/////////////get sepecifc role
// test("It should return all users Class", async () => {
//     const testUser = { //Define a test user object
//         role: Role.ADMIN
//     }
//     const shouldresult = [{username: "TT", name: "TT", surname: "TT", role: Role.ADMIN, address: "NULL", birthdate: "NULL"}]
//     jest.spyOn(UserDAO.prototype, "getUserByRole").mockResolvedValueOnce(shouldresult); //Mock the createUser method of the DAO
//     const controller = new UserController(); //Create a new instance of the controller
//     //Call the createUser method of the controller with the test user object
//     const response = await controller.getUsersByRole(testUser.role);

//     //Check if the createUser method of the DAO has been called once with the correct parameters
//     expect(UserDAO.prototype.getUserByRole).toHaveBeenCalledTimes(1);
//     expect(UserDAO.prototype.getUserByRole).toHaveBeenCalledWith();
//     expect(response).toBe(shouldresult); //Check if the response is true
// });
//////delete all users////////
// test("It should delete a specific users", async () => {
//     // const testUser = { //Define a test user object
//     //     username: "test",
//     //     name: "test",
//     //     surname: "test",
//     //     password: "test",
//     //     role: "Manager"
//     // }
//     jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
//     const controller = new UserController(); //Create a new instance of the controller
//     //Call the createUser method of the controller with the test user object
//     const response = await controller.deleteUser('TT');
//     //Check if the createUser method of the DAO has been called once with the correct parameters
//     expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
//     expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith();
//     expect(response).toBe(true); //Check if the response is true
// });
// describe("ProductController Tests", () => {
//     let controller: UserController;

//     beforeEach(() => {
//         controller = new UserController();
//     })
//     test("deleteAllUsers should call deleteAllUsers of UserDAO", async () => {
//         jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);

//         const result = await controller.deleteUser('TT');

//         expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
//         expect(result).toBe(true);
//     })

// });
