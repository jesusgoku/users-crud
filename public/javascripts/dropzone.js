;(function ($) {
  $(function () {
    var $currentProfilePhoto = $('div#current-profile-photo');
    var $profilePhotos = $('div#profile-photos');
    var $profilePhotosModal = $('div#profile-photos-modal');
    var $profilePhotosDZ = $("div#profile-photos-dz");

    var profilePhotoTmpl = Handlebars.compile($('script#profile-photo-tmpl').html());
    var currentProfilePhotoTmpl = Handlebars.compile($('script#current-profile-photo-tmpl').html());

    if ($profilePhotosDZ.length > 0) {
      Dropzone.autoDiscover = false;

      var dz = new Dropzone('#' + $profilePhotosDZ.attr('id'), {
        url: $profilePhotosDZ.data('action'),
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        acceptedFiles: 'image/jpeg',
        uploadMultiple: false
      });

      dz.on('success', function (file) {
        var data = JSON.parse(file.xhr.response);
        //- Added new profile photo
        var $profilePhoto = $(profilePhotoTmpl(data));
        $profilePhoto.find('button').tooltip();
        $profilePhotos.append($profilePhoto);
        //- Change current profile photo
        var $img = $currentProfilePhoto.find('img');
        if ($img.length > 0) {
          $img
            .attr({
              'src': data.webPat,
              'data-id': data.id
            });
        } else {
          $currentProfilePhoto.append(currentProfilePhotoTmpl(data));
        }
        //- Hide modal and remove preview image in Dropzone
        $profilePhotosModal.modal('hide');
        $(file.previewElement).remove();
      });
    }

    if ($profilePhotos.length > 0) {
      var userId = $profilePhotos.data('userId');

      //- Get user profile photos
      $.ajax({
        url: '/users/' + userId + '/profile-photos',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          data.forEach(function (item) {
            $profilePhotos.append(profilePhotoTmpl(item));
          });
          $('[data-toggle="tooltip"]').tooltip()
        }
      });

      //- Show profile photo options
      $profilePhotos
        .on('mouseenter', '.profile-photo', function (e) {
          $(this).find('.options').removeClass('hide');
        })
        .on('mouseleave', '.profile-photo', function (e) {
          $(this).find('.options').addClass('hide');
        })
        .on('click', 'button.btn-delete', function (e) {
          var $profilePhoto = $(this).closest('.profile-photo');
          var userId = $profilePhoto.data('userId');
          var profilePhotoId = $profilePhoto.data('id');
          $.ajax({
            url: '/users/' + userId + '/profile-photos/' + profilePhotoId,
            type: 'DELETE',
            dataType: 'json',
            success: function (data) {
              $profilePhoto.remove();
              var $currentProfilePhoto = $('div#current-profile-photo img[data-id=' + profilePhotoId + ']');
              if ($currentProfilePhoto.length > 0) {
                $currentProfilePhoto.remove();
              }
            }
          });
        })
        .on('click', 'button.btn-set-current', function (e) {
          var $profilePhoto = $(this).closest('.profile-photo');
          var $profilePhotoImg = $profilePhoto.find('img');
          var userId = $profilePhoto.data('userId');
          var profilePhotoId = $profilePhoto.data('id');
          $.ajax({
            url: '/users/' + userId,
            type: 'PUT',
            dataType: 'json',
            data: { CurrentProfilePhotoId: profilePhotoId },
            success: function (data) {
              var $img = $currentProfilePhoto.find('img');
              if ($img.length > 0) {
                $img.attr({
                  'src': $profilePhotoImg.attr('src'),
                  'data-id': profilePhotoId
                });
              } else {
                $currentProfilePhoto.append(currentProfilePhotoTmpl({
                  webPath: $profilePhotoImg.attr('src'),
                  id: profilePhotoId
                }));
              }
            }
          });
        })
      ;
    }
  });
})(jQuery);
