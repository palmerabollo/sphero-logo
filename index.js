// My first attemt will be to create a custom REPL as an interactive interpreter
// see http://nodejs.org/api/repl.html
var repl = require("repl");

function interpreter(cmd, context, filename, callback) {
    try {
        callback(null, eval(cmd));
    } catch (e) {
        console.log('Wrong command. Try again.');
        callback(null);
    }
}

var options = {
    eval: interpreter,
    promt: 'sphero',
    writer: function() {},
    ignoreUndefined: true
};

var r = repl.start(options);
// XXX var context = r.context;
// XXX context.foo = 'bar';

r.on('exit', function () {
    console.log('good bye');
    // TODO terminate sphero connection
    process.exit();
});
