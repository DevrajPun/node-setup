const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/CourseDataBase";
const LiveUrl = "mongodb+srv://devrajpunthapa:Devraj1925@cluster0.p6zgbgr.mongodb.net/CourseDataBase?retryWrites=true&w=majority&appName=Cluster0";
const connectdb = () => {
  return mongoose
    .connect(LiveUrl)
    .then(() => {
      console.log("Connected Succeessfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectdb;
