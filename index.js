var repl = require('repl'),
    utils = require('./utils'),
    robot = require('./robot').robot;

var DEFAULT_SPEED = 40;

function interpreter(cmd, context, filename, callback) {
    try {
        // TODO better parsing
        var parts = cmd.trim().split(/\W+/).filter(function (item) { return item; });
        if (['FW', 'FORWARD'].indexOf(dparts[0]) > -1) {
            utils.controlDistance.call(robot, parts[1], callback);
            robot.sphero.roll(DEFAULT_SPEED, 0); // speed, heading
        } else if (['BW', 'BACKWARD'].indexOf(parts[0]) > -1) {
            utils.controlDistance.call(robot, parts[1], callback);
            robot.sphero.roll(DEFAULT_SPEED, 180); // speed, heading
        } else {
            callback(null, eval(cmd));
        }
    } catch (e) {
        console.log('Wrong command. Try again.', e);
        callback(null);
    }
}

var options = {
    eval: interpreter,
    writer: function() {},
    ignoreUndefined: true
};

var r = repl.start(options);
// var context = r.context;
// context.sphero = robot.sphero;

r.on('exit', function () {
    console.log('good bye');
    process.exit();
});
