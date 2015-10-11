Router.configure({
  layoutTemplate: 'main'
});

Router.onBeforeAction(function(pause) {
  if (!Meteor.user() || !Meteor.user().profile || !Meteor.user().profile.admin) {
    this.redirect('home');
  } else {
    this.next();
  }
}, {
  only: ['admin', 'new_sensor', 'new_activity']
  // or except: ['routeOne', 'routeTwo']
});

Router.route('/', {
  name: 'home',
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

Router.route('/activities', function() {
    this.render('activities');
}, {
    name: 'activities'
});

Router.route('/new_activity', function() {
    this.render('new_activity');
}, {
    name: 'new_activity'
});

Router.route('/add_ticket', function() {
    this.render('add_ticket');
}, {
    name: 'add_ticket'
});

Router.route('/archive', function() {
    this.render('archive');
}, {
    name: 'archive'
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

Router.route('/activity/:_id', function() {
    this.render('activity', {
      data: function() {
        return Activities.findOne({_id: this.params._id});
      }
    })
}, {
    name: 'activity'
});


// BACKDOOR
Router.route('/komarci', function() {
    this.render('komarci', {
      layoutTemplate: 'komarac'
    });
}, {
    name: 'komarci'
});