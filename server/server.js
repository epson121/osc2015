Meteor.startup(function() {

    // Meteor.users.remove({});
    // if there are no polls available create sample data
    if (Meteor.users.find().count() < 1) {

        Accounts.createUser({
          email : 'admin@admin.com',
          password : 'admin',
          profile  : {
              admin: true
          }

        });

      }

})