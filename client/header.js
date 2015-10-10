Template.header.helpers({
    isAdmin: function () {
        var user = Meteor.user();
        if (user.profile) {
            if (user.profile.admin)
                return true;
        }
        return false;
    }
});