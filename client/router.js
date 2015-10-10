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
  //   data = {events: Events.find({})};
  //   Session.set('events', data);
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

Router.route('/admin', function() {
    this.render('admin');
}, {
    name: 'admin'
});

Router.route('/sensors', function() {
    this.render('sensors');
}, {
    name: 'sensors'
});

Router.route('/new_sensor', function() {
    this.render('new_sensor');
}, {
    name: 'new_sensor'
});

Router.route('/add_ticket', function() {
    this.render('add_ticket');
}, {
    name: 'add_ticket'
});

Router.route('/event/:_id', function() {
    this.render('event', {
      data: function() {
        return Events.findOne({_id: this.params._id});
      }
    })
}, {
    name: 'event'
});

Router.route('/sensor/:_id', function() {
    this.render('sensor', {
      data: function() {
        return Sensors.findOne({_id: this.params._id});
      }
    })
}, {
    name: 'sensor'
});