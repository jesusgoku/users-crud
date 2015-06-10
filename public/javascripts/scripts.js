;(function ($) {
  $(function () {
    //- Delete links
    var $deleteLinks = $('a[data-method="delete"]');
    $deleteLinks.on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      if (confirm($this.data('confirm'))) {
        $.ajax({
          url: $this.data('url'),
          dataType: 'json',
          type: 'DELETE'
        }).done(function (data) {
          $this.closest('tr').remove();
        })
        ;
      }
    });

    //- User social networks
    var $socialNetworkModal = $('div#social-network-modal');
    if ($socialNetworkModal.length > 0) {
      var socialNetworkTmpl = Handlebars.compile($('script#social-network-tmpl').html());
      $socialNetworkModal.find('.modal-footer button.btn-primary')
        .on('click', function (e) {
          var $form = $socialNetworkModal.find('form');
          $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
              var text = $('select[name="SocialNetworkId"] option[value=' + data.SocialNetworkId + ']').text();
              data.socialNetwork = text;
              $('div#social-networks')
                .append(socialNetworkTmpl(data));
              $socialNetworkModal.modal('hide');
              $form.trigger('reset');
            }
          });
        });
    }
  });
})(jQuery);
