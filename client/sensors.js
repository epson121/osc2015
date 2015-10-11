Template.sensors.helpers({
    sensors: function() {
        var sensors = Sensors.find({});
        Session.set('sensors', sensors.fetch());
        return sensors;
    },

    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(45.5575, 18.6796),
          zoom: 11,
          mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
          }
        };
      }
    },

    isAdmin: function() {
        var user = Meteor.user();
        if (!user)
            return false;
        if (!user.profile)
            return false;
        if (!user.profile.admin)
            return false;
        return true;
    }
});

Template.sensors.onCreated(function() {
  GoogleMaps.ready('sensors_map', function(map) {
      if (Session.get('sensors')) {
        var sensors = Session.get('sensors');
        for (var i = 0; i < sensors.length; i++) {
          var myLatLng = new google.maps.LatLng(sensors[i].latitude, sensors[i].longitude);
          var marker = new google.maps.Marker({
            draggable: false,
            position: myLatLng,
            map: map.instance,
          });
        }
      }
    });
});


var sensorMarkers = sensorMarkers || [];
Template.new_sensor.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
          center: new google.maps.LatLng(45.5575, 18.6796),
          zoom: 11,
          mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
          }
        };
    }
  }
});

Template.new_sensor.events({

  'click #remove_marker': function(event) {
    event.preventDefault();
    for (var i = 0; i < sensorMarkers.length; i++) {
      sensorMarkers[i].setMap(null);
    };
    sensorMarkers = [];
  },

  'submit form': function(event) {
        event.preventDefault();
        var name = $('[name=name]').val();
        var description = $('[name=description]').val();
        var latitude = $('[name=lat]').val();
        var longitude = $('[name=lng]').val();

     if (!name || !description || !latitude || !longitude) {
      FlashMessages.sendError('Molim ispunite sva polja.');
      return;
     }

     var userId = Meteor.user()._id;

     Sensors.insert({
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude,
        temperature: [],
        humidity: [],
        wind: [],
        createdAt: new Date()
     }, function(error, result) {
        if (error) {
            FlashMessages.sendError(error.reason);
        } else {
            FlashMessages.sendSuccess('Sensor uspješno dodan.');
            Router.go('sensors');
        }
     });

  }
})


Template.new_sensor.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        if (sensorMarkers.length == 0) {
          var sensors = Sensors.find({}, {latitude: 1, longitude: 1}).fetch();
            var marker = new google.maps.Marker({
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: event.latLng,
                map: map.instance,
              });
              sensorMarkers.push(marker);
              var lat = document.getElementById('my_lat');
              var lng = document.getElementById('my_lng');
              lat.value = marker.getPosition().lat();
              lng.value = marker.getPosition().lng();
          }
      });
  });
});

Template.sensor.temperatureChart = function() {
    return {
        title: {
            text: 'Temperatura'
        },

        xAxis: {
            type: 'integer'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },

        legend: {
        },

        series: [{
            name: 'Temperatura',
            data: this.temperature,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }, {
            name: 'Range',
            data: _.map(this.temperature, function(elem) {return [20, 38]}),
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: "#F8D5D8",
            fillOpacity: 0.3,
            zIndex: 0
        }]
    };
};

Template.sensor.humidityChart = function() {
    return {
         title: {
            text: 'Vlažnost zraka'
        },

        xAxis: {
            type: 'integer'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },

        legend: {
        },

        series: [{
            name: 'Vlažnost zraka',
            data: this.humidity,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }, {
            name: 'Range',
            data: _.map(this.temperature, function(elem) {return [75, 100]}),
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: "#F8D5D8",
            fillOpacity: 0.3,
            zIndex: 0
        }]
    };
};

Template.sensor.windChart = function() {
    return {
        title: {
            text: 'Brzina vjetra'
        },

        xAxis: {
            type: 'integer'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },

        legend: {
        },

        series: [{
            name: 'Brzina vjetra',
            data: this.wind,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }, {
            name: 'Range',
            data: _.map(this.wind, function(elem) {return [5, 15]}),
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: "#F8D5D8",
            fillOpacity: 0.3,
            zIndex: 0
        }]
    };
};

Template.sensor.helpers({
    mapOptions: function() {
        sensor = Sensors.findOne({_id: this._id});
        if (sensor) {
            Session.set('selected_sensor', sensor);
        }
        if (GoogleMaps.loaded()) {
            return {
              center: new google.maps.LatLng(45.5575, 18.6796),
              zoom: 11
            };
        }
    }
});

Template.sensor.onCreated(function() {
  GoogleMaps.ready('sensor_map', function(map) {
      if (Session.get('selected_sensor')) {
        var evt = Session.get('selected_sensor');
        var myLatLng = new google.maps.LatLng(evt.latitude, evt.longitude);
        var marker = new google.maps.Marker({
            draggable: false,
            position: myLatLng,
            map: map.instance,
        });
      }
    });
});
