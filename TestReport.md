# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

     <report the here the dependency graph of EzElectronics>
     [!(https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/blob/main/Dependency_Graph.png?ref_type=heads)](#)
  
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>

    In our integration process, we adopted a bottom-up approach, so we tested each unit starting from the bottom before integrating them so first all DAO classes, then controllers, then routes and finally we did integration testing to see if multiple parts of application could work together.

    Step 1: DAO Testing
    We started by testing the DAOs for each class to ensure that the basic data manipulation operations (CRUD operations) function correctly.
    Classes Tested:
    UserDAO 
    ProductDAO
    CartDAO
    ReviewDAO
    All DAO functions were tested in this step.

    Step 2: Controller Testing
    After ensuring the DAOs are working correctly, we tested the controllers to check if they correctly manage the business logic and interact with the DAOs.
    Classes Tested:
    UserController
    ProductController
    CartController
    ReviewController

    Step 3: Route Testing
    With the DAOs and controllers validated, we moved on to testing the routes. This step involved checking if each route correctly calls its controller and handles the HTTP requests as expected.
    Routes Tested:
    UserRoutes
    ProductRoutes
    CartRoutes
    ReviewRoutes

    Step 4: Integration Testing
    Finally, we did integration testing for each class on routes. 
    
# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

|          Test case name                     |   Object(s) tested    | Test level  |         Technique used          |
|:-----------------------------------------:  |:--------------------: |:-----------:|:-------------------------------:|
| TestUserDAOCreateUser                       |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestUserDAOGetUserByUsername                |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestUserDAOGetUsers                         |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestUserDAODeleteAllUsers                   |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestUserDAODeleteUser                       |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestUserDAOUpdateUser                       |       UserDAO         |    Unit     |   WB/statement coverage         |
| TestProductDAOAddProduct                    |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestsProductDAOAddProductErrors             |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAOChangeProductQuantity         |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAOChangeProductQuantityErrors   |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAOSellProduct                   |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestsProductDAOSellProductErrors            |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAOGetProducts                   |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestsProductDAOGetProductsErrors            |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAOGetAvailableProducts          |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestsProductDAOGetAvailableProductsErrors   |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestProductDAODeletes                       |     ProductDAO        |    Unit     |   WB/statement coverage         |
| TestCartDAOAddProductToCart                 |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestCartDAOUpdateQuantityOfProduct          |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestCartDAORemoveProductFromCart            |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestCartDAORemoveProductFromCartErrors      |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestCartDAOCheckoutCart                     |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestCartDAOGetCurrentCart                   |      CartDAO          |    Unit     |   WB/statement coverage         |
| TestReviewDAOAddReview                      |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestsReviewDAOAddReviewErrors               |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestReviewDAOGetReviewsByProduct            |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestReviewDAODeleteReview                   |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestReviewDAODeleteAllReviewsOfProduct      |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestReviewDAODeleteAllReviews               |      ReviewDAO        |    Unit     |   WB/statement coverage         |
| TestUserControllerCreateUser                |     UserController    |    Unit     |   BB/equivalence partitioning   |
| TestUserControllerGetAllUsers               |     UserController    |    Unit     |   BB/equivalence partitioning   |
| TestProductControllerAddProduct             |     ProductController |    Unit     |   BB/equivalence partitioning   |
| TestProductControllerChangeProductQuantity  |     ProductController |    Unit     |   BB/equivalence partitioning   |
| TestProductControllerSellProduct            |     ProductController |    Unit     |   BB/equivalence partitioning   |
| TestProductControllerGetProducts            |     ProductController |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerAddProductToCart          |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerAddProductToCartErrors    |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerCheckoutCart              |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerGetPaidCarts              |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerEmptyCart                 |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerGetAllCarts               |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestCartControllerDeleteAllCarts            |     CartController    |    Unit     |   BB/equivalence partitioning   |
| TestReviewControllerAddReview               |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestsReviewControllerReviewErrors           |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestReviewControllerGetReviewsByProduct     |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestReviewControllerDeleteReview            |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestReviewControllerDeleteAllReviewsOfProd  |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestReviewControllerDeleteAllReviews        |     ReviewController  |    Unit     |   BB/equivalence partitioning   |
| TestUserRouteCreateUser                     |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestUserRouteGetUserByUsername              |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestUserRouteGetUsers                       |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestUserRouteDeleteAllUsers                 |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestUserRouteDeleteUser                     |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestUserRouteUpdateUser                     |      UserRoute        |    Unit     |   BB/boundary analysis          |
| TestProductRouteAddProduct                  |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestsProductRouteAddProductErrors           |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteChangeProductQuantity       |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteChangeProductQuantityErrors |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteSellProduct                 |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestsProductRouteellProductErrors           |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteGetProducts                 |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestsProductRouteGetProductsErrors          |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteGetAvailableProducts        |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestsProductRouteGetAvailableProductsErrors |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestProductRouteDeletes                     |     ProductRoute      |    Unit     |   BB/boundary analysis          |
| TestCartRouteAddProductToCart               |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteRemoveProductFromCart          |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteCheckoutCart                   |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteGetCurrentCart                 |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteEmptyCart                      |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteGetPaidCarts                   |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteGetAllCarts                    |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestCartRouteDeleteAllCarts                 |     CartRoute         |    Unit     |   BB/boundary analysis          |
| TestReviewRouteAddReview                    |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestsReviewRouteAddReviewErrors             |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestReviewRouteGetReviewsByProduct          |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestReviewRouteeleteReview                  |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestReviewRouteeleteAllReviewsOfProduct     |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestReviewRouteDeleteAllReviews             |     ReviewRoute       |    Unit     |   BB/boundary analysis          |
| TestIntegrationUserRoutes                   |     UserRoute         | Integration |   BB/equivalence partitioning   |
| TestIntegrationProductRoutes                |     ProductRoute      | Integration |   BB/equivalence partitioning   |
| TestIntegrationCartRoutes                   |     CartRoute         | Integration |   BB/equivalence partitioning   |
| TestIntegrationReviewRoutes                 |     ReviewRoute       | Integration |   BB/equivalence partitioning   |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FR1.1                  |    userRoutes: POST /sessions Login    |
|                FR1.2                  |    userRoutes: DELETE /current  Loginout   |
|                FR1.3                  |    userRoutes: POST /users, userController: createUser, userDAO: createUser, User APIs: POST /users    Create a new user account |
|                FR2.1                  |   userRoutes: GET /users userController: getUsers, userDAO: getUsers, User APIs: GET /users    Show the list of all users |
|                FR2.2                  | userRoutes: GET /users/role/:role,  userController: getUsers, userDAO: getUsers, User APIs: GET /users/role/:role   Show the list of all users with a specific role|
|                FR2.4                  | userRoutes: GET /users/:username, userController: getUserByUsername, userDAO: getUserByUsername, User APIs: GET /users/:username    Update the information of a single user|
|                 FR2.5                 | userRoutes: DELETE /users/:username, userController: deleteUser, userDAO: deleteUser, User APIs: DELETE /users/:username    Delete a single non Admin user|
|                 FR2.6                 | userRoutes: DELETE /users, userController: deleteAll, userDAO: deleteAllUsers, User APIs:  DELETE /users  Delete all non Admin users|  
|                FR3.1                 | Add product successfully, Add an existing product, Add a product after the date, Add a product with negative quantity |
|                FR3.2                 | Change quantity successfully, Change quantity of a non-existing product, Change quantity invalid for date after,Change quantity invalid for date before, Change quantity invalid for negative quantity                                                                                         |
|                FR3.3                 | Sell product successfully, Sell a non-existing product, Sell product with zero quantity, Sell more quantity of the product that is available, Sell product with a negative quantity, Sell product in an invalid date                                                                           |
|                FR3.4                 | Fetch product by category successfully, Fetch product by model successfully, Fetch product invalid                    |
|                FR3.4.1               | Fetch available by category product successfully, Fetch available  product by model successfully, Fetch product available invalid                                                                                                                                                        |
|                FR3.5                 | Fetch product by category successfully, Fetch invalid for non-existing category, Fetch invalid for invalid grouping parameter                                                                                                                                                      |
|                FR3.5.1               | Fetch available by category product successfully, Fetch invalid for non-existing category,Fetch invalid for invalid grouping parameter                                                                                                                                                                                                                                                                                                                                |
|                FR3.6                 | Fetch product by model successfully, Fetch product invalid for no model found,Fetch invalid for invalid grouping parameter                                                                                                                                                                                                                                                                                                                                |
|                FR3.6.1               | Fetch available  product by model successfully,Fetch product invalid for no model found,Fetch invalid for invalid grouping parameter                                                                                                                                                       |
|                FR3.7                 | Delete a specific product successfully,Delete invalid for non-existing product                                         |
|                FR3.8                 | Delete all product successfully                                                                                        |
|                FR4.1                 | Add a review successfully, Add a review invalid for non-existing product, Add a review invalid for review already existing, Add a review with invalid score                                                                                                                                     |
|                FR4.2                 | Get review successfully, Get a review invalid fot non-existing review                                                  |
|                FR4.3                 | Delete a review successfully, Delete a review invalid for non-existing review                                          |
|                FR4.4                 | Delete all reviews of a product successfully, Delete a review invalid for non-existing reviews                         |
|                FR4.5                 | Delete all reviews successfully                                                                                        |
|                FR5.1                 |  GET /carts	Tests the endpoint to retrieve the current cart information for the logged-in user.       |
|                FR5.2                 |  POST /carts	Validates adding a product to the current cart via the specified endpoint.    |
|                FR5.3                 |  PATCH /carts	Verifies the process of checking out the current cart via the API.    |
|                FR5.4                 |  GET /carts/history	Tests fetching the history of carts that have been paid for by the user.      |
|                FR5.5                 |  DELETE /carts/products/:model	Ensures removal of a specific product from the current cart through the API.     |
|                FR5.6                 |  DELETE /carts/current	Validates the functionality to clear the current cart via the specified endpoint.     |
|                FR5.7                 |  GET /carts/all	Tests retrieving a list of all carts across all users, applicable to admin roles.     |
|                FR5.8                 |  DELETE /carts	Validates the capability to delete all carts, typically for admin roles.      |


## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
[!(https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/blob/main/coverage.PNG?ref_type=heads)](#)