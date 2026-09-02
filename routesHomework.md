const express = require('express');
const app = express();

// ============================================
// 1. STATIC ROUTE (fixed path, no variables)
// ============================================
app.get("/user", (req, res) => {
    res.send("Static route - fixed path");
});

// ============================================
// 2. DYNAMIC ROUTE PARAMS (: colon syntax)
// URL: /user/101 → req.params = { userId: '101' }
// ============================================
app.get("/user/:userId", (req, res) => {
    console.log(req.params); // { userId: '101' }
    res.send(`User ID is: ${req.params.userId}`);
});

// ============================================
// 3. MULTIPLE DYNAMIC PARAMS
// URL: /user/101/orders/55 → { userId: '101', orderId: '55' }
// ============================================
app.get("/user/:userId/orders/:orderId", (req, res) => {
    console.log(req.params); // { userId: '101', orderId: '55' }
    res.send(req.params);
});

// ============================================
// 4. OPTIONAL PARAMS (? after param name)
// Matches both /user AND /user/101
// ============================================
app.get("/user/:userId?", (req, res) => {
    if (req.params.userId) {
        res.send(`User ID: ${req.params.userId}`);
    } else {
        res.send("No user ID provided");
    }
});

// ============================================
// 5. QUERY PARAMS (?key=value, separate from req.params)
// URL: /search?name=sourabh&age=22 → req.query = { name: 'sourabh', age: '22' }
// ============================================
app.get("/search", (req, res) => {
    console.log(req.query); // { name: 'sourabh', age: '22' }
    res.send(req.query);
});

// ============================================
// 6. REGEX-BASED ROUTE (advanced pattern matching)
// Matches paths ending in "fly" — like /butterfly, /dragonfly
// ============================================
app.get(/.*fly$/, (req, res) => {
    res.send("Matched route ending with 'fly'");
});

// ============================================
// 7. REGEX WITH SPECIFIC CHARACTER SET
// Matches /abc, /abd, /abe (only a, b then c/d/e)
// ============================================
app.get("/ab[cde]", (req, res) => {
    res.send("Matched ab followed by c, d, or e");
});

// ============================================
// 8. WILDCARD (matches everything after a point)
// URL: /files/anything/here → catches it all
// ============================================
app.get("/files/*", (req, res) => {
    res.send("Wildcard route matched");
});

// ============================================
// 9. app.all() — matches ALL HTTP methods on a path
// GET, POST, PUT, DELETE all trigger this
// ============================================
app.all("/secure", (req, res) => {
    res.send(`Matched with method: ${req.method}`);
});

// ============================================
// 10. HTTP METHOD VARIATIONS
// ============================================
app.get("/data", (req, res) => res.send("GET request"));
app.post("/data", (req, res) => res.send("POST request"));
app.put("/data", (req, res) => res.send("PUT request"));
app.delete("/data", (req, res) => res.send("DELETE request"));
app.patch("/data", (req, res) => res.send("PATCH request"));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




// episode 5
 1. multiple route handler
