# Requirements Document - current EZElectronics

Date: 02/05/2024

Version: V2 - description of EZElectronics in CURRENT form (as received by teachers)

| Version number | Change |
| :------------: | :----: |
|   V2           |        |

# Contents

- [Requirements Document - current EZElectronics](#requirements-document---current-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1](#use-case-1-uc1)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
      - [Scenario 1.x](#scenario-1x)
    - [Use case 2, UC2](#use-case-2-uc2)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name                  | Description                                                                                                             |
| :-------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
| User                              | Person who owns an account                                                                                              |
| Customer                          | Individual who will use the software to browse and purchase electronics products                                        |
| Premium customer                  | Customer who pays a subscription for a premium account                                                                  |
| Store Manager                     | Responsible for managing product inventory                                                                              |
| Tech Admin                        | Responsible for managing the website and customers/managers accounts                                                    |
| Suppliers                         | Third parties providing services or technologies supporting software development                                        |
| Regulators                        | Governmental or industry organizations setting compliance standards for the software and responsible of checking prices |
| Investors                         | Interested parties monitoring the project's progress and success                                                        |
| Competitors                       | Other businesses or entities offering similar products or services to customers                                         |
| Payment Service                   | Component or service responsible for managing financial transactions                                                    |

# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>

[![Context_diagramV2](https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/tree/s320340-main-patch-53761/DiagramsV2/Context_diagramV2.png)](#)

\<actors are a subset of stakeholders>
  Actor: Customer, Premium customer
         Store Manager
         Tech Admin
         Regulators
         Payment Service 

        

## Interfaces

\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

|   Actor                     | Logical Interface           | Physical Interface                                                                |
| :-------------------------: | :-------------------------: | :-------------------------------------------------------------------------------: |
| Customer, Premium customer  | GUI(products, carts)        |     Smartphone/PC                                                                 |
| Store Manager               | GUI(add/remove/patch)       |          PC                                                                       |
| Tech Admin                  | GUI(manage accounts)        |     Smartphone/PC                                                                 |
| Regulators                  | GUI(list products/prices)   |          PC                                                                       |
| Payment service             | Internet                    |  https://developer.paypal.com/api/rest/    https://developer.mastercard.com/apis  |  
|                             |                             |  https://developer.visa.com/apibrowser/#segment=ISV                               |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>
Persona 1: teenager, 13, male, low income
  Story: He needs a new phone to chat with his school friends
Persona 2: worker, 38, female, married with children
  Story: Looks for a new laptop to work from home
Persona 3: student, 22, female, engineering student
  Story: Her headphones broke while she was listening to music in the gym, so she needs a new pair
Persona 4: high-income professional, 42. male, photography passionate 
  Story: He's going for a trip so he is looking for a new camera to take photos

\<stories will be formalized later as scenarios in use cases>

# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

|  ID                                      | Description                                                                                                      |
| :--------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|  FR1 Signup                              | Allow a user to create a new account.                                                                            |
|  FR2 Authentication and authorization    | Manage account operations.                                                                                       |
|  FR2.1 Login                             | Allow a user to login using credentials.                                                                         |
|  FR2.2 Logout                            | Allow the current logged in user to logout.                                                                      |
|  FR2.3 Manage accounts                   | Allow to list all accounts and delete accounts                                                                   |   
|  FR3 Retrieve information                | Allow the current logged in user to retrieve his information.                                                    |
|  FR4 List users                          | Show the list with information about all signed up user.                                                         |  
|  FR4.1 List by role                      | Show the list filtering by role.                                                                                 |
|  FR5 Retrieve product                    | Retrieve products using filtering.                                                                               |
|  FR5.1 Retrieve list                     | Retrieve the list of all products.                                                                               |
|  FR5.2 Retrieve by category              | Retrieve the list filtered by product category.                                                                  |
|  FR5.3 Retrieve by model                 | Retrieve the list filtered by product model.                                                                     |
|  FR5.4 Retrieve by sold status           | Retrieve the list filtered by product sold status.                                                               |
|  FR6 Delete a specific product           | Allow the manager to delete a product.                                                                           |
|  FR7 Retrieve user by username           | Allow to retrieve a user using a username.                                                                       |
|  FR8 Delete user                         | Allow to delete a user by username.                                                                              |
|  FR9 Register product                    | Allow the manager to register a new product.                                                                     |
|  FR10 Manage products                    | Allow the manager to register the arrival of a set of products of the same model.                                |
|  FR10.1 Change product sold status       | Allow the manager to mark a product as sold.                                                                     |
|  FR11 Retrieve current cart              | The system should retrieve the current cart of the logged-in user who is a Customer.                             |
|  FR12 Add product to cart                | The system should allow a logged-in user with the role of Customer to add a product to their current cart.       |
|  FR13 Pay for current cart               | The system should allow a logged-in user with the role of Customer to pay for their current cart.                |
|  FR14 Retrieve Cart History              | The system should retrieve the history of paid carts for the logged-in user who is a Customer.                   |
|  FR15 Remove Product from Cart           | The system should allow a logged-in user with the role of Customer to remove a product from their current cart.  |
|  FR16 Delete current cart                | The system should allow a logged-in user with the role of Customer to delete their current cart.                 |
|  FR17 Manage Payment                     | The system should require payment and manage payment information.                                                |
|  FR18 Upgrade to premium                 | Allow a customer to upgrade his account to premium by paying a monthly or yearly fee.                            |
|  FR19 Users Feedback                     | Users should be able to submit feedback through the application                                                  |
|  FR19.1 Feedback specs                   | Feedback should include options for rating, comments, and suggestions.                                           |
|  FR19.2 Managers                         | Store managers should be able to view and manage customer feedback.                                              |
|  FR19.3 Tech admins                      | Tech admins should have access to analytics and reports based on user feedback.                                  |
|  FR19.4 Investors                        | Investors should have access to aggregated feedback data for evaluation.                                         |
|  FR19.5 Competitors                      | Competitors should not have access to sensitive feedback data                                                    |
|  FR20 Order process                      | The user should be able to put products in orders and view orders and orders processing                          | 
 

## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID     | Type (efficiency, reliability, ..) | Description                                                                                        | Refers to       |
| :-----:  | :--------------------------------: | :------------------------------------------------------------------------------------------------: | :-----------: |
|  NFR1    | Usability                          | The user should be able to use the application with no training in less than 15 minutes            |   FR1-FR16     |
|  NFR2    | Efficiency                         | All functions of the application must be completed in less then 0.5 sec (excluding network latency)|   FR1-FR16     |
|  NFR3    | Efficiency                         | The mobile app should require less then 100MB of diskspace                                         |                |
|  NFR4    | Efficiency                         | The system must ensure efficient delivery of shipments, with orders delivered within 10 days from the date of purchase for standard users and within 3 days for premium users                                                                                      |   FR17,FR20  |   
|  NFR5    | Reliability                        | No more than 2 defects per year per user                                                           |   FR1-FR16     |
|  NFR6    | Maintainability                    | Fixing a defect must require less than 8 person hours                                              |   FR1-FR16     |
|  NFR7    | Portability                        | Mobile app should be available: IOS from version 15(2021), android from release 1(2020)            |                |
|  NFR8    | Portability                        | Web app should be available: Google Chrome from version 65.0.3325(March 2018), Microsoft edge from version 79.0.309(2020), Safari from version 13.1(2020), Mozilla Firefox from version 84(December2020)                                                                |                 |
|  NFR9    | Security                           | The application must implement encryption for sensitive data, such as user credentials and payment information       |
 
# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

[![UCDV2](https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/tree/s320340-main-patch-53761/DiagramsV2/UCDV2.png)](#)

\<next describe here each use case in the UCD>

### Use case Sign up - FR1

| Actors Involved  |                                                                         |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   | \<Boolean expression, must evaluate to true before the UC can start>    |
|  Post condition  |  \<Boolean expression, must evaluate to true after UC is finished>      |
| Nominal Scenario |         \<Textual description of actions executed by the UC>            |
|     Variants     |                      \<other normal executions>                         |
|    Exceptions    |                        \<exceptions, errors >                           |

| Actors Involved  | User                                                                                                   |
| :--------------: | :--------------------------------------------------------------------------------------------------:   |
|   Precondition   | User has no account                                                                                    |
|  Post condition  |                                                                                                        |
| Nominal Scenario | SU1: After filling a form the account is created                                                       |
|     Variants     |                                                                                                        |
|    Exceptions    | SU2(an account with that username already exists), SU3(role not valid), SU4(invalid verification code) |             



##### Scenario SU1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario SU1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User has no account                                                        |
| Post condition | The account is created successfully                                        |
|     Step#      |                                Description                                 |
|       1        | User fills in username, name, surname, email, password, role               |
|       2        | System looks for an account username and checks it does not exists, OK     |
|       3        | System sends an email verification code                                    |
|       4        | User inserts the verification code                                         |
|       5        | System check verification code, OK                                         |
|       6        | System checks role is either "Customer" or "Manager", OK                   |
|       7        | Account is created, notify User                                            |

##### Scenario SU2

|  Scenario SU2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User has no account                                                        |
| Post condition | The account is not created, username already exists                        |
|     Step#      |                                Description                                 |
|       1        | User fills in username, name, surname, email, password, role               |
|       2        | System looks for an account username, it does already exists, NOT OK       |
|       3        | System notifies User that username already exists                          |

##### Scenario SU3

|  Scenario SU3  |                                                                                 |
| :------------: | :-----------------------------------------------------------------------------: |
|  Precondition  | User has no account                                                             |
| Post condition | The account is not created, role is invalid                                     |
|     Step#      |                                Description                                      |
|       1        | User fills in username, name, surname, email, password, role                    |
|       2        | System looks for an account username and checks it does not exists, OK          |
|       3        | System checks role is either "Customer" or "Manager", role is different, NOT OK |
|       4        | System notifies User that the role inserted is invalid                          |

##### Scenario SU4

|  Scenario SU4  |                                                                                 |
| :------------: | :-----------------------------------------------------------------------------: |
|  Precondition  | User has no account                                                             |
| Post condition | The account is not created, role is invalid                                     |
|     Step#      |                                Description                                      |
|       1        | User fills in username, name, surname, email, password, role                    |
|       2        | System looks for an account username and checks it does not exists, OK          |
|       3        | System sends an email verification code                                         |
|       4        | User inserts the verification code                                              |
|       5        | System check verification code,  NOT OK                                         |
|       5        | System sends verification code 2 more times                                     |
|       4        | User inserts wrong verification code, NOT OK                                    |
|       4        | Account is not created, procedure is blocked for 15 minutes, notify User        |


### Use case Authenticate - FR 2

| Actors Involved  | User                                                                    |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   | User has an account                                                     |
|  Post condition  |                                                                         |
| Nominal Scenario | AU1: User fills username and password and logs in                       |
|     Variants     |                                                                         |
|    Exceptions    | AU2(wrong username), AU3(wrong password)                                | 

##### Scenario AU1 - FR 2.1

|  Scenario AU1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User has an account                                                        |
| Post condition | User gets authenticated as Customer/Manager                                |
|     Step#      |                                Description                                 |
|       1        | User fills in username and password                                        |
|       2        | System looks for account username and password. Match OK                   |
|       3        | System authenticates User as Customer/Manager                              |
|       4        | User is notified of successful authentication                              |

##### Scenario AU2 

|  Scenario AU2  |                                                                                          |
| :------------: | :-------------------------------------------------------------------------------------:  |
|  Precondition  | User has an account                                                                      |
| Post condition | User is not authenticated, username not found                                            |
|     Step#      |                                Description                                               |
|       1        | User fills in username and password                                                      |
|       2        | System looks for account username and password. The username is not found, NOT OK        |
|       3        | User is not authenticated. System notifies User                                          |  

##### Scenario AU3

|  Scenario AU3  |                                                                                                                |
| :------------: | :------------------------------------------------------------------------------------------------------------: |
|  Precondition  | User has an account                                                                                            |
| Post condition | User is not authenticated, password not matching                                                               |
|     Step#      |                                Description                                                                     |
|       1        | User fills in username and password                                                                            |
|       2        | System looks for account username and password. The password corresponding to username is not matching, NOT OK |
|       3        | User is not authenticated. System notifies User                                                                | 



### Use case Log out - FR 2.2

| Actors Involved  | User                                                                    |
| :--------------: | :---------------------------------------------------------------------: |
|   Precondition   | User has account, is logged in                                          |
|  Post condition  | User is logged out, session ends                                        |
| Nominal Scenario | LO1: User performs log out                                              |
|     Variants     |                                                                         |
|    Exceptions    |                                                                         | 

##### Scenario LO1

|  Scenario LO1  |                                                                           |
| :------------: | :-----------------------------------------------------------------------: |
|  Precondition  | User has account, is logged in                                            |
| Post condition | User is logged out, his session ends                                      |
|     Step#      |                                Description                                |
|       1        | User presses log out button                                               |
|       2        | System performs logout for the User. Sends a notification                 |


### Use case Retrieve informations - FR 3

| Actors Involved  | User                                                                    |
| :--------------: | :---------------------------------------------------------------------: |
|   Precondition   | User has account, is logged in                                          |
|  Post condition  | User retrieve his informations                                          |
| Nominal Scenario | RI1: User retrieves his username,name,surname, email, role              |
|     Variants     |                                                                         |
|    Exceptions    |                                                                         | 

##### Scenario RI1

|  Scenario RI1  |                                                                                     |
| :------------: | :---------------------------------------------------------------------------------: |
|  Precondition  | User has account, is logged in                                                      |
| Post condition | User retrieves his username,name,surname,role                                       |
|     Step#      |                                Description                                          |
|       1        | User asks for his information                                                       |
|       2        | System performs query using User username, selects username,name,surname,email,role |
|       3        | System returns the extracted information                                            |


### Use case List Users LU - FR 4.1

| Actors Involved  | User                                                                             |
| :--------------: | :------------------------------------------------------------------------------: |
|   Precondition   |                                                                                  |
|  Post condition  |                                                                                  |
| Nominal Scenario | LU1: User gets the list of all User signed up  and their information             |
|     Variants     |                                                                                  |
|    Exceptions    | LU2: The list is empty                                                           |


##### Scenario LU1

|  Scenario LU1  |                                                                                             |
| :------------: | :-----------------------------------------------------------------------------------------: |
|  Precondition  |                                                                                             |
| Post condition | User gets the list: username,name,surname,email, role for all signed up Users               |
|     Step#      |                                Description                                                  |
|       1        | User asks the list of all Users                                                             |
|       2        | System performs query extracting all Users and their information, builds a list, not empty  |
|       3        | System returns the list                                                                     |


##### Scenario LU2

|  Scenario LU2  |                                                                                   |
| :------------: | :------------------------------------------------------------------------------:  |
|  Precondition  |                                                                                   |
| Post condition | User receives an empty list                                                       |
|     Step#      |                                Description                                        |
|       1        | User asks the list of all Users                                                   |
|       2        | System performs queries on User table, there are no Users, return list is empty   |
|       3        | System returns an empty list and a notification                                   |


### Use case List by role LR - FR 4.2

| Actors Involved  | User                                                                                    |
| :--------------: | :-------------------------------------------------------------------------------------: |
|   Precondition   |                                                                                         |
|  Post condition  |                                                                                         |
| Nominal Scenario | LR1: User retrieves the list of all Users signed up matching the role query parameter   |
|     Variants     |                                                                                         |
|    Exceptions    | LR2: The list built using the role parameter is empty                                   |

##### Scenario LR1

|  Scenario LR1  |                                                                                                    |
| :------------: | :-----------------------------------------------------------------------------------------------:  |
|  Precondition  |                                                                                                    |
| Post condition | User gets the list: username,name,surname,role for all signed up Users matching the role           |
|     Step#      |                                Description                                                         |
|       1        | User insert the role to filter                                                                     |
|       2        | System performs query extracting all Users matching the parameter role, builds a list, not empty   |
|       3        | System returns the list                                                                            |


##### Scenario LR2

|  Scenario LR2  |                                                                                                      |
| :------------: | :--------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                                                                      |
| Post condition | User receives an empty list                                                                          |
|     Step#      |                                Description                                                           |
|       1        | User insert the role to filter                                                                       |
|       2        | System performs query extracting all Users matching the parameter role, doesn't find any, empty list |
|       3        | System returns an empty list and a notification                                                      |


### Use case Retrieve product - FR5

| Actors Involved  | User                                                                    |
| :--------------: | :---------------------------------------------------------------------: |
|   Precondition   | User has an account                                                     |
|  Post condition  |                                                                         |
| Nominal Scenario | RP1: list of products is retrieved                                      |
|     Variants     | RP2, RP3, RP4                                                           |
|    Exceptions    | RP5(product doesn't exist)                                              | 


##### Scenario RP1

|  Scenario RP1  |                                                          |
| :------------: | :------------------------------------------------------: |
|  Precondition  | User has an account, is logged in                        |
| Post condition | List of products is retrieved                            |
|     Step#      |                                Description               |
|       1        | User sends a Get request                                 |
|       2        | System retrieve the list of all products OK              |
|       3        | System shows the list of products to user                | 


##### Scenario RP2

|  Scenario RP2  |                                                                                         |
| :------------: | :-------------------------------------------------------------------------------------: |
|  Precondition  | User has an account, is logged in                                                       |
| Post condition | List of products filtered by product category is shown                                  |
|     Step#      |                                Description                                              |
|       1        | User send a Get request with a specific category of products OK                         |
|       2        | System retrieve the list of products of the specified category                          |
|       3        | System shows the list of products to user                                               | 


##### Scenario RP3

|  Scenario RP3  |                                                                                         |
| :------------: | :-------------------------------------------------------------------------------------: |
|  Precondition  | User has an account, is logged in                                                       |
| Post condition | List of products filtered by product model is shown                                     |
|     Step#      |                                Description                                              |
|       1        | User send a Get request with a specific model of products OK                            |
|       2        | System retrieve the list of products of the specified model                             |
|       3        | System shows the list of products to user                                               | 
 

##### Scenario RP4

|  Scenario RP4  |                                                                                  |
| :------------: | :------------------------------------------------------------------------------: |
|  Precondition  | User has an account, is logged in                                                |
| Post condition | List of products filtered by product sold status is shown                        |
|     Step#      |                                Description                                       |
|       1        | User send a Get request with a specific sold status of products OK               |
|       2        | System retrieve the list of products of the specified sold status                |
|       3        | System shows the list of products to user                                        | 

##### Scenario RP5

|  Scenario RP5  |                                                                                  |
| :------------: | :------------------------------------------------------------------------------: |
|  Precondition  | A logged in user asks to a specific product                                      |
| Post condition | The product doesn’t exist, the system return an 404 error                        |
|     Step#      |                                Description                                       |
|       1        | User send a Get request for a specific product                                   |
|       2        | System doesn't retrieve the product because it doesn't exist, NOT OK             |
|       3        | System returns an 404 error                                                      | 


### Use case Delete product - FR6

| Actors Involved  | Manager                                                                 |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   | User has an account, role is manager                                    |
|  Post condition  |                                                                         |
| Nominal Scenario | DP1: the product is deleted                                             |
|     Variants     |                                                                         |
|    Exceptions    | DP2(product doesn't exist)                                              | 


##### Scenario DP1

|  Scenario DP1  |                                                                          |
| :------------: | :----------------------------------------------------------------------: |
|  Precondition  | User has an account, role is manager                                     |
| Post condition | The product is deleted                                                   |
|     Step#      |                                Description                               |
|       1        | The manager does a delete request of a specific product                  |
|       2        | System looks for the product, product found, deletes the product, OK     |
|       3        | System returns a message to Manager                                      | 


##### Scenario DP2

|  Scenario DP2  |                                                                          |
| :------------: | :----------------------------------------------------------------------: |
|  Precondition  | User has an account, role is manager                                     |
| Post condition | The product is not deleted                                               |
|     Step#      |                                Description                               |
|       1        | The manager does a delete request of a specific product                  |
|       2        | System looks for the product, product not found, can't delete, NOT OK    |
|       3        | System returns a error message to Manager                                | 


### Use case Retrieve user by username - FR7

| Actors Involved  | User                                                                    |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   |                                                                         |
|  Post condition  |                                                                         |
| Nominal Scenario | RUS1: user is returned                                                  |
|     Variants     |                                                                         |
|    Exceptions    | RUS2(provided username doesn't exist)                                   |  


##### Scenario RUS1

|  Scenario RUS1  |                                                    |
| :------------: | :-------------------------------------------------: |
|  Precondition  |                                                     |
| Post condition | The requested user is returned                      |
|     Step#      |                                Description          |
|       1        | User inserts the username to look for               |
|       2        | System looks for the username, user found OK        |
|       3        | System returns the requested user                   | 


##### Scenario RUS2

|  Scenario RUS2 |                                                            |
| :------------: | :--------------------------------------------------------: |
|  Precondition  |                                                            |
| Post condition | The User is not returned                                   |
|     Step#      |                                Description                 |
|       1        | User inserts the username to look for                      |
|       2        |  System looks for the username, user not found, NOT OK     |
|       3        | System returns a 404 error message                         | 


### Use case Delete user - FR8

| Actors Involved  | User                                                                    |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   |                                                                         |
|  Post condition  |                                                                         |
| Nominal Scenario | DU1: user is deleted using the provided username                        |
|     Variants     |                                                                         |
|    Exceptions    | DU2(provided username doesn't exist)                                    |  


##### Scenario DU1

|  Scenario DU1  |                                                               |
| :------------: | :-----------------------------------------------------------: |
|  Precondition  |                                                               |
| Post condition | The requested user is deleted                                 |
|     Step#      |                                Description                    |
|       1        | User inserts the username of the user to delete               |
|       2        | System looks for the username, user found, user deleted OK    |
|       3        | System returns a OK message to user                           | 


##### Scenario DU2

|  Scenario DU2  |                                                               |
| :------------: | :-----------------------------------------------------------: |
|  Precondition  |                                                               |
| Post condition | The User is not deleted                                       |
|     Step#      |                                Description                    |
|       1        | User inserts the username of the user to delete               |
|       2        |  System looks for the username, user not found, NOT OK        |
|       3        | System returns a 404 error message                            | 


### Use case Register product - FR9

| Actors Involved  | Manager                                                                 |
| :--------------: | :------------------------------------------------------------------:    |
|   Precondition   | Manager is logged in, Product has not been registered yet               |
|  Post condition  |                                                                         |
| Nominal Scenario | RP1: the product is successfully registered                             |
|     Variants     |                                                                         |
|    Exceptions    | RP2(duplicate code), RP3(arrivalDate is after the current date)         | 

##### Scenario RP1

|  Scenario RP1  |                                                              |
| :------------: | :----------------------------------------------------------: |
|  Precondition  | Manager is logged in, Product has not been registered yet    |
| Post condition | Product is registered                                        |
|     Step#      |                                Description                   |
|       1        |  Manager input information of product                        |
|       2        |  System: Looks for code, does not exist, OK                  |
|       3        |  System:Checks arrivalDate, not after the current date, OK   | 
|       4        |  Product registered. Notify user                             | 

##### Scenario RP2

|  Scenario RP2  |                                                              |
| :------------: | :----------------------------------------------------------: |
|  Precondition  |  Manager is logged in, Product has not been registered yet   |
| Post condition |  Return a 409 error(duplicate product)                       |
|     Step#      |                                Description                   |
|       1        | Manager input information of product                         |
|       2        | System: Looks for code, it already exists, NOT OK            |
|       3        | System: Returns a 409 error and asks to retry                | 



##### Scenario RP3

|  Scenario RP3  |                                                               |
| :------------: | :-----------------------------------------------------------: |
|  Precondition  | Manager is logged in, Product has not been registered yet     |
| Post condition | Return a error(arrivalDate is after the current date)         |
|     Step#      |                                Description                    |
|       1        |  Manager input information of product                         |
|       2        |  System: Looks for code, does not exist, OK                   |
|       3        |  System:Checks arrivalDate, after the current date, NOT OK    | 
|       4        |  System: Return a error and asks to retry                     | 


### Use case Manage products - FR10

| Actors Involved  | Manager                                                                            |
| :--------------: | :------------------------------------------------------------------:               |
|   Precondition   | Manager is logged in, Product has been registered                                  |
|  Post condition  |                                                                                    |
| Nominal Scenario | MP1(update arrivaldate), MP2 (update selling state and date)                       |
|     Variants     |                                                                                    |
|    Exceptions    | MP3(arrivalDate is after the current date), MP4(the product has already been sold) | 


##### Scenario MP1

|  Scenario MP1  |                                                                           |
| :------------: | :---------------------------------------------------------------------:   |
|  Precondition  | Manager is logged in, Product has been registered                         |
| Post condition | Update product arrivalDate                                                |
|     Step#      |                                Description                                |
|       1        |  Manager: manager selects model of products                               |
|       2        |  Manager: Manager selects to update arrivaldate and input date            |
|       3        |  System: Checks arrivalDate, not after the current date                   | 
|       4        |  Product updated. Notify user                                             |

##### Scenario MP2

|  Scenario MP2  |                                                                      |
| :------------: | :------------------------------------------------------------------: |
|  Precondition  | Manager is logged in, Product has been registered                    |
| Post condition | Update product selling state and date                                |
|     Step#      |                                Description                           |
|       1        |  Manager: Manager input code of products                             |
|       2        |  Manager: Manager select to update soldstate                         |
|       3        |  System:Checks soldstate,the product has not been sold, OK           | 
|       4        |  Product updated. Notify user                                        |


##### Scenario MP3

|  Scenario MP3  |                                                                       |
| :------------: | :-------------------------------------------------------------------: |
|  Precondition  | Manager is logged in, Product has been registered                     |
| Post condition | Return a 409 error(arrivalDate is after the current date)             |
|     Step#      |                                Description                            |
|       1        |  Manager: Manager input code of products                              |
|       2        |  Manager: Manager select to update arrivalDate and input date         |
|       3        |  System: checks arrivalDate,  after the current date, NOT OK          | 
|       4        |  System: Return a 409 error and ask to retry                          |



##### Scenario MP4

|  Scenario MP4  |                                                                  |
| :------------: | :--------------------------------------------------------------: |
|  Precondition  | Manager is logged in, Product has been registered                |
| Post condition | Return a error(the product has already been sold)                |
|     Step#      |                                Description                       |
|       1        |  Manager: Manager input code of products                         |
|       2        |  Manager: Manager select to update soldState                     |
|       3        |  System:  checks soldstate, the product has been sold, NOT OK    | 
|       4        |  System: Return a 409 error and ask to retry                     |


#### Use Case Retrieve current cart - FR11

| Actors Involved   | Customer                                                      |
|-------------------|-------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                 |
| Post condition    | System retrieves the current cart of the user.                |
| Nominal Scenario  | RC1: User sends a GET request to retrieve their current cart. |
| Variants          |                                                               |
| Exceptions        |                                                               |


##### Scenario RC1

| Scenario RC1      |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | System retrieves the current cart of the user.                                           |
| Step#             |                                                                                          |
| 1                 | User sends a GET request to retrieve their current cart.                                 |
| 2                 | System returns a 200 status code along with the cart object.                             |

#### Use Case Add product to cart - FR12

| Actors Involved   | Customer                                                                                               |
|-------------------|------------------------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                                          |
| Post condition    |                                                                                                        |
| Nominal Scenario  | AC1: User sends a POST request to add a product to their cart.                                         |
| Variants          |                                                                                                        |
| Exceptions        | AC2: Product ID provided is invalid or already in another cart., AC3: Product ID has already been sold |


##### Scenario AC1

| Scenario  AC1     |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Product is successfully added to the user's cart.                                        |
| Step#             |                                                                                          |
| 1                 | User sends a POST request to add a product to their cart.                                |
| 2                 | System verifies the validity of the product ID.                                          |
| 3                 | System adds the product to the user's cart.                                              |
| 4                 | System returns a 200 status code upon successful addition of the product to the cart.    |

##### Scenario AC2

| Scenario  AC2     |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Product ID provided is invalid or already in another cart..                              |
| Step#             |                                                                                          |
| 1                 | User sends a POST request to add a product to their cart.                                |
| 2                 | System verifies the validity of the product ID. NOT VALID                                |
| 3                 | System doesn't add the product to the user's cart. Notify user                           |

##### Scenario AC3

| Scenario  AC3     |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Product ID provided is already been sold                                                 |
| Step#             |                                                                                          |
| 1                 | User sends a POST request to add a product to their cart.                                |
| 2                 | System verifies the validity of the product ID. NOT VALID, Product already sold          |
| 3                 | System doesn't add the product to the user's cart. Notify user                           |


#### Use Case Pay for Current Cart - FR13

| Actors Involved   | Customer                                                       |
|-------------------|--------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                  |
| Post condition    |                                                                |
| Nominal Scenario  | PC1: User sends a PATCH request to pay for their current cart. |
| Variants          |                                                                |
| Exceptions        | PC2: User's cart is empty.                                     |

#### Scenario PC1

| Scenario  PC1     |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Cart is successfully paid for.                                                           |
| Step#             |                                                                                          |
| 1                 | User sends a PATCH request to pay for their current cart.                                |
| 2                 | The system looks for the user's current cart, checks not empty OK.                       |
| 3                 | The system returns a 200 status code upon successful payment of the cart.                |


#### Scenario PC2

| Scenario   PC2    |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Cart is not  paid for.                                                                   |
| Step#             |                                                                                          |
| 1                 | User sends a PATCH request to pay for their current cart.                                |
| 2                 | The system looks for the user's current cart, checks not empty, it's empty NOT OK.       |
| 3                 | The system returns a 404 status code                                                     |


#### Use Case Retrieve Cart history - FR14

| Actors Involved   | Customer                                                |
|-------------------|-------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.           |
| Post condition    | System retrieves the history of paid carts.             |
| Nominal Scenario  | RH1: User sends a GET request to retrieve cart history. |
| Variants          |                                                         |
| Exceptions        |                                                         |

#### Scenario RH1

| Scenario  RH1     |                                                                                        |
|-------------------|--------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                          |
| Post condition    | System retrieves the history of paid carts.                                            |
| Step#             |                                                                                        |
| 1                 | User sends a GET request to retrieve cart history.                                     |
| 2                 | The system excludes the current cart from the history list.                            |
| 3                 | The system returns a 200 status code along with the history of paid carts              |

### Use case Remove product from cart - FR15

| Actors Involved   | Customer                                                                                                                                 |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                                                                            |
| Post condition    |                                                                                                                                          |
| Nominal Scenario  | RC1: Product is successfully removed from the cart                                                                                       |
| Variants          |                                                                                                                                          |
| Exceptions        | RC2(Product ID provided is invalid or not in the user's cart), RC3(product ID is already sold), RC4(the logged user doesn't have a cart) |

#### Scenario RC1

| Scenario     RC1  |                                                                                          |
|-------------------|------------------------------------------------------------------------------------------|
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | Product is successfully removed from the user's cart.                                    |
| Step#             |                                                                                          |
| 1                 | User sends a DELETE request to remove a product from their cart.                         |
| 2                 | System check the current logged in user has a cart, OK                                   | 
| 3                 | System verifies product ID has not been sold yet, OK                                     |
| 4                 | System verifies the validity of the product ID and if it exists in the user's cart, OK   |
| 5                 | System removes the product from the user's cart.                                         |
| 6                 | System returns a 200 status code upon successful removal of the product from the cart.   |

#### Scenario RC2

| Scenario     RC2  |                                                                                                 |
|-------------------|-----------------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                                   |
| Post condition    | Product is not removed from the user's cart.                                                    |
| Step#             |                                                                                                 |
| 1                 | User sends a DELETE request to remove a product from their cart.                                |
| 2                 | System check the current logged in user has a cart, OK                                          | 
| 3                 | System verifies product ID has not been sold yet, OK                                            |
| 4                 | System verifies the validity of the product ID and if it exists in the user's cart, NOT OK      |
| 5                 | System doesn't remove the product from the user's cart.                                         |
| 6                 | System returns 404 status code error message.                                                   |



#### Scenario RC3

| Scenario     RC3  |                                                                     |
|-------------------|-------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                       |
| Post condition    | Product is not removed from the user's cart.                        |
| Step#             |                                                                     |
| 1                 | User sends a DELETE request to remove a product from their cart.    |
| 2                 | System check the current logged in user has a cart, OK              | 
| 3                 | System verifies product ID has not been sold yet,  NOT OK           |
| 4                 | System doesn't remove the product from the user's cart.             |
| 5                 |  System returns 404 status code error message.                      |


#### Scenario RC4

| Scenario  RC4     |                                                                       |
|-------------------|---------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                         |
| Post condition    | Product is not removed from the user's cart.                          |
| Step#             |                                                                       |
| 1                 | User sends a DELETE request to remove a product from their cart.      |
| 2                 | System check the current logged in user has a cart, NOT OK            | 
| 3                 | System doesn't remove the product from the user's cart.               |
| 4                 |  System returns 404 status code error message.                        |


### Use case Delete current cart - FR16  

| Actors Involved   | Customer                                                        |
|-------------------|---------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                   |
| Post condition    |                                                                 |
| Nominal Scenario  | DCC1: User sends a DELETE request to delete their current cart. |
| Variants          |                                                                 |
| Exceptions        | DCC2(User's cart is empty.)                                     |

#### Scenario DCC1

| Scenario   DCC1   |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | User's current cart is successfully deleted.                                             |
| Step#             |                                                                                          |
| 1                 | User sends a DELETE request to delete their current cart.                                |
| 2                 | System check the current logged in user has a cart, OK                                   | 
| 3                 |  System returns a 200 status code upon successful removal of the cart.                   |

#### Scenario DCC2

| Scenario   DCC2   |                                                                                          |
|-------------------|----------------------------------------------------------------------------------------: |
| Precondition      | User is logged in and has a role of Customer.                                            |
| Post condition    | User's current cart is not deleted.                                                      |
| Step#             |                                                                                          |
| 1                 | User sends a DELETE request to delete their current cart.                                |
| 2                 | System check the current logged in user has a cart, NOT OK                               | 
| 3                 | System returns a 404 status code error message                                           |

### Use case Manage Payment - FR17  

| Actors Involved   | Customer                                                                                                                            |
|-------------------|---------------------------------------------------------------:                                                                     |
| Precondition      | User is logged in and has a role of Customer, want to buy one or more products in the cart and insert his/her payment information   |
| Post condition    |                                                                                                                                     |
| Nominal Scenario  | MP1: User insert the correct information about his/her cart                                                                         |
| Variants          |                                                                                                                                     |
| Exceptions        | MP2(User payment failed)                                                                                                            |


#### Scenario MP1

| Scenario   MP1    |                                                                                                                                      |
|-------------------|----------------------------------------------------------------------------------------:                                             |
| Precondition      | User is logged in and has a role of Customer, want to buy one or more products in the cart and insert his/her payment information    |
| Post condition    | User successfully pay                                                                                                                |
| Step#             |                                                                                                                                      |
| 1                 | Customer selects the option to manage payment.                                                                                       |
| 2                 | System prompts the user to input their payment                                                                                       | 
| 3                 | Customer inputs their payment details                                                                                                |
| 4                 | System verifies the payment information.                                                                                             |
| 5                 | System processes the payment.                                                                                                        |
| 6                 | Payment is successfully processed, and the transaction is completed.                                                                 |

#### Scenario MP2

| Scenario   MP2    |                                                                                                                                      |
|-------------------|----------------------------------------------------------------------------------------:                                             |
| Precondition      | User is logged in and has a role of Customer, want to buy one or more products in the cart and insert his/her payment information    |
| Post condition    | Payment failed                                                                                                                       |
| Step#             |                                                                                                                                      |
| 1                 | Customer selects the option to manage payment.                                                                                       |
| 2                 | System prompts the user to input their payment                                                                                       | 
| 3                 | Customer inputs their payment details                                                                                                |
| 4                 | System verifies the payment information.                                                                                             |
| 5                 | System detects that the payment failed                                                                                               |
| 6                 | Payment fails, and the system notifies the user about the failed transaction.                                                        |



### Use case Upgrade to Premium - FR 18 

| Actors Involved  | Customer                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Customer has account, account is free                                |
|  Post condition  |                                                                      |
| Nominal Scenario | UTP1: Customer pays the fee and his account is successfully upgraded |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    | UTP2(payment doesn't succeed)                                        |


##### Scenario UTP1

|  Scenario UTP1  |                                                                                                                                      |
| :------------:  | :----------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition   | Customer has account, account is "free"                                                                                              |
| Post condition  | Customer's account is upgraded to premium                                                                                            |
|     Step#       |                                                                                                                                      |
|       1         | Customer manages account, selects upgrade to premium                                                                                 |
|       2         | Customer selects the subscription plan and confirm                                                                                   |
|       3         | System: checks customer has not premium account already                                                                              |
|       4         | System: prompts the user to input their payment details                                                                              |
|       5         | Customer inputs their payment details                                                                                                |
|       6         | System verifies the payment information                                                                                              |
|       7         | System processes the payment                                                                                                         |
|       8         | Payment is successfully processed, the transaction is completed, the account is successfully upgraded to premium                     |

##### Scenario UTP2

|  Scenario UTP2 |                                                                                                                      |
| :------------: | :------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Customer has account, account is "free"                                                                              |
| Post condition | Customer's account is not upgraded to premium                                                                        |
|     Step#      |                                                                                                                      |
|       1        | Customer manages account, selects upgrade to premium                                                                 |
|       2        | Customer selects the subscription plan and confirm                                                                   |
|       3        | System: checks customer has not premium account already                                                              |
|       4        | System: prompts the user to input their payment details                                                              |
|       5        | Customer inputs their payment details                                                                                |
|       6        | System verifies the payment information                                                                              |
|       7        | System detects that the payment failed                                                                               |
|       8        | Payment fails, the system notifies the user about the failed transaction, the account is not upgraded to premium     |


## Use Case: Submit Feedback -FR19.1

| Actors Involved   | Customer, User                                                                                                             |
|-------------------|----------------------------------------------------------------------------------------------------------------------------|
| Precondition      | User is logged in.                                                                                                         |
| Post condition    | Feedback is successfully submitted.                                                                                        |
| Nominal Scenario  | 1. User navigates to the feedback section. 2. User selects the type of feedback (product, service, overall experience). 3. User rates the experience and provides comments. 4. User submits the feedback.                                                                                  |                  
| Variants          | User cancels the feedback submission. - User edits the feedback before                                                     | submission.                                                                                                                                      |             
| Exceptions        | User encounters an error during submission.                                                                                |


#### Scenario: Submit Feedback

| Scenario          |                                                                                |
|-------------------|--------------------------------------------------------------------------------|
| Precondition      | User is logged in.                                                             |
| Post condition    | Feedback is successfully submitted.                                            |
| Step#             |                                                                                |
| 1                 | User navigates to the "Feedback" section of the application.                   |
| 2                 | User selects the type of feedback (product, service, overall experience).      |
| 3                 | User rates the experience and provides comments.                               |
| 4                 | User submits the feedback.                                                     |


## Use Case: View and Manage Feedback - FR 19.2

| Actors Involved   | Store Manager, Tech Admin                                                                                                   |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Precondition      | User feedback is available.                                                                                                 |
| Post condition    | Feedback is reviewed or managed.                                                                                            |
| Nominal Scenario  | 1. Store manager or tech admin accesses the feedback management section. 2. Feedback entries are displayed with options to view details or take actions. 3. Store manager or tech admin reviews feedback details. 4. Store manager or tech admin takes actions such as responding to feedback or marking as resolved.                                                                                                                                         |
| Variants          | Store manager or tech admin filters feedback by category or rating. - Store manager or tech admin exports feedback data for analysis.                                                                                                                                         |
| Exceptions        | No feedback entries are available. - Store manager or tech admin encounters an error while managing feedback.                                                                                                                                         |


## Scenario: View and Manage Feedback

| Scenario          |                                                                                                     |
|-------------------|-----------------------------------------------------------------------------------------------------|
| Precondition      | User feedback is available.                                                                         |  
| Post condition    | Feedback is reviewed or managed.                                                                    |
| Step#             |                                                                                                     |
| 1                 | Store manager or tech admin accesses the "Feedback Management" section.                             |
| 2                 | Feedback entries are displayed with options to view details or take actions.                        |
| 3                 | Store manager or tech admin reviews feedback details.                                               |
| 4                 | Store manager or tech admin takes actions such as responding to to feedback or marking as resolved. |



## Use Case: Analyze Feedback Data - FR 19.3

| Actors Involved  | Tech Admin                                                                                                                  |
| :--------------: | :--------------------------------------------------------------------------------------------------------------------------:|
|   Precondition   | Feedback data is available                                                                                                  |
|  Post condition  | Feedback data is analyzed                                                                                                   |
| Nominal Scenario | 1. Tech admin accesses the feedback analytics dashboard. 2. Feedback data is visualized in charts and graphs. 3. Tech admin analyzes trends, patterns, and sentiment from the feedback data.                                                                                                  |
|     Variants     | Tech admin adjusts time range or filters for specific metrics. - Tech admin generates reports for stakeholders.                                                                                                                                    |
|    Exceptions    | No feedback data is available. - Tech admin encounters an error while analyzing data                                        |


## Scenario: Analyze Feedback Data

|  Scenario      |                                                                                 |
| :------------: | :------------------------------------------------------------------------------:|
|  Precondition  | Feedback data is available.                                                     |
| Post condition | Feedback data is analyzed.                                                      |
|     Step#      |                                                                                 |
|       1        | Tech admin accesses the "Feedback Analytics" dashboard.                         |
|       2        | Feedback data is visualized in charts and graphs.                               |
|       3        | Tech admin analyzes trends, patterns, and sentiment from the feedback data.     |


### Use case Put in order - FR20

| Actors Involved   | User                                                            |
|-------------------|---------------------------------------------------------------: |
| Precondition      | Users have not put in orders                                    |
| Post condition    |                                                                 |
| Nominal Scenario  | PIO1(User purchases)                                            |
| Variants          |                                                                 |
| Exceptions        | PIO2(Invalid Order)                                             | 

## Scenario: PIO1

|  Scenario PIO1 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Users have not put in orders                                               |
| Post condition | Users have put in orders successfully                                      |
|     Step#      |                                Description                                 |
|       1        |  Users: Put products in orders                                             | 
|       2        |  System: Check products if it is in stock, it is in                        |
|       3        |  System: submit order                                                      |
|       4        |  System: give feedback                                                     |
|       5        |  Users: Pay                                                                |

## Scenario: PIO2

|  Scenario PIO2 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Users have not put in orders                                               |
| Post condition |  Users have put in orders unsuccessfully                                   |
|     Step#      |                                Description                                 |
|       1        |  Users: Put products in orders                                             |
|       2        |  System: Check products if it is in stock, it is not in                    |
|       3        |  System: Cancel order                                                      |
|       4        |  System: give feedback                                                     |


### Use case Order view - FR20

| Actors Involved  |  User                                                                |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Users have not put in orders                                         |
|  Post condition  |                                                                      |
| Nominal Scenario |  OV1(User check order information)                                    |
|     Variants     |  OV2(delete order)                                                   |
|    Exceptions    |  OV3(delete unsuccessfully )                                         |

##### Scenario OV1

|  Scenario  OV1 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Users have  put in orders                                                  |
| Post condition |                                                                            |
|     Step#      |                                Description                                 |
|       1        |  Users: chose to view order                                                |
|       2        |  System: search order information                                          |
|       3        |  System: turn back user order informaiton                                  |

##### Scenario OV2

|  Scenario OV2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Users have  put in orders                                                  |
| Post condition |                                                                            |
|     Step#      |                                Description                                 |
|       1        |  Users: Chose to view order                                                |
|       2        |  System: Search order information                                          |
|       3        |  System: Turn back user order informaiton                                  |
|       4        |  Users: Delete order                                                       |
|       5        |  System: Check if it in shipping process, it is not                        |
|       6        |  System: Submit apply                                                      |
|       7        |  System: Give feedback                                                     |

##### Scenario OV3

|  Scenario OV3   |                                                                             |
| :------------:  | :-------------------------------------------------------------------------: |
|  Precondition   | Users have  put in orders                                                   |
| Post condition  |                                                                             |
|     Step#       |                                Description                                  |
|       1         |  Users: Chose to view order                                                 |
|       2         |  System: Search order information                                           |
|       3         |  System: Turn back user order informaiton                                   |
|       4         |  Users: Delete order                                                        |
|       5         |  System: Check if it in shipping process, it is in                          |
|       6         |  System: Reject the apply                                                   |
|       7         |  System: Give feedback                                                      | 

### Use case Order process - FR20

| Actors Involved  |  Regulator                                                           |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | receive order information                                            |
|  Post condition  |                                                                      |
| Nominal Scenario | OP1(Confirm order )                                                  |
|     Variants     |                                                                      |
|    Exceptions    |                                                                      |

##### Scenario OP1

|  Scenario OP1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Receive order information                                                  |
| Post condition |                                                                            |
|     Step#      |                                Description                                 |
|       1        |  Regulator: Receive order information                                      |
|       2        |  Regulator: Change inventory list                                          |
|       3        |  System: Save change information                                           |
|       4        |  System: Give feedback                                                     |



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

[![GlossaryV2](https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/tree/s320340-main-patch-53761/DiagramsV2/GlossaryV2.png)](#)

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>
User
  - Individual who can see and purchase products(customer) or manage an electronic shop(manager)
Product 
  - Electronic item characterized by a model, category, details, arrivalDate.   
Account
  - Identification data that characterize a user
Cart  
  - List of products that a user is willing to buy 
Premium account
  - Account belonging to a customer who pays a subscription. A premium account has no shipment fee and faster shipment.
Order
  - List of products that the user has purchased and is awaiting delivery 
User feedback
  - Refers to input and opinions shared by users about a product, service, or system, helping to gauge satisfaction, identify areas for improvement, and make informed decisions.


# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >
[![Deployment_DiagramV2](https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/tree/s320340-main-patch-53761/DiagramsV2/Deployment_DiagramV2.png)](#)
