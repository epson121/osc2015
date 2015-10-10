Meteor.startup(function() {
    // if there are no polls available create sample data
    if (Meteor.users.find().count() < 2) {

        Accounts.createUser({
          email : 'admin@admin.com',
          password : 'admin',
          profile  : {
              admin: true
          }

        });

      }
})