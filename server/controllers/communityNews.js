const User = require('../models/user');

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
var delayedTimestamp = function() {
    var timeIndex = 0;
    var shifts = [35, 60, 60 * 3, 60 * 60 * 2, 60 * 60 * 25, 60 * 60 * 24 * 4, 60 * 60 * 24 * 10];
  
    var now = new Date();
    now = now.addDays(-1);
    var shift = shifts[timeIndex++] || 0;
    var date = new Date(now - shift * 1000);
  
    return date.getTime() / 1000;
};

exports.communityNews = (req, res, next) => {
    User.find({"stories.timestamp": {$gte: delayedTimestamp()}}, {"stories.$": true, profile: true})
    .then(users => {
        return res.json({
            status: true,
            message: "User with stories",
            users
        })
    })
    .catch(err => {
        console.log(err);
        return res.json({
            status: false,
            message: "Internal server error"
        })
    })
}