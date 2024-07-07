import { Utility } from "../utilities"
import { Role, User } from "../components/user"
import UserDAO from "../dao/userDAO"

/**
 * Represents a controller for managing users.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */

interface user{username: string, name: string, surname: string, role: string, address: string, birthdate: string};
class UserController {
    private dao: UserDAO

    constructor() {
        this.dao = new UserDAO
    }

    /**
     * Creates a new user.
     * @param username - The username of the new user. It must not be null and it must not be already taken.
     * @param name - The name of the new user. It must not be null.
     * @param surname - The surname of the new user. It must not be null.
     * @param password - The password of the new user. It must not be null.
     * @param role - The role of the new user. It must not be null and it can only be one of the three allowed types ("Manager", "Customer", "Admin")
     * @returns A Promise that resolves to true if the user has been created.
     */
    async createUser(username: string, name: string, surname: string, password: string, role: string):Promise<Boolean> {
        return await this.dao.createUser(username, name, surname, password, role)
       
    }

    /**
     * Returns all users.
     * @returns A Promise that resolves to an array of users.
     */
    async getUsers() /**:Promise<User[]> */ { 
        
        const users = await this.dao.getUsers();
        return users;
        
    }

    /**
     * Returns all users with a specific role.
     * @param role - The role of the users to retrieve. It can only be one of the three allowed types ("Manager", "Customer", "Admin")
     * @returns A Promise that resolves to an array of users with the specified role.
     */
    async getUsersByRole(role: string) /**:Promise<User[]> */ {
        return await this.dao.getUserByRole(role);
    }

    /**
     * Returns a specific user.
     * The function has different behavior depending on the role of the user calling it:
     * - Admins can retrieve any user
     * - Other roles can only retrieve their own information
     * @param username - The username of the user to retrieve. The user must exist.
     * @returns A Promise that resolves to the user with the specified username.
     */
    async getUserByname(user:User, username:string):Promise<User> {
        return new Promise<User>(async(resolve,reject)=>{
            try{
                if (Utility.isAdmin(user) || user.username===username){
                    const getUserResult = await this.dao.getUserByUsername(username)
                    if (getUserResult){
                        resolve(getUserResult)
                    }
                }
                else {
                    await this.dao.getUserByUsername("Not Admin")
                }
            }
            catch(error){
                reject(error)
            }
        })
    }
    async getUserByUsername(username: string) /**:Promise<User> */ { 
        const result = await this.dao.getUserByUsername( username);
        return result
    }
    /**
     * Deletes a specific user
     * The function has different behavior depending on the role of the user calling it:
     * - Admins can delete any non-Admin user
     * - Other roles can only delete their own account
     * @param user
     * @param username - The username of the user to delete. The user must exist.
     * @returns A Promise that resolves to true if the user has been deleted.
     */
    async deleteoneUser(user: User, username: string):Promise<Boolean> {
        return new Promise<Boolean>(async(resolve,reject)=>{
            try{
                const deleteResult = await this.dao.deleteoneUser(user,username)
                if (deleteResult){
                    resolve(true)
                }
            }
            catch(error){
                reject(error)
            }
        })
    }
    async deleteUser(username: string) /**:Promise<Boolean> */ { 
        const isok = await this.dao.deleteUser(username);
        return isok;
    }

    /**
     * Deletes all non-Admin users
     * @returns A Promise that resolves to true if all non-Admin users have been deleted.
     */
    async deleteAll() { 
        return await this.dao.deleteAllUsers();
    }

    /**
     * Updates the personal information of one user. The user can only update their own information.
     * @param user The user who wants to update their information
     * @param name The new name of the user
     * @param surname The new surname of the user
     * @param address The new address of the user
     * @param birthdate The new birthdate of the user
     * @param username The username of the user to update. It must be equal to the username of the user parameter.
     * @returns A Promise that resolves to the updated user
     */
    async updateUser(user:User,username: string, name: string, surname: string, address: string, birthdate: string) /**:Promise<User> */ {
    return new Promise<User>(async (resolve, reject) => {
        try{
            let flag = true;
            if(Utility.isAdmin(user)||user.username === username){
                flag = false;
            }
            const updateResult = await this.dao.updateoneUser(user,name,surname,address,birthdate,username,flag)
            if(updateResult)
                resolve(updateResult);
        }catch(err){
            reject(err);
        };
    })
    }
    async updateUserInfo(username: string, name: string, surname: string, address: string, birthdate: string) /**:Promise<User> */ {
        const newuser = new User(username, name, surname, Role.CUSTOMER,address, birthdate);
        return await this.dao.updateUser(username,newuser);
    }
}

export default UserController