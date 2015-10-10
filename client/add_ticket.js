var addedMarkers = addedMarkers || [];
Template.add_ticket.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(45.5575, 18.6796),
        zoom: 11
      };
    }
  }
});

Template.add_ticket.events({

  'click #my_loc': function(event) {
    event.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var events = Events.find({}, {latitude: 1, longitude: 1}).fetch();
          for(var i = 0; i < events.length; i++) {
            var lat1 = events[i].latitude;
            var lon1 = events[i].longitude;
            var lat2 = position.coords.latitude
            var lon2 = position.coords.longitude
            if (distance(lat1, lon1, lat2, lon2, 'K') < 0.5) {
              if (confirm("There is already an open ticket near this location. Visit this ticket?")) {
                Router.go('event', {_id: events[i]._id})
              }
              var existsNear = true;
            } else {
              existsNear = false;
            }
          }
          if (!existsNear) {
            $('#my_lat').val(position.coords.latitude);
            $('#my_lng').val(position.coords.longitude);
            FlashMessages.sendSuccess('Current location used');
          }
        })
    } else {
        FlashMessages.sendError("Geolocation is not supported by this browser.");
    }
  },

  'click #remove_marker': function(event) {
    event.preventDefault();
    for (var i = 0; i < addedMarkers.length; i++) {
      addedMarkers[i].setMap(null);
    };
    addedMarkers = [];
  },

  'submit form': function(event) {
      event.preventDefault();
     var name = $('[name=name]').val();
     var phone = $('[name=phone]').val();
     var description = $('[name=description]').val();
     var latitude = $('[name=lat]').val();
     var longitude = $('[name=lng]').val();

     if (!name || !phone || !description || !latitude || !longitude) {
      FlashMessages.sendError('Please fill in all fields');
      return;
     }

     var userId = Meteor.user()._id;

     Events.insert({
      name: name,
      phone: phone,
      description: description,
      priority: 1,
      votes: [userId],
      latitude: latitude,
      longitude: longitude,
      createdAt: new Date()
     }, function(error, result) {
        if (error) {
          FlashMessages.sendError(error.reason);
        } else {
          FlashMessages.sendSuccess('Event submitted successfully');
          Router.go('home');
        }
     });

  }
})


Template.add_ticket.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
     console.log("I'm ready!");
      google.maps.event.addListener(map.instance, 'click', function(event) {
        // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        if (addedMarkers.length == 0) {
          var existsNear = true;
          var events = Events.find({}, {latitude: 1, longitude: 1}).fetch();
          console.log(event);
          for(var i = 0; i < events.length; i++) {
            var lat1 = events[i].latitude;
            var lon1 = events[i].longitude;
            var lat2 = event.latLng.J;
            var lon2 = event.latLng.M;
            if (distance(lat1, lon1, lat2, lon2, 'K') < 0.5) {
              if (confirm("There is already an open ticket near this location. Visit this ticket?")) {
                Router.go('event', {_id: events[i]._id})
              } else {
                var existsNear = true;
                break;
              }
            } else {
              existsNear = false;
            }
          }
          if (!existsNear) {
            var marker = new google.maps.Marker({
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: event.latLng,
                map: map.instance,
              });
              addedMarkers.push(marker);
              var lat = document.getElementById('my_lat');
              var lng = document.getElementById('my_lng');
              lat.value = marker.getPosition().lat();
              lng.value = marker.getPosition().lng();
          }
        }

      });
  });
});

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}