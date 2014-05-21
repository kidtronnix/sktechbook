/**
 * Created by kidtronnix on 20/05/14.
 */
var urlencode = require('urlencode');
var spawn = require('child_process').spawn;

var internals = {};
exports.register = function(plugin, options, next) {

    var plugins = plugin.path;

    var genReport = function (plugin, next) {

        return {
            handler: function(request, next) {


                casper  = spawn('casperjs', [plugins + '/scan.js', urlencode.decode(request.params.media) ]);
                next(casper.stdout);
            }
        }
    };

    // This is the routes for the plugin
    plugin.route({
        path: "/media-scan/{media}",
        method: "GET",
        config: genReport()
    });

    next();
};