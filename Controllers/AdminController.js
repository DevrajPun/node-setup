const AdminModel = require("../Models/admin");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");

cloudinary.config({
  cloud_name: "dow1049t2",
  api_key: "236951961576272",
  api_secret: "ZbVMnBG57_91moF2bDAvTtks9r4",
});

class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, image, email } = req.data;
      const data = await AdminModel.find()
      res.render("admin/dashboard", {
        name: name,
        image: image,
        email: email,
        D: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static adminProfile = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("admin/adminProfile", { name: name, email: email, image: image });
    } catch (error) {
      console.log(error);
    }
  }

  static profileUpdate = async (req, res) => {
    try {
      const { id } = req.data;
      const { name, email } = req.body;
      if (req.files) {
        const user = await AdminModel.findById(id);
        const imageID = user.image.public_id;
        //console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await AdminModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.data;
      //console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await AdminModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/admin/adiminProfile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/admin/adminProfile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await AdminModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/admin/dashboard");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
}


module.exports = AdminController;
