/**
 * Created by kidtronnix on 16/05/14.
 */

// Housekeeping?...
var startTime, currentURL, previousURL;

// base report
var Report = {
    viewport: {},
    landed: "http://example.com",
    hops: [],
    flags: []
};

// Okay business taken care of
// Let's start using casper
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug",
    timeout: 60000 // 1 minute
});

// Get url from CLI argument
if (casper.cli.args.length < 1) {
    casper
        .echo("Usage: $ casperjs analyse.js http://googlemaps.com")
        .exit(1)
    ;
} else {
    // Get starting URL from CLI
    var startingURL = casper.cli.args[0];
    currentURL = startingURL;
//    casper.echo("Starting @ "+startingURL);
}

var viewport = {
    'name': 'ubuntu_12_04_chrome',
    'userAgent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
    'viewport': {width: 1440, height: 813}
};

startTime = new Date().getTime();

// Start casper browser simulation
casper.start(startingURL, function() {

});


// set current viewport as current array element
casper.then(function() {

    this.userAgent(viewport.userAgent);
    this.viewport(viewport.viewport.width, viewport.viewport.height);
    Report.viewport = viewport;

});

// Open and wait 5 seconds
casper.thenOpen(startingURL, function() {
    this.wait(5000);
    startTime = new Date().getTime();

});

// Navigations
casper.on('navigation.requested', function(url, navigationType, navigationLocked, isMainFrame) {

    // Move current -> previous
    previousURL = currentURL;
    currentURL = url;

    // Let's filter out hops that are redirecting to same place
    if(previousURL != currentURL) {
        // make ind. report
        var hop = {
            from: previousURL,
            to: url,
            isMainFrame: isMainFrame,
            time: new Date().getTime() - startTime
        };

        // Add it to the reports object
        Report.hops.push(hop);
    }


//            this.echo(JSON.stringify(Reports[viewport.name], null, 2));
});

// let's define some event processing
// Report back with resouces we are receiving
casper.on('resource.received', function(resource) {

    // All our regex testing
    var matches = resource.url.match(/.apk/);
    if(matches) {

        Report.flags.push(resource.url);
    }


});

// Ok we have waited 5 second on the page
casper.then(function() {

//    this.echo('Landed @ ' + this.getCurrentUrl(), 'info');
    Report.landed = this.getCurrentUrl();

    this.capture('screenshots/' + viewport.name +'.png', {
        top: 0,
        left: 0,
        width: viewport.viewport.width,
        height: viewport.viewport.height
    });


});

// Report back with Report
casper.on('exit', function() {
    // Echo out to webservice
    this.echo(JSON.stringify(Report, null, 2));
});



casper.run();