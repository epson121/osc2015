Template.register.events({
  'submit form': function(event){
      event.preventDefault();
      var em = $('[name=email]').val();
      var pass = $('[name=password]').val();
      var options = {
          email: em,
          password: pass,
          profile: {
          },
      };
      Accounts.createUser(options, function(error) {
        if (error) {
          toastr.error("There was an error in registering.");
        } else {
          toastr.success("You've successfully registered.");
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
          console.log(error.reason);
          toastr.error(error.reason);
        } else {
          toastr.success("You've successfully logged in.");
          console.log(Meteor.user().profile.admin);
          var profile = Meteor.user().profile;
          if (profile) {
            if (profile.admin) {
              Router.go('admin');
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
      toastr.success("You've successfully logged out.");
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