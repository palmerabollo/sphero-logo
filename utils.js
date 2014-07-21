function controlDistance(distance, callback) {
    if (distance <= 0) {
        throw new TypeError('distance must be positive');
    }

    var robot = this;
    var initialPosition;

    robot.sphero.on('data', function ondata(data) {
        initialPosition = initialPosition || data;

        var distanceMoved = Math.sqrt(
            Math.pow(initialPosition[3] - data[3], 2) +
            Math.pow(initialPosition[4] - data[4], 2)
        );

        if (distanceMoved >= distance) {
            robot.sphero.stop();
            robot.sphero.removeAllListeners('data');
            callback();
        }
    });
}

module.exports = {
    controlDistance: controlDistance
};
