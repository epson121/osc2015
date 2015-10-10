Template.header.helpers({
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