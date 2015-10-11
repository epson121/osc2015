var activityMarkers = activityMarkers || [];
Template.activities.helpers({
    activities: function () {
        var activities = Activities.find({}, {$sort: {scheduledAt: -1}});
        return activities;
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

Template.new_activity.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            return {
              center: new google.maps.LatLng(45.5575, 18.6796),
              zoom: 11
            };
        }
    }
});


var roadMap;
var planeMap;
var polygonCoords = polygonCoords || [];

Template.new_activity.events({
    'click #clear_map': function (event) {
        event.preventDefault();
        for (var i = 0; i < activityMarkers.length; i++) {
          activityMarkers[i].setMap(null);
        };
        activityMarkers = [];
        polygonCoords = [];
        freePolygonCoords = [];
        if (roadMap) {
            roadMap.setMap(null);
        }
        if (planeMap) {
            planeMap.setMap(null);
        }
    },

    'change #selection_type': function(event) {
        event.preventDefault();
        var selectionType = $('#selection_type').val();
        Session.set('selection_type', selectionType);
    },

    'submit form': function(event) {
        event.preventDefault();
        var name = $('[name=name]').val();
        var description = $('[name=description]').val();
        var date = $('[name=date]').val();
        var time = $('[name=time]').val();
        var selection_type = $('[name=selection_type]').val();

        if (!name || ! description || !date || !time || !selection_type || polygonCoords.length < 2) {
            toastr.error('Molim ispunite sva polja i označite na karti');
            return;
        }
        var dateFormatted = moment(date + " " + time).format()

        Activities.insert({
            name: name,
            description: description,
            scheduledAt: dateFormatted,
            selectionType: selection_type,
            coords: polygonCoords
        }, function(error, success) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Activity inserted successfully');
                Router.go('activities');
            }
        });

        return;
    }
});

function clearMap() {
    for (var i = 0; i < activityMarkers.length; i++) {
      activityMarkers[i].setMap(null);
    };
    activityMarkers = [];
    polygonCoords = [];
    freePolygonCoords = [];
    if (roadMap) {
        roadMap.setMap(null);
    }
    if (planeMap) {
        planeMap.setMap(null);
    }
}

Template.new_activity.onCreated(function() {
    clearMap();
    Session.set('selection_type', 0);
  GoogleMaps.ready('activity_map', function(map) {
     console.log("I'm ready!");
      google.maps.event.addListener(map.instance, 'click', function(event) {
        console.log(polygonCoords);
            console.log("Activity markers: " + activityMarkers);
          // var sensors = Sensors.find({}, {latitude: 1, longitude: 1}).fetch();
            var marker = new google.maps.Marker({
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: event.latLng,
                map: map.instance,
            });
            activityMarkers.push(marker);
            var lat = document.getElementById('my_lat');
            var lng = document.getElementById('my_lng');
            lat.value = marker.getPosition().lat();
            lng.value = marker.getPosition().lng();


            polygonCoords.push({lat: marker.getPosition().lat(), lng: marker.getPosition().lng()});
          // Define the LatLng coordinates for the polygon's path.
          draw(map.instance);
      });
  });
});

function draw(map) {
    if (Session.get('selection_type') == 0) {
        // Construct the polygon.
      if (polygonCoords.length > 2) {

        console.log("OKOK");
        console.log(polygonCoords);
        if (planeMap) {
            planeMap.setMap(null);
        }
        planeMap = new google.maps.Polygon({
            paths: polygonCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        planeMap.setMap(map);
      } else {
        console.log("NOT");
      }
  } else {
     if (polygonCoords.length > 1) {
        if (roadMap) {
            roadMap.setMap(null);
        }
        roadMap = new google.maps.Polyline({
            path: polygonCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          roadMap.setMap(map);
      }
  }
}

// var jsonify = function(obj){
//     var seen = [];
//     var json = JSON.stringify(obj, function(key, value){
//         if (typeof value === 'object') {
//             if ( !seen.indexOf(value) ) {
//                 return '__cycle__' + (typeof value) + '[' + key + ']';
//             }
//             seen.push(value);
//         }
//         return value;
//     }, 4);
//     return json;
// };

Template.activity.helpers({
  mapOptions: function() {
    var data = this.coords;
    var selectionType = this.selectionType;
    if (data && selectionType) {
        Session.set('coords', data);
        Session.set('type', selectionType);
    }
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(45.5575, 18.6796),
        zoom: 11
      };
    }
  }
});

Template.activity.events({
    'click #delete_activity': function (event) {
        Activities.remove({_id: this._id}, function(error, success) {
            if (error) {
                toastr.error("Greska prilikom brisanja.");
            } else {
                toastr.success('Aktivnost obrisana.');
                Router.go('activities');
            }
        })
    }
});

Template.activity.onCreated(function() {
  clearMap()
  GoogleMaps.ready('activity_map', function(map) {
    drawNew(map.instance, Session.get('coords'));
  });
});

function drawNew(map, coords) {
    if (Session.get('type') == 0) {
        // Construct the polygon.
      if (coords.length > 2) {

        if (planeMap) {
            planeMap.setMap(null);
        }
        planeMap = new google.maps.Polygon({
            paths: coords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        planeMap.setMap(map);
      }
  } else {
     if (coords.length > 1) {
        if (roadMap) {
            roadMap.setMap(null);
        }
        roadMap = new google.maps.Polyline({
            path: coords,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          roadMap.setMap(map);
      }
  }
}