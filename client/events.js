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
            toastr.error('Please fill all data.');
            return;
        }

        EventComments.insert({
            user: userId,
            evt: eventId,
            comment: comment
        }, function(error, success) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Komentar uspješno dodan.');
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
            toastr.error('error');
        }

        var evt = Events.findOne({_id: eventId});
        console.log(evt);
        var hasVoted = $.inArray(userId, evt.votes)
        if (hasVoted == 0) {
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