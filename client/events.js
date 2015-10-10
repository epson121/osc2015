Template.evts.helpers({
    events: function () {
        var events = Events.find({});
        Session.set('events', events.fetch());
        return events;
    }
});