"Route handler" simple matlab hai: wo function jo chalta hai jab koi specific URL/route pe request aati hai.

 2. next()
 3.next fun and errors along with res.send()
 4.app.use("/route)


 5. middleware vs route

 1. Middleware — app.use("/", ...)


app.use("/", (req, res, next) => {
    console.log("Request received at / - Middleware");
    res.send("Middleware executed");
    next(); 
})
Ise middleware isliye kehte hain kyunki:
app.use() se define hua hai (middleware register karne ka standard tareeka)
broad/generic path ("/") pe lagta hai — matlab har request pe potentially chal sakta hai, chahe koi bhi specific route ho
Iska kaam usually cross-cutting concerns hote hain — jaise logging, auth check, request modify karna — jo request ke "beech mein" chalte hain, final response se pehle
Naam se hi pata chalta hai: "middle" + "ware" = jo beech mein baithke request ko process karta hai, before it reaches the actual destination

2. Route Handler — app.get("/users", ...)

app.get("/users",
    (req, res, next) => {
        console.log("Request received at /users - Handler 2");
        next();
    },
);
Ise route handler isliye kehte hain kyunki:
app.get() se define hua hai — specific HTTP method + specific path ke liye
Ek particular route (/users) ko target karta hai, generic nahi
Iska kaam usually us specific route ka actual business logic hota hai — data fetch karna, response bhejna, waghera

Sabse important baat samajhna:

Technically dono ek jaisa function signature use karte hain (req, res, next), aur Express internally dono ko "middleware functions" hi kehta hai (Express docs mein bhi ye term milega). Farak sirf terminology/intent ka hai:

app.use() se generic, broad-scope function → hum use "middleware" kehte hain
app.get()/post()/etc. se specific route pe attached function → hum use "route handler" kehte hain

Simple way to remember:

	Middleware	Route Handler
Defined by	app.use()	app.get(), app.post(), etc.
Scope	Broad (matches many/all paths)	Specific (ek particular route + method)
Purpose	Logging, auth, common processing	Actual business logic for that route
Runs for	Multiple/all routes	Only that specific route + method

Tumhare code mein:

app.use("/", ...) → Middleware (kyunki har request isse guzarta hai, chahe /users ho ya kuch aur — jaisa humne pichle message mein dekha)
Dono app.get("/users", ...) wale functions → Route handlers (kyunki specifically /users GET request ke liye hain)

Yehi wajah hai ki jab tum /users hit karte ho, pehle middleware chalta hai (broad match), phir agar next() call ho toh route handlers chalte hain (specific match) — order tumhare code mein position (top-to-bottom) se decide hota hai, naam se nahi.





Middleware ka use samajhne ke liye pehle ye socho: agar middleware na ho, toh kya problem aati?

Problem without middleware:

Socho tumhare paas 10 routes hain — /profile, /orders, /settings, /messages waghera. Har route pe tumhe check karna hai ki user logged in hai ya nahi. Bina middleware ke, tumhe har single route handler ke andar same auth-check code baar-baar copy-paste karna padega:













Real-world use cases jahan middleware use hota hai (ye sab tu DevTinder mein banayega):

Authentication check — user logged in hai ya nahi (JWT token verify karna)
Logging — har request ka URL, method, time console/file mein log karna (debugging ke liye)
Data validation/sanitization — request body mein galat/harmful data toh nahi (Episode-08 mein cover hoga)
Body parsing — express.json() khud ek middleware hai jo incoming JSON body ko parse karke req.body mein daal deta hai
CORS handling — kaunsi domains se request allow karni hai
Error handling — agar kahin error aaye, use centrally catch karna
Rate limiting — ek user kitni requests bhej sakta hai time limit mein (tune Auth System mein ye already implement kiya tha)










Chalo middleware likhne ke different patterns dekhte hain — jo tumhare code mein hai (separate file) se lekar advanced patterns tak, jo real projects mein use hote hain.

1. Inline Middleware (jo humne shuru mein kiya tha)
javascript
app.use("/admin", (req, res, next) => {
    console.log("Inline middleware");
    next();
});
Kab use: Chhoti, one-off logic ke liye — reusable nahi karna ho.

2. Separate File Middleware (jaisa tumne abhi likha — best practice)
javascript
// middlewares/auth.js
const adminAuth = (req, res, next) => {
    const token = "xyz";
    if (token !== "xyz") {
        return res.status(401).send("Unauthorized");
    }
    next();
};

module.exports = { adminAuth };
Kab use: Reusable logic, clean code, multiple files mein import karna ho. Ye standard/production pattern hai.

3. Middleware Factory (Parameterized Middleware) — bahut powerful pattern
Jab middleware ko dynamic behavior chahiye, ek function banao jo middleware return kare:

javascript
// middlewares/auth.js
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.headers["x-user-role"]; // example
        if (userRole !== requiredRole) {
            return res.status(403).send(`Only ${requiredRole} allowed`);
        }
        next();
    };
};

module.exports = { checkRole };
Use karte waqt:

javascript
app.use("/admin", checkRole("admin"));
app.use("/moderator", checkRole("moderator"));
Kab use: Ek hi middleware logic, but different parameters ke saath multiple jagah use karna ho — jaise role-based access, rate-limit thresholds, etc.

4. Class-based Middleware
javascript
// middlewares/AuthMiddleware.js
class AuthMiddleware {
    static adminAuth(req, res, next) {
        const token = "xyz";
        if (token !== "xyz") {
            return res.status(401).send("Unauthorized");
        }
        next();
    }

