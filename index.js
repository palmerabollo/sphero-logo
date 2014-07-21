var repl = require('repl'),
    utils = require('./utils'),
    robot = require('./robot').robot;

var DEFAULT_SPEED = 30;

var MOVE_COMMANDS_HEADING = {
    'FW': 0,
    'FORWARD': 0,
    'BW': 180,
    'BACKWARD': 180
};

var ROTATE_COMMANDS_HEADING = {
    'RT': 1,
    'RIGHT': 1,
    'LT': -1,
    'LEFT': -1
};

// XXX code should be stateless
var status = {
    heading: 0
};

function interpreter(cmd, context, filename, callback) {
    try {
        // XXX better parsing
        var parts = cmd.trim().split(/\W+/).filter(function (item) { return item; });

        // XXX this if/elif/elif/else smells really bad. refactor.

        if (MOVE_COMMANDS_HEADING[parts[0]] !== undefined) {
            var heading = (MOVE_COMMANDS_HEADING[parts[0]] + status.heading) % 360;

            utils.controlDistance.call(robot, parts[1], callback);
            robot.sphero.roll(DEFAULT_SPEED, heading);
        } else if (ROTATE_COMMANDS_HEADING[parts[0]] !== undefined) {
            var heading = status.heading + ROTATE_COMMANDS_HEADING[parts[0]] * parts[1];
            status.heading = Math.abs(heading % 360);

            utils.controlDistance.call(robot, parts[1], callback);
            robot.sphero.roll(0, status.heading);
        } else if (parts[0] === 'COLOR') {
            var hexColor = (parts[1] << 16) | (parts[2] << 8) | parts[3];
            robot.sphero.setRGB(hexColor);
            callback();
        } else {
            with (context) {
                callback(null, eval(cmd));
            }
        }
    } catch (e) {
        console.log('Wrong command. Try again.', e.stack);
        callback();
    }
}

var options = {
    eval: interpreter,
    writer: function() {},
    ignoreUndefined: true
};

var r = repl.start(options);
var context = r.context;
context.sphero = robot.sphero;

r.on('exit', function () {
    console.log('good bye');
    process.exit();
});
