Template.evts.helpers({
    events: function () {
        var events = Events.find({});
        Session.set('events', events.fetch());
        return events;
    }
});

Template.event.events({
    'submit form': function(event) {
        event.preventDefault();
        console.log(this._id);
        var userId = Meteor.user()._id;
        var eventId = this._id;
        var comment = $('[name=comment]').val();

        if (!userId || !eventId || !comment) {
            FlashMessages.sendError('Please fill all data.');
            return;
        }

        EventComments.insert({
            user: userId,
            evt: eventId,
            comment: comment
        }, function(error, success) {
            if (error) {
                FlashMessages.sendError(error.reason);
            } else {
                FlashMessages.sendSuccess('Comment successfully added.');
            }
        })

        $('[name=comment]').val("");
        return false;
    },

    'click #priority_btn': function(event) {
        event.preventDefault();
        var userId = Meteor.user()._id;
        var eventId = this._id;

        if (!userId) {
            FlashMessages.sendError('error');
        }

        var evt = Events.findOne({_id: eventId});
        var hasVoted = $.inArray(userId, evt.votes)
        console.log(hasVoted);
        if (hasVoted != -1) {
            Events.update({_id: evt._id}, {$inc: {priority: -1}, $pull: {votes: userId}});
        } else {
            Events.update({_id: evt._id}, {$inc: {priority: 1}, $push: {votes: userId}});
        }
    }
});

Template.event_comments_list.helpers({
    eventComments: function() {
        return EventComments.find({evt: this._id});
    }
});

Template.event.helpers({
    mapOptions: function() {
        evt = Events.findOne({_id: this._id});
        if (evt) {
            Session.set('selected_event', evt);
        }
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(45.5575, 18.6796),
          zoom: 11
        };
      }
    },
});

Template.event.onCreated(function() {
  GoogleMaps.ready('event_map', function(map) {
      if (Session.get('selected_event')) {
        var evt = Session.get('selected_event');
        var myLatLng = new google.maps.LatLng(evt.latitude, evt.longitude);
        console.log(myLatLng);
        var marker = new google.maps.Marker({
            draggable: false,
            position: myLatLng,
            map: map.instance,
        });
      }
    });
});

Template.sensorData.helpers({
    temperature: function() {
        var sensor = Session.get('ns');
        if (sensor) {
            var tempArray = sensor.temperature;
            return tempArray[tempArray.length-1];
        }
    },

    humidity: function() {
        var sensor = Session.get('ns');
         if (sensor) {
            var tempArray = sensor.humidity;
            return tempArray[tempArray.length-1];
        }
    },

    wind: function() {
        var sensor = Session.get('ns');
         if (sensor) {
            var tempArray = sensor.wind;
            return tempArray[tempArray.length-1];
        }
    },

    nearest_sensor: function() {
        var evtLat = this.latitude;
        var evtLng = this.longitude;
        if (!evtLat || !evtLng)
            return;
        var sensors = Sensors.find({}, {sort: {date_created: 1}}).fetch();
        var nearestIndex = 0;
        var nearestDistance = Infinity;
        for (var i = 0; i < sensors.length; i++) {
            var dst = distance(evtLat, evtLng, sensors[i].latitude, sensors[i].lng);
            if (dst < nearestDistance) {
                nearestDistance = dst;
                nearestIndex = i;
            }
        };
        Session.set('ns', sensors[nearestIndex]);
        return sensors[nearestIndex]._id;
    }
})

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