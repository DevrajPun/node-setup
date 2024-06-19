const AdminModel = require("../Models/admin");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CheckUseAuth = require("../Middleware/Auth");
const CourseModel = require("../Models/course");
const CategoryModel = require("../Models/category")

cloudinary.config({
  cloud_name: "dow1049t2",
  api_key: "236951961576272",
  api_secret: "ZbVMnBG57_91moF2bDAvTtks9r4",
});

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("Success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static registration = async (req, res) => {
    try {
      res.render("registration", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static insertUser = async (req, res) => {
    try {
      //console.log(req.files.images)
      const file = req.files.image;
      //image upload cloudinary
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(req.body);
      const { name, email, password, conPassword } = req.body;
      const user = await AdminModel.findOne({ email: email });
      if (user) {
        req.flash("error", "Email Already exists");
        res.redirect("/registration");
        //console.log(user);
      } else {
        if (name && email && password && conPassword) {
          if (password == conPassword) {
            const hashPassword = await bcrypt.hash(password, 10);
            const result = new AdminModel({
              name: name,
              email: email,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            await result.save();
            req.flash("Success", "Register success! plz Login");
            res.redirect("/login"); //url
          } else {
            req.flash("error", "Password not Match.");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All fields are required.");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static verifylogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      const user = await AdminModel.findOne({ email: email });
      // console.log(user);
      if (user != null) {
        const ismatch = await bcrypt.compare(password, user.password);
        // console.log(ismatch);
        if (ismatch) {
          const token = jwt.sign({ ID: user._id }, "kuchbilikhsktehai");
          //console.log(token);
          res.cookie("token", token);
          res.redirect("/admin/dashboard");
        } else {
          req.flash("error", "Email or password is not match.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not registered user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static home = async (req, res) => {
    try {
      const course = await CourseModel.find()
      res.render("home", { c: course })
    } catch (error) {
      console.log(error)
    }
  }
  static about = async (req, res) => {
    try {
      res.render("about")
    } catch (error) {
      console.log(error)
    }
  }
  static contact = async (req, res) => {
    try {
      res.render("contact")
    } catch (error) {
      console.log(error)
    }
  }
  static course = async (req, res) => {
    try {
      const category = await CourseModel.find()
      res.render("course", { ca: category })
    } catch (error) {
      console.log(error)
    }
  }
  static detail = async (req, res) => {
    try {
      const user = await AdminModel.findById(req.params.id)
      const detail = await CourseModel.findById(req.params.id)
      const category = await CategoryModel.find()
      const course = await CourseModel.find()
      res.render("detail", { u: user, d: detail, ca: category, c: course })
    } catch (error) {
      console.log(error)
    }
  }

}

module.exports = FrontController;
