🏆 Sports Scheduler
===================

A full-stack web application for **scheduling, discovering, joining, and managing sports sessions** with separate **Player** and **Admin** roles.

🌐 **Live Demo:** [https://sports-scheduler-self.vercel.app/](https://sports-scheduler-self.vercel.app/)

✨ Features
----------

### 🔐 Authentication

*   Player and Admin registration/login
    
*   Secure password hashing with **bcrypt**
    
*   Session-based authentication
    
*   Role-based access control
    
*   Protected routes
    
*   Logout functionality
    
*   Automatic redirect to /login
    

### 👤 Player

*   Player dashboard
    
*   Create sports sessions
    
*   Browse available sessions
    
*   View session details
    
*   Join sessions
    
*   Manage joined sessions
    
*   View completed/cancelled sessions
    
*   Cancel created sessions
    

### 🛡️ Admin

*   Manage sports
    
*   Add and edit sports
    
*   Prevent duplicate sports
    
*   View activity reports
    
*   Generate reports using date ranges
    

### 📅 Session Management

Users can create sessions with:

*   Sport
    
*   Date & time
    
*   Venue
    
*   Required additional players
    

The system validates session dates, participation limits, duplicate joining, ownership, and session status.

🧑‍💻 Tech Stack
----------------

TechnologyUsageNode.jsRuntimeExpress.jsBackendEJSTemplate EngineMongoDBDatabaseMongooseMongoDB ODMExpress SessionAuthenticationbcryptPassword SecuritydotenvEnvironment VariablesHTML / CSSFrontendVercelDeployment

🏗️ Project Structure
---------------------

 Sports-Scheduler/  
 │  
 ├── config/  
 ├── controllers/  
 ├── middleware/  
 ├── models/  
 ├── routes/  
 ├── views/  
 ├── public/  
 │   └── css/  
 │  
 ├── server.js  
 ├── package.json  
 ├── vercel.json  
 └── README.md   `

The project follows a **Route → Controller → Model** architecture, with middleware handling authentication and authorization.

🗄️ Data Models
---------------

### User

 User  
 ├── name  
 ├── email  
 ├── password  
 ├── role  
 └── timestamps   `

Roles:

*   player
    
*   admin
    

### Sport

Sport  
├── name  
├── createdBy  
└── timestamps   `

### Sport Session

Stores:

*   Sport
    
*   Creator
    
*   Date & time
    
*   Venue
    
*   Required players
    
*   Participants
    
*   Session status
    

Supported states include **active, completed, and cancelled**.

🔒 Security
-----------

*   Passwords are hashed using bcrypt.
    
*   Authentication is maintained using Express Sessions.
    
*   Protected routes require authentication.
    
*   Admin routes require administrator privileges.
    
const hashedPassword = await bcrypt.hash(password, 10);   `
   

🛠️ Future Improvements
-----------------------

*   Email notifications
    
*   Calendar integration
    
*   Session search and filtering
    
*   Advanced analytics
    
*   Tournament management
    
*   Real-time updates
    
*   Team formation
    
*   Automated testing
    

⭐ If you find this project useful, consider giving the repository a star.
