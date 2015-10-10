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
          console.log(position.coords.latitude);
          $('#my_lat').val(position.coords.latitude);
          $('#my_lng').val(position.coords.longitude);
          FlashMessages.sendSuccess('Current location used');
        })
    } else {
        FlashMessages.sendError("Geolocation is not supported by this browser.");
    }
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

     Events.insert({
      name: name,
      phone: phone,
      description: description,
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
  var markers = [];
  GoogleMaps.ready('map', function(map) {
     console.log("I'm ready!");
      google.maps.event.addListener(map.instance, 'click', function(event) {
        // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        if (markers.length == 0) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: event.latLng,
            map: map.instance,
          });
          console.log(marker.getPosition().lat());
          console.log(marker.getPosition().lng());
          markers.push(marker);
          var lat = document.getElementById('my_lat');
          var lng = document.getElementById('my_lng');
          lat.value = marker.getPosition().lat();
          lng.value = marker.getPosition().lng();
        }

      });
  });
});