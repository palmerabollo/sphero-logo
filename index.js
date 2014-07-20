var repl = require('repl'),
    utils = require('./utils'),
    robot = require('./robot').robot;

var DEFAULT_SPEED = 10;

var MOVE_COMMANDS_HEADING = {
    'FW': 0,
    'FORWARD': 0,
    'BW': 180,
    'BACKWARD': 180,
    'RT': 90,
    'RIGHT': 90,
    'LT': 270,
    'LEFT': 270
};

function interpreter(cmd, context, filename, callback) {
    try {
        // TODO better parsing
        var parts = cmd.trim().split(/\W+/).filter(function (item) { return item; });

        var heading = MOVE_COMMANDS_HEADING[parts[0]];
        if (heading !== undefined) {
            utils.controlDistance.call(robot, parts[1], callback);
            robot.sphero.roll(DEFAULT_SPEED, heading);
        } else if (parts[0] === 'COLOR') {
            var hexColor = (parts[1] << 16) | (parts[2] << 8) | parts[3];
            robot.sphero.setRGB(hexColor);
        } else {
            with (context) {
                callback(null, eval(cmd));
            }
        }
    } catch (e) {
        console.log('Wrong command. Try again.', e);
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
