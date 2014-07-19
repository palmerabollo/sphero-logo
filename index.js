var Cylon = require('cylon');
var repl = require('repl');

var robot = Cylon.robot({
    connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-BGO-AMP-SPP' },
    device: {name: 'sphero', driver: 'sphero'},

    work: function(my) {
        my.sphero.detectCollisions();
        var opts = {
            // n: int, divisor of the max sampling rate, 400 hz/s
            // n = 40 means 400/40 = 10 data samples per second,
            // n = 200 means 400/200 = 2 data samples per second
            n: 400,
            // m: int, number of data packets buffered before passing them to the stream
            // m = 10 means each time you get data it will contain 10 data packets
            // m = 1 is usually best for real time data readings.
            m: 1,
            // pcnt: 1 -255, how many packets to send.
            // pcnt = 0 means unlimited data Streaming
            // pcnt = 10 means stop after 10 data packets
            pcnt: 0,
        };
        my.sphero.setDataStreaming(['locator', 'accelOne', 'velocity'], opts);
        // SetBackLed turns on the tail LED of the sphero that helps identify sphero's heading
        my.sphero.setBackLED(255); // 0-255, led brightness
        my.sphero.setRGB(0x00ff00);

        my.sphero.on('data', function ondata(data) {
            // console.log('locator', data);
        });

        // my.sphero.on('collision', function oncollision(data) {
        //     console.log('collision', data);
        // });
    }
});
robot.start();

function interpreter(cmd, context, filename, callback) {
    try {
        // TODO better parsing
        var parts = cmd.trim().split(/\W+/).filter(function (item) { return item; });
        if (parts[0] === 'FW') {
            // robot.sphero.roll(60, Math.floor(Math.random() * 360));
            console.log('Move FW the ball', parts[1]);
            callback(null);
        } else {
            callback(null, eval(cmd));
        }
    } catch (e) {
        console.log('Wrong command. Try again.');
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
