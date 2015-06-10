var models = require('../models');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

router.get('/:user_id/profile-photos', function (req, res) {
  models.UserProfilePhoto.findAll()
    .then(function (userProfilePhotos) {
      res.json(userProfilePhotos);
    });
});

router.post('/:user_id/profile-photos', [
  multer(),
  function (req, res) {
    var savePath = path.join(__dirname, '../public/user-profile-photos/', path.basename(req.files.file.name));
    models.User.findById(req.params.user_id)
      .then(function (user) {
        models.UserProfilePhoto.create({
          file: path.basename(savePath)
        }).then(function (profilePhoto) {
          user.addUserProfilePhoto(profilePhoto)
            .then(function (profilePhoto) {
              fs.createReadStream(req.files.file.path)
                .pipe(fs.createWriteStream(savePath));
              //user.updateAttributes({ CurrentProfilePhoto: profilePhoto });
              user.setCurrentProfilePhoto(profilePhoto );
              res.json(profilePhoto);
            }, function (error) {
              res.status(400).json({ errors: error });
            });
        });
      }, function (error) {
        res.send(400).json({ errors: error.errors });
      });
  }]
);

router.delete('/:user_id/profile-photos/:photo_id', function (req, res) {
  models.UserProfilePhoto.findById(req.params.photo_id)
    .then(function (photoId) {
      photoId.destroy().then(function () {
        res.json(photoId);
      });
    });
});

module.exports = router;
