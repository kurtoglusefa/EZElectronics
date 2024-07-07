import express, { Router } from "express"
import Authenticator from "./auth"
import { body, param,check ,validationResult} from "express-validator"
import { User } from "../components/user"
import ErrorHandler from "../helper"
import UserController from "../controllers/userController"
import dayjs from "dayjs";
import { UserNotFoundError, UserNotManagerError, UserNotCustomerError, UserAlreadyExistsError, UserNotAdminError, UserIsAdminError, UnauthorizedUserError} from "../errors/userError"
import { parse } from "path"
/**
 * Represents a class that defines the routes for handling users.
 */
// const onValidationErrors =(validationResult:any, res:any) => {
//     const errors = validationResult.formatWith(errorFormatter);
//     let error = "The parameters are not formatted properly\n\n"
//     errors.array().forEach((e: any) => {
//         error += "- Parameter: **" + e.param + "** - Reason: *" + e.msg + "* - Location: *" + e.location + "*\n\n"
//     })
//     return res.status(422).json({ error: errors })
// }

// const errorFormatter = ({msg}:any) =>{
//     return msg;
// }
function  validateRequest(req: any, res: any, next: any) {
    const errors =  validationResult(req)
    if (!errors.isEmpty()) {
        let error = "The parameters are not formatted properly\n\n"
        errors.array().forEach((e: any) => {
            error += "- Parameter: **" + e.param + "** - Reason: *" + e.msg + "* - Location: *" + e.location + "*\n\n"
        })
        return { error: error }
    }
    return -1;
}
class UserRoutes {
    private router: Router
    private authService: Authenticator
    private errorHandler: ErrorHandler
    private controller: UserController
    private UserNotFoundError : UserNotFoundError
    private UserNotManagerError: UserNotManagerError
    private UserNotCustomerError: UserNotCustomerError
    private UserAlreadyExistsError: UserAlreadyExistsError
    private UserNotAdminError : UserNotAdminError
    private UserIsAdminError : UserIsAdminError
    private UnauthorizedUserError : UnauthorizedUserError

    

    /**
     * Constructs a new instance of the UserRoutes class.
     * @param authenticator The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.router = express.Router()
        this.errorHandler = new ErrorHandler()
        this.controller = new UserController()
        this.initRoutes()
        this.UserNotFoundError = new UserNotFoundError()
        this.UserNotManagerError= new UserNotManagerError()
        this.UserNotCustomerError= new UserNotCustomerError()
        this.UserAlreadyExistsError= new UserAlreadyExistsError()
        this.UserNotAdminError =new UserNotAdminError()
        this.UserIsAdminError = new UserIsAdminError()
        this.UnauthorizedUserError = new UnauthorizedUserError()
    }

    /**
     * Get the router instance.
     * @returns The router instance.
     */
    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the routes for the user router.
     * 
     * @remarks
     * This method sets up the HTTP routes for creating, retrieving, updating, and deleting user data.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {

        /**
         * Route for creating a user.
         * It does not require authentication.
         * It requires the following body parameters:
         * - username: string. It cannot be empty and it must be unique (an existing username cannot be used to create a new user)
         * - name: string. It cannot be empty.
         * - surname: string. It cannot be empty.
         * - password: string. It cannot be empty.
         * - role: string (one of "Manager", "Customer", "Admin")
         * It returns a 200 status code.
         */
        this.router.post(
            "/",
            [
                check('username').isString().notEmpty(),
                check('name').isString().notEmpty(),
                check('surname').isString().notEmpty(),
                check('password').isLength({min: 4, max: 15}).notEmpty(),
                check('role').isString().isIn(["Customer","Admin","Manager"]).notEmpty(),
                check('address').optional({nullable: true}).isString(),
                check('birthdate').optional({nullable: true}).isISO8601({strict: true}).toDate(),
            ],
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) =>{ 
                try{
                    const result =  await this.controller.createUser(req.body.username, req.body.name, req.body.surname, req.body.password ,req.body.role);
                    return res.json(result);
                }catch(err){
                    return res.status(this.UserAlreadyExistsError.customCode).json({error: `Database error: ${err} ${this.UserAlreadyExistsError.customMessage}`});
                }
            }
        )

        /**
         * Route for retrieving all users.
         * It requires the user to be logged in and to be an admin.
         * It returns an array of users.
         */
        this.router.get(
            "/",
            this.authService.isAdmin,
            async (req: any, res: any, next: any) => {try{
                    return this.controller.getUsers().then((users: any) => {console.log(users); res.status(200).json(users)}).catch((err)=>next(err));
                }catch(err){
                    return res.status(404).json({error: `Database error: ${err} unknown`});
                }
        }
        )

        /**
         * Route for retrieving all users of a specific role.
         * It requires the user to be logged in and to be an admin.
         * It expects the role of the users in the request parameters: the role must be one of ("Manager", "Customer", "Admin").
         * It returns an array of users.
         */
        this.router.get(
            "/roles/:role",
            this.authService.isAdmin,
            async (req: any, res: any, next: any) =>{try{


                    if(req.params.role == "Customer" || req.params.role == "Manager" || req.params.role == "Admin"){
                        const result = await this.controller.getUsersByRole(req.params.role);
                        if(result==null) {
                            return res.status(422).json(result);
                        }else{
                            return res.json(result);
                        }
                    }else{
                        res.status(422).json("The role must be Customer or Manager or Admin")
                    }
                }catch(err){
                return res.status(404)
            }
        }
        )

