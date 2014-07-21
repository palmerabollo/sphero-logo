var Cylon = require('cylon');

var robot = Cylon.robot({
    connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-BGO-AMP-SPP' },
    device: {name: 'sphero', driver: 'sphero'},

    work: function(my) {
        my.sphero.configureLocator(0, 0, 0, 0);
        my.sphero.detectCollisions();

        var opts = {
            // n: int, divisor of the max sampling rate, 400 hz/s
            // n = 40 means 400/40 = 10 data samples per second,
            // n = 200 means 400/200 = 2 data samples per second
            n: 100,
            // m: int, number of data packets buffered before passing them to the stream
            // m = 10 means each time you get data it will contain 10 data packets
            // m = 1 is usually best for real time data readings.
            m: 1,
            // pcnt: 1 -255, how many packets to send.
            // pcnt = 0 means unlimited data Streaming
            // pcnt = 10 means stop after 10 data packets
            pcnt: 0,
        };

        // 'motorsPWM', 'imu', 'accelerometer', 'gyroscope', 'motorsIMF',
        // 'quaternion', 'locator', 'accelOne', 'velocity'
        var datasources = ['locator', 'imu'];
        my.sphero.setDataStreaming(datasources, opts);

        my.sphero.setBackLED(255); // 0-255, led brightness
        my.sphero.setRGB(0x000000);

        /*
        my.sphero.on('data', function ondata(data) {
            console.log('locator', data);
        });

        my.sphero.on('collision', function oncollision(data) {
            console.log('collision', data);
            my.sphero.stop();
        });
        */
    }
});

robot.start();

module.exports = {
    robot: robot
}
