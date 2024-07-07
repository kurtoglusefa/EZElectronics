# Project Estimation - CURRENT
Date: 29/04/2024

Version:1 


# Estimation approach
Consider the EZElectronics  project in CURRENT version (as given by the teachers), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch
# Estimate by size
### 
|                                                                                                         |  Estimate                       |             
| ------------------------------------------------------------------------------------------------------: | ------------------------------: |  
| NC =  Estimated number of classes to be developed                                                       |   25                            |             
|  A = Estimated average size per class, in LOC                                                           |   300                           | 
| S = Estimated size of project, in LOC (= NC * A)                                                        |   7500                          |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)                    |   750                           |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                                     |   22.500                        |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |   5                             |               

# Estimate by product decomposition
### 
| component name         |   Estimated effort (person hours)  |             
| ---------------------: | ---------------------------------: | 
| requirement document   |   20                               |
| GUI prototype          |   30                               |
| design document        |   40                               |
| code                   |   450                              |
| unit tests             |   100                              |
| api tests              |   50                               |
| management documents   |   60                               |



# Estimate by activity decomposition     
### 
|         Activity name                 | Estimated effort (person hours)   |             
| ------------------------------------: | ------------------------------:   | 
| Requirement document:                 | 30                                |
| Analyzing requirements                |       10                          |        
| Writing and reviewing document        |       20                          |
| GUI Prototype:                        | 40                                |
| Designing GUI mockups                 |       25                          |
| Iterative revisions based on feedback |       15                          |
| Design document:                      | 50                                |    
| Architectural design                  |       35                          |
| Database schema design                |       15                          |  
| Code:                                 | 450                               |
| Implementing frontend features        |       165                         |
| Implementing backend features         |       175                         |
| Integrating frontend and backend      |       65                          |
| Code reviews and revisions            |       45                          |
| Unit Tests:                           | 100                               |
| Writing unit test cases               |       50                          |
| Executing unit tests                  |       30                          |
| Debugging and fixing issues           |       20                          |
| API Tests:                            | 50                                |
| Writing API test cases                |       30                          |    
| Executing API tests                   |       8                           |
| Debugging and fixing issues           |       12                          |
| Management Documents:                 | 60                                |
| Project planning                      |       40                          |
| Progress tracking and reporting       |       20                          |

###
Insert here Gantt chart with above activities

[![Gantt_Chart](https://git-softeng.polito.it/se-2023-24/group-eng-10/ezelectronics/-/tree/s320340-main-patch-53761/DiagramsV1/Gantt_Chart_.pdf)](#)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|                                    | Estimated effort                 |   Estimated duration |          
| ---------------------------------: | ------------------------------:  |  ---------------     |
| estimate by size                   | 750 hours                        |   5 weeks            |
| estimate by product decomposition  | 750 hours                        |   5 weeks            | 
| estimate by activity decomposition | 780 hours                        |   16 weeks           |

The estimations may differ because they consider different level of granularities: the estimation by activity decomposition breaks down the effort into smaller components and it should be more precise


