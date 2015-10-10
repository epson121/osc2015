Template.sensors.helpers({
    sensors: function() {
        return Sensors.find({});
    }
});

Template.sensors.events({
    'click #new_sensor': function() {

    }
})

var sensorMarkers = sensorMarkers || [];
Template.new_sensor.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(45.5575, 18.6796),
        zoom: 11
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
      FlashMessages.sendError('Please fill in all fields');
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
            FlashMessages.sendSuccess('Sensor added');
            Router.go('sensors');
        }
     });

  }
})


Template.new_sensor.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
     console.log("I'm ready!");
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
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: this.name + " All-time Temperature chart"
        },
        tooltip: {
            pointFormat: '{series.name} at <b>{point.y:,.0f}</b>'
        },
        plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            type: 'area',
            name: 'temperature',
            data: this.temperature
        }]
    };
};

Template.sensor.humidityChart = function() {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: this.name + " All-time Humidity chart"
        },
        tooltip: {
            pointFormat: '{series.name} at <b>{point.y:,.0f}</b>'
        },
        plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            type: 'area',
            name: 'humidity',
            data: this.humidity
        }]
    };
};

Template.sensor.windChart = function() {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: this.name + " All-time Humidity chart"
        },
        tooltip: {
            pointFormat: '{series.name} at <b>{point.y:,.0f}</b>'
        },
        plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            type: 'area',
            name: 'wind',
            data: this.wind
        }]
    };
};
