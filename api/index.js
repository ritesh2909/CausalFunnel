const express = require("express");
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
var cors = require('cors')
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");

const app = express();


app.use(express.json());
app.use(cors());
app.use("/images",express.static(path.join(__dirname,"/images")));

mongoose.connect("mongodb+srv://ritesh:ritesh@cluster0.6n7yh.mongodb.net/?retryWrites=true&w=majority")
    .then(console.log("connected to DB"))
    .catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage: storage});

app.post("/api/upload", upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded");
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoriesRoute);


app.listen("8000", () => {
    console.log("server started");
})