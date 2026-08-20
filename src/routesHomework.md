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