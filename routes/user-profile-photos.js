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
    }, createSendError(res))
  ;
});

router.post('/:user_id/profile-photos', [
  multer(),
  function (req, res) {
    var shared = { user: null };
    var savePath = path.join(
      __dirname,
      '../public/user-profile-photos/',
      path.basename(req.files.file.name)
    );
    models.User.findById(req.params.user_id)
      .then(function (user) {
        if (!user) { res.sendStatus(404); }
        shared.user = user;
        return models.UserProfilePhoto.create({
          file: path.basename(savePath)
        });
      }, createSendError(res))
      .then(function (profilePhoto) {
        return shared.user.addUserProfilePhoto(profilePhoto);
      }, createSendError(res))
      .then(function (userProfilePhoto) {
        fs.createReadStream(req.files.file.path)
          .pipe(fs.createWriteStream(savePath))
        ;
        shared.user.setCurrentProfilePhoto(userProfilePhoto);
        res.json(userProfilePhoto);
      }, createSendError(res))
    ;
  }]
);

router.delete('/:user_id/profile-photos/:photo_id', function (req, res) {
  models.UserProfilePhoto.findById(req.params.photo_id)
    .then(function (profilePhoto) {
      return profilePhoto.destroy();
    }, createSendError(res))
    .then(function (profilePhoto) {
      fs.unlink(profilePhoto.absolutePath, function (error) {
        if (error) { console.log(error); }
      });
      res.sendStatus(204);
    }, createSendError(res))
  ;
});

//- Helper functions
function createSendError (res) {
  return function (error) {
    res.status(400).json({ errors: error.errors });
  }
}

module.exports = router;