        /**
         * Route for retrieving a user by its username.
         * It requires the user to be authenticated: users with an Admin role can retrieve data of any user, users with a different role can only retrieve their own data.
         * It expects the username of the user in the request parameters: the username must represent an existing user.
         * It returns the user.
         */
        this.router.get(
            "/:username",
            this.authService.isLoggedIn,
            param("username").isString().notEmpty(),
            this.errorHandler.validateRequest,
            async (req: any, res: any, next: any) =>{try{  
                this.controller.getUserByname(req.user,req.params.username)
                            .then((user:any)=> res.status(200).json(user))
                            .catch((err)=>{next(err);});
                }catch(err){
                    return res.status(404)
            }
        }
        )

        /**
         * Route for deleting a user.
         * It requires the user to be authenticated: users with an Admin role can delete the data of any user (except other Admins), users with a different role can only delete their own data.
         * It expects the username of the user in the request parameters: the username must represent an existing user.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/:username",
            this.authService.isLoggedIn,
            (req: any, res: any, next: any) => {
                this.controller.deleteoneUser(req.user, req.params.username)
                            .then(()=>{res.status(200).end()})
                            .catch((err:any) => {next(err)});

            
        }
        
        )

        /**
         * Route for deleting all users.
         * It requires the user to be logged in and to be an admin.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/",
            this.authService.isAdmin,
            async(req: any, res: any, next: any) => {
                try{
                    await this.controller.deleteAll();
                    res.status(200).end();
                }catch(err){
                    return res.status(404);
                }
            }
        )

        /**
         * Route for updating the information of a user.
         * It requires the user to be authenticated.
         * It expects the username of the user to edit in the request parameters: if the user is not an Admin, the username must match the username of the logged in user. Admin users can edit other non-Admin users.
         * It requires the following body parameters:
         * - name: string. It cannot be empty.
         * - surname: string. It cannot be empty.
         * - address: string. It cannot be empty.
         * - birthdate: date. It cannot be empty, it must be a valid date in format YYYY-MM-DD, and it cannot be after the current date
         * It returns the updated user.
         */
        this.router.patch(
            "/:username",
            this.authService.isLoggedIn,
            [   
                param('username').isString().notEmpty(),
                check('name').isString().notEmpty(),
                check('surname').isString().notEmpty(),
                check('address').isString().notEmpty(),
                check('birthdate').isString().notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).custom((value)=>{
                        const date = new Date(value);
                        const [year, month, day] = value.split('-');
                        if(date.getFullYear() !== parseInt(year) ||
                        date.getMonth() + 1 !== parseInt(month) ||
                        date.getDate() !== parseInt(day)){
                            throw new Error('Error Date');
                        }
                        return true;

                    }
                )
            ],
            this.errorHandler.validateRequest,
            (req: any, res: any, next: any) => {
                
            try{
            this.controller.updateUser(req.user,req.params.username, req.body.name, req.body.surname, req.body.address, req.body.birthdate)
                            .then((user: any)=> {user.birthdate = dayjs(user.birthdate).format("YYYY-MM-DD");res.status(200).json(user)})
                            .catch((err:any)=> next(err));

            }catch(err){
                return res.status(404);
            }
        }
        )

    }
}

/**
 * Represents a class that defines the authentication routes for the application.
 */
class AuthRoutes {
    private router: Router
    private errorHandler: ErrorHandler
    private authService: Authenticator

    /**
     * Constructs a new instance of the UserRoutes class.
     * @param authenticator - The authenticator object used for authentication.
     */
    constructor(authenticator: Authenticator) {
        this.authService = authenticator
        this.errorHandler = new ErrorHandler()
        this.router = express.Router();
        this.initRoutes();
    }

    getRouter(): Router {
        return this.router
    }

    /**
     * Initializes the authentication routes.
     * 
     * @remarks
     * This method sets up the HTTP routes for login, logout, and retrieval of the logged in user.
     * It can (and should!) apply authentication, authorization, and validation middlewares to protect the routes.
     */
    initRoutes() {

        /**
         * Route for logging in a user.
         * It does not require authentication.
         * It expects the following parameters:
         * - username: string. It cannot be empty.
         * - password: string. It cannot be empty.
         * It returns an error if the username represents a non-existing user or if the password is incorrect.
         * It returns the logged in user.
         */
        this.router.post(
            "/",
            (req:any, res: any, next:any) => this.authService.login(req, res, next)
                .then((user: User) => res.status(200).json(user))
                .catch((err: any) => { res.status(401).json(err) })
        )

        /**
         * Route for logging out the currently logged in user.
         * It expects the user to be logged in.
         * It returns a 200 status code.
         */
        this.router.delete(
            "/current",
            this.authService.isLoggedIn,
            (req:any, res:any, next:any) => this.authService.logout(req, res, next)
                .then(() => res.status(200).end())
                .catch((err: any) => next(err))
        )

        /**
         * Route for retrieving the currently logged in user.
         * It expects the user to be logged in.
         * It returns the logged in user.
         */
        this.router.get(
            "/current",
            this.authService.isLoggedIn,
            (req: any, res: any) => {console.log(req.body.username);res.status(200).json(req.user)}
        )
    }
}

export { UserRoutes, AuthRoutes }