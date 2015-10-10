Router.configure({
  layoutTemplate: 'main'
})

Router.route('/', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',
  name: 'home',

  // waitOn: function () {
  //   // return one handle, a function, or an array
  //   return Meteor.subscribe('books');
  // },
  // data: function() {
  //   data = {book: Books.find({available: true})};
  //   return data;
  // },

  // waitOn: function() {
  //   return Meteor.subscribe('books');
  // },

  // action: function () {
  //   this.render('home');
  // }
});

Router.route('/register', function() {
    this.render('register');
}, {
    name: 'register',
});

Router.route('/login', function() {
    this.render('login');
}, {
    name: 'login'
});