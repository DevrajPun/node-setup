const express = require("express");
const FrontController = require("../Controllers/FrontControllers");
const AdminController = require("../Controllers/AdminController");
const CategoryController = require("../Controllers/CategoryController");
const CourseController = require("../Controllers/CourseController");
const CheckUseAuth = require("../Middleware/Auth");
const route = express.Router();

//FrontController
route.get("/login", FrontController.login);
route.get("/registration", FrontController.registration);
route.post("/userInsert", FrontController.insertUser);
route.post("/verifyLogin", FrontController.verifylogin);
route.get("/logout", FrontController.logout);
route.get("/", FrontController.home);
route.get("/about", FrontController.about);
route.get("/contact", FrontController.contact);
route.get("/course", FrontController.course);
route.get("/detail/:id", FrontController.detail);

// admin part
route.get("/admin/dashboard", CheckUseAuth, AdminController.dashboard);
route.get("/admin/category/display", CheckUseAuth, CategoryController.display);
route.post("/admin/categoryinsert", CheckUseAuth, CategoryController.categoryinsert);
route.get("/admin/category/view/:id", CheckUseAuth, CategoryController.categoryview);
route.get("/admin/category/edit/:id", CheckUseAuth, CategoryController.categoryedit);
route.post("/admin/category/update/:id", CheckUseAuth, CategoryController.categoryupdate);
route.get("/category/delete/:id", CheckUseAuth, CategoryController.categorydelete);
// admin profile update
route.get("/admin/adminProfile", CheckUseAuth, AdminController.adminProfile)
route.post("/updateProfile", CheckUseAuth, AdminController.profileUpdate)
route.post("/changePassword", CheckUseAuth, AdminController.changePassword)

// course routes
route.post("/course/insert", CheckUseAuth, CourseController.insert)
route.get("/course/dispaly", CheckUseAuth, CourseController.display)
route.get("/course/view/:id", CheckUseAuth, CourseController.view)
route.get("/course/edit/:id", CheckUseAuth, CourseController.edit)
route.post("/course/update/:id", CheckUseAuth, CourseController.update)
route.get("/course/delete/:id", CheckUseAuth, CourseController.delete)



module.exports = route;
