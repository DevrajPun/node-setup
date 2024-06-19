const CategoryModel = require("../Models/category");
const CourseModel = require("../Models/course");
// const AdminModel = require("../Models/admin")
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dow1049t2",
  api_key: "236951961576272",
  api_secret: "ZbVMnBG57_91moF2bDAvTtks9r4",
});

class CourseController {
  static insert = async (req, res) => {
    try {
      //console.log(req.body);
      const { name, description, duration, category, price, instructor, rating, skill_level, language, lectures } = req.body;
      //console.log(req.body)
      const file = req.files.image;
      // console.log(req.body.name)
      //image upload cloudinary
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      const result = new CourseModel({
        name: name,
        description: description,
        duration: duration,
        category: category,
        price: price,
        instructor: instructor,
        rating: rating,
        skill_level: skill_level,
        language: language,
        lectures: lectures,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      //console.log(result)
      await result.save();
      res.redirect("/course/dispaly");
    } catch (error) {
      console.log(error);
    }
  };
  static display = async (req, res) => {
    try {
      const { name, description, duration, price, image, category } = req.data
      const data = await CourseModel.find()
      const cate = await CategoryModel.find()

      res.render("admin/course/display", { name: name, image: image, description: description, duration: duration, price: price, category: category, D: data, c: cate })
    }
    catch (error) {
      console.log(error)
    }
  }
  static view = async (req, res) => {
    try {
      const { name, description, duration, price, category, image } = req.data;
      const data = await CourseModel.findById(req.params.id);
      res.render("admin/course/view", {
        name: name, description: description, duration: duration, price: price, image: image, category: category, D: data
      });
    } catch (error) {
      console.log(error);
    }
  };
  static edit = async (req, res) => {
    try {
      const { name, description, duration, price, category, image } = req.data;
      const data = await CourseModel.findById(req.params.id)
      const cate = await CategoryModel.find()
      res.render("admin/course/edit", { name: name, description: description, duration: duration, price: price, image: image, category: category, D: data, c: cate })
    }
    catch (error) {
      console.log(error)
    }
  }
  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, duration, category, price } = req.body;
      let data = { name, description, duration, category, price };

      // Check if an image file is provided
      if (req.files && req.files.image) {
        // Find the course by ID to get the old image public ID
        const course = await CourseModel.findById(id);
        const imageID = course.image.public_id;

        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(imageID);

        // Upload the new image
        const imageFile = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "userprofile" });

        // Add image details to the data object
        data.image = {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        };
      }

      // Update the course with the new data
      await CourseModel.findByIdAndUpdate(id, data);

      // Flash success message and redirect
      req.flash("success", "Course updated successfully");
      res.redirect("/course/dispaly");
    } catch (error) {
      console.error('Error updating course:', error);
      req.flash("error", "Error updating course");
      res.redirect("/course/edit/" + id);
    }
  };
  static delete = async (req, res) => {
    try {
      await CourseModel.findByIdAndDelete(req.params.id);
      res.redirect("/course/dispaly");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = CourseController