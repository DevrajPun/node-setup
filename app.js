const express = require("express");
const app = express();
const port = 4000;
const route = require("./routes/path");
const connectdb = require("./DataBase/DBconnection");
const cookieParse = require("cookie-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

//connect flash and session
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
//get token
app.use(cookieParse());

//tempfile uploader
app.use(fileUpload({ useTempFiles: true }));

connectdb();

//set ejs file to render html files
app.set("view engine", "ejs");

//set image nd css
app.use(express.static("public"));

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", route);

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
