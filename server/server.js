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

});


var mock = function () {
  var sensors = Sensors.find({}).fetch();
  console.log(sensors);
  for (var i = 0; i < sensors.length; i++) {
    if (i == 0) {
      Sensors.update({_id: sensors[i]._id}, {$push: {temperature: randTempHigh()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {humidity: randHumHigh()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {wind: randWindHigh()}})
    } else if (i == 1) {
      Sensors.update({_id: sensors[i]._id}, {$push: {temperature: randTempMed()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {humidity: randHumMed()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {wind: randWindMed()}})
    } else if (i == 2) {
      Sensors.update({_id: sensors[i]._id}, {$push: {temperature: randTempLow()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {humidity: randHumLow()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {wind: randWindLow()}})
    } else {
      Sensors.update({_id: sensors[i]._id}, {$push: {temperature: randTemp()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {humidity: randHum()}})
      Sensors.update({_id: sensors[i]._id}, {$push: {wind: randWind()}})
    }
  };
}


var cron = new Meteor.Cron( {
  events:{
    "* * * * *"  : mock,
  }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randTemp() {
  return getRandomInt(10, 35);
}

function randTempHigh() {
  return getRandomInt(26, 35);
}

function randTempLow() {
  return getRandomInt(10, 18);
}

function randTempMed() {
  return getRandomInt(19, 26);
}


function randHumHigh() {
  return getRandomInt(30, 100);
}

function randHumHigh() {
  return getRandomInt(90, 100);
}

function randHumMed() {
  return getRandomInt(60, 90);
}

function randHumLow() {
  return getRandomInt(30, 60);
}



function randWind() {
  return getRandomInt(0, 40);
}

function randWindHigh() {
  return getRandomInt(25, 40);
}

function randWindMed() {
  return getRandomInt(10, 25);
}

function randWindLow() {
  return getRandomInt(0, 10);
}

