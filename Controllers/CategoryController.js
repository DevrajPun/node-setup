const CategoryModel = require("../Models/category");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dow1049t2",
  api_key: "236951961576272",
  api_secret: "ZbVMnBG57_91moF2bDAvTtks9r4",
});

class CategoryController {

  static display = async (req, res) => {
    try {
      const { name, image } = req.data;
      const data = await CategoryModel.find();
      res.render("admin/category/display", {
        name: name,
        image: image,
        D: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static categoryinsert = async (req, res) => {
    try {
      //console.log(req.body);
      // const { id } = req.body;
      const { name } = req.body;
      //console.log(req.body)
      const file = req.files.image;
      // console.log(req.body.name)
      //image upload cloudinary
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      const result = new CategoryModel({
        name: name,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      //console.log(result)
      await result.save();
      res.redirect("/admin/category/display");
    } catch (error) {
      console.log(error);
    }
  };

  static categoryview = async (req, res) => {
    try {
      const { name, image, email } = req.data;
      const data = await CategoryModel.findById(req.params.id);
      res.render("admin/category/view", {
        name: name,
        image: image,
        D: data,
      });
    } catch (error) {
      console.log(error);
    }
  };


  static categoryedit = async (req, res) => {
    try {
      const { name, image } = req.data;
      const data = await CategoryModel.findById(req.params.id);
      //console.log(data);
      res.render("admin/category/edit", { name: name, image: image, D: data });
    } catch (error) { }
  };

  static categoryupdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let data = { name };

      if (req.files && req.files.image) {
        const user = await CategoryModel.findById(id);
        const imageID = user.image.public_id;

        // Deleting the old image from Cloudinary
        await cloudinary.uploader.destroy(imageID);

        // Uploading the new image
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          { folder: "userprofile" }
        );

        // Adding image details to the data object
        data.image = {
          public_id: imageupload.public_id,
          url: imageupload.secure_url,
        };
      }

      // Updating the category with the new data
      await CategoryModel.findByIdAndUpdate(id, data);

      // Flash success message and redirect
      req.flash("success", "Category updated successfully");
      res.redirect("/admin/category/display");
    } catch (error) {
      console.log(error);
      req.flash("error", "Error updating category");
      res.redirect("/admin/category/display");
    }
  };


  static categorydelete = async (req, res) => {
    try {
      await CategoryModel.findByIdAndDelete(req.params.id);
      res.redirect("/admin/category/display");
    } catch (error) {
      console.log(error);
    }
  };

}

module.exports = CategoryController;