    static userAuth(req, res, next) {
        // logic
        next();
    }
}

module.exports = AuthMiddleware;
Use karte waqt:

javascript
const AuthMiddleware = require("./middlewares/AuthMiddleware");
app.use("/admin", AuthMiddleware.adminAuth);
Kab use: Bade projects mein jab related middlewares ko group/organize karna ho (OOP style). Tumhare company project (jo tumne upload kiya tha) mein bhi VerifyToken, SanitizeMiddleware jaise separate modules the — usi pattern ka extension hai.

5. Async Middleware (jab DB call ya API call karni ho)
javascript
const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = await User.findOne({ token }); // DB call - async
        
        if (!user) {
            return res.status(401).send("Invalid token");
        }
        
        req.user = user; // request mein data attach karo, next handler use karega
        next();
    } catch (err) {
        next(err); // error ko error-handling middleware tak pass karo
    }
};
Kab use: Jab middleware ke andar database query ya await wala kaam ho — jaise JWT verify karke DB se user check karna (exactly ye tum Episode-10 mein banaoge).

6. Error-Handling Middleware (4 parameters — special type)
javascript
// Ye Express automatically pehchanta hai kyunki 4 params hain (err sabse pehle)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
Kab use: Poore app mein kahin bhi error aaye, use centrally catch karne ke liye. Hamesha sabse last mein likhte hain saare routes ke baad. Tumhare company project ke server.js mein exactly ye pattern tha (global error handler).

7. Multiple Middlewares Chain (array form)
javascript
const middlewares = [adminAuth, logRequest, validateData];

app.get("/admin/data", middlewares, (req, res) => {
    res.send("Data");
});
Ya direct array pass:

javascript
app.get("/admin/data", [adminAuth, logRequest], (req, res) => {
    res.send("Data");
});
Kab use: Jab ek route pe kai saare middlewares chahiye ho aur unhe organize/readable rakhna ho.

8. Conditional Middleware (kabhi apply ho, kabhi nahi)
javascript
const conditionalAuth = (req, res, next) => {
    if (req.path.startsWith("/public")) {
        return next(); // skip auth for public routes
    }
    adminAuth(req, res, next); // baaki sab pe auth lagao
};
Kab use: Jab kuch routes ko middleware skip karna ho baaki sab pe apply karte waqt.

9. Third-party Middleware (already-made, npm se install)
javascript
const helmet = require("helmet");
const cors = require("cors");

app.use(helmet());  // security headers
app.use(cors());    // cross-origin requests allow
Kab use: Common problems (security, CORS, logging, compression) ke liye khud se likhne ki zarurat nahi — tumhare company project mein helmet, cors, hpp, compression sab yahi pattern hain.

Quick comparison table:
Pattern	Best For
Inline	Quick, one-time logic
Separate file	Reusable, clean (tumhara current pattern)
Factory (parameterized)	Same logic, different config (role checks)
Class-based	Organizing many related middlewares
Async	DB/API calls inside middleware
Error-handling (4 params)	Centralized error catching
Array/chain	Multiple middlewares on one route
Conditional	Skip logic for specific paths
Third-party	Common problems (security, CORS) already solved
Tumhare DevTinder project ke liye recommendation:
Abhi jo tumne likha hai (Pattern 2 — separate file) sahi direction hai. Jaise-jaise aage badhoge (Episode-10 JWT wala), tumhe Pattern 5 (async middleware) ki zarurat padegi kyunki token verify karne ke liye DB call karni padegi. Aur end mein Pattern 6 (error-handling) bhi add karna best practice hoga — jaisa tumhare company project mein already hai.

Chaaho toh main tumhare current auth.js ko Factory pattern mein convert karke dikha doon (taaki adminAuth/userAuth dono ek hi reusable function se ban jayein)?


const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("../middlewares/auth");

// Handle Auth Middleware for all GET POST,... requests
app.use("/admin", adminAuth);
//app.use("/users", userAuth);


app.get("/user",  userAuth ,(req, res) => {
    res.send("All Users Sent");
});

app.post("/user/login", (req, res) => {
    res.send("User Logged In");
});



