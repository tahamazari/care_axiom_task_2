var express = require("express");
var app = express();
const routes = require('./routes/api');

app.use('/', routes)

app.listen(3000, () => {
 console.log("Server running on port 3000");
});
