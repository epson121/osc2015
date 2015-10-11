Template.register.events({
  'submit form': function(event){
      event.preventDefault();
      var em = $('[name=email]').val();
      var pass = $('[name=password]').val();
      var name = $('[name=name]').val();

      if (!em || !pass || !name) {
        toastr.error('Molim ispunite sva polja.');
        return;
      }

      var options = {
          email: em,
          password: pass,
          profile: {
            name: name
          },
      };
      Accounts.createUser(options, function(error) {
        if (error) {
          toastr.error("Greška prilikom registracije");
        } else {
          toastr.success("Uspješno ste registrirani.");
          Router.go('home');
        };
      });
    }
  });

Template.login.events({
  'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
          toastr.error(error.reason);
        } else {
          toastr.success("Uspješno ste se prijavili.");
          var profile = Meteor.user().profile;
          if (profile) {
            if (profile.admin) {
              Router.go('activities');
            } else {
              Router.go('home');
            }
          } else {
            Router.go('home');
          }
        }
      });
    }
  });

Template.header.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
      toastr.success("Uspješno ste se odjavili.");
      Router.go('home');
    }
  });

Template.header.helpers({
    isAdmin: function (user) {
      if (user){
        return user.profile.admin ? true : false;
      }
    }
  });

toastr.options = {
  "closeButton": false,
  "debug": true,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}