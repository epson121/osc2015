Template.register.events({
  'submit form': function(event){
      event.preventDefault();
      var em = $('[name=email]').val();
      var pass = $('[name=password]').val();
      var options = {
          email: em,
          password: pass,
          profile: {
              admin: true
          },
      };
      Accounts.createUser(options, function(error) {
        if (error) {
          console.log(error.reason);
          Messages.insert({
            body: "Error registering."
          });
        } else {
          Messages.insert({
            body: "You've successfully registered."
          });
          Router.go('home');
        };
      });
    }
  });

Template.login.events({
  'submit form': function(event){
      event.preventDefault();
      Messages.remove({});
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
          console.log(error.reason);
           Messages.insert({
            body: error.reason,
            date: new Date(),
            seen: false
          });
        } else {
          Router.go('home');
        }
      });
    }
  });