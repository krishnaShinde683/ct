
const express = require("express")
const bodyparser = require('body-parser')
const app = express()
const cors = require("cors");
const path = require("path");
const EnvConfig = require("./app/config/config");
require("./app/config/db_config");//db connnection

app.use(bodyparser.json({ limit: "100mb" }));
app.use(bodyparser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
let corsOptions = {
    origin: ["http://localhost:3500"]
}
app.use(cors(corsOptions));
let port = EnvConfig.PORT

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/", require("./app/route"))

app.listen(3500, () => {
    console.log(`server started on ${port}`);
})