app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});



//  ################## ERROR HANDLING ##################

Controller/middleware level
try/catch me error pakda jata hai. Kuch files me error ko central handler ke liye forward kiya gaya hai:

Global Express error handler
server.js me routes ke baad ye handler hai:

Ye:

Mobile request ke liye ErrorCode: 500 return karta hai
Agar response already send ho chuka ho, next(err) karta hai
Development me err.stack return karta hai
Production me sirf err.message return karta hai
DatabaseError ke liye generic message return karta hai
Error ko logger.error() se log karta hai
Default HTTP status 500 bhejta hai
Response example:


Unhandled Promise errors

Agar promise reject ho aur kahin catch na ho, yahan log hota hai.

Uncaught synchronous errors

Agar unexpected synchronous exception aaye, yahan log hota hai.

Logs Logger.js ke through logs folder me likhe jate hain:

combined.log
error.log
exceptions.log
Console output
Important: Global handler tabhi chalega jab controller/middleware next(error) kare. Isliye har async controller me proper pattern hona chahiye:


Abhi initialization error, jaise database ya secrets fail hona, bottom ke IIFE me sirf log hota hai:


Lekin process explicitly exit nahi hota. Production ke liye is jagah process.exit(1) consider karna chahiy


- Multiple Route Handlers - Play with the code
- next()
- next function and errors along with res.send()
- app.use("/route", fn1, fn2, fn3, fn4, fn5)
- What is a Middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/", (err, req, res, next) => {})

# 6 Database, Schema & Models | Mongoose

- Create a free cluster on MongoDB official website (Mongo Atlas)
- Install mongoose
- Connect your application to the database "Connection-url"/devtinder
- Call the connectDB function and connect to database in your starting application
- Create a userSchema & user Model
- Create POST /signup API to add data to database
- Push some documents using API calls from postman

 # // 7 
- diff between js and json
- Add the express.json() middleware to your app
- Make your signup API dynamic to receive data from the end user
- User.findOne() with duplicate email ID, which object returned
- API — Get user by email ID
- API — Feed API — GET /feed — get all the users from the database
- API — Get user by ID
- Create a delete user API
- Difference between PATCH and PUT
- API — Update a user
- Explore the Mongoose Documentation for Model methods
- What are the options in a Model.findOneAndUpdate() method, explore more about it
- Explore schema type options from the documentation
- Add: required, unique, lowercase, min, max, trim
- Add default
- Create a custom validate function for [some field]
- Improve the DB schema — put all appropriate - - - validations on each field in Schema
- add timesamp to userSchema
- add api level validion on patch req an signp post api
- data sanitizing - add api validation for each fielld
- install validation
- explore validator libary fun nd us for pass emaail  and other req thngs
- NEVER TRUST REQ BODY

 # Episode-09 | Encrypting Passwords 
- validate data in signup api
- install bcrypt pakage
- create a pass hash usin bcrypt.hash
- save user with encreypted password 
- 

 # Episode-10 | Authentication, JWT & Cookies -1
- Install cookie-parser
- Just send a dummy cookie to user
- Create GET /profile API and check if you get the cookie back
- Install jsonwebtoken
- In login API, after email and password validation, create    a    JWT token and send it to user
- Read the cookies inside your profile API and find the logged in user
- userAuth middleware
- Add the userAuth middle ware in profile api and sendConnectionRequest api
- send the api of jwt token and cookies to 7 days

- create  user shehema method  to getjwt()
- creaate userSchema method to comparepasword(passwordInptByUser)
- 



User signs up with name, email, password
→ app.js signup route

Password is hashed before saving
→ bcrypt.hash(password, 10)

User logs in with email and password
→ /login route in app.js

App checks whether the password is correct using bcrypt
→ bcrypt.compare(...) in user.js

If correct, app creates a JWT token containing the user’s id
→ jwt.sign({ id: user._id }, ...) in user.js

That token is saved in a cookie
→ res.cookie("token", token, ...) in app.js

Then a protected route like profile is accessed only if the token is valid
→ middleware in auth.js


# Episode-11 | Diving into the APIs and express Router

- explore tinder apis
- create a list all api you can think in dev tinder
- group multiplle routes under res routers