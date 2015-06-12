;(function (io, $, Handlebars) {
  var io = io.connect();

  //- Users
  var $userList = $('#user-list');
  if ($userList.length > 0) {
    var $listItemTmpl = $('#list-item-tmpl');
    var listItemTmpl = Handlebars.compile($listItemTmpl.html());

    io.on('userCreate', function (user) {
      $userList.append(listItemTmpl(user));
    });

    io.on('userDestroy', function (user) {
      $('tr[data-user-id=' + user.id + ']').remove();
    });

    io.on('userUpdate', function (user) {
      $('tr[data-user-id=' + user.id + ']').replaceWith(listItemTmpl(user));
    });

    io.on('serverRestart', function () {
      $.ajax({
        url: '/users',
        type: 'GET',
        dataType: 'json'
      }).then(function (users) {
        var html = '';
        users.forEach(function (user) {
          html += listItemTmpl(user);
        });
        $userList.html(html);
      });
    });
  }
})(io, jQuery, Handlebars);
