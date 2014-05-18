// This is the base controller. Used for base routes, such as the default index/root path, 404 error pages, and others.
module.exports = {
    index: {
        handler: function(request, reply){
            reply.view('blog', {
                title: 'Awesome Boiler Plate Homepage'
            });
        },
        app: {
            name: 'index'
        }
    },
    cv: {
        handler: function(request, reply){
            reply.view('cv-print', {
                title: 'This is the example about page'
            });
        },
        app: {
            name: 'cv'
        }
    },
    fap: {
        handler: function(request, reply){
            reply.view('fap', {
                title: 'This is the example about page'
            });
        },
        app: {
            name: 'fap'
        }
    },
    missing: {
        handler: function(request, reply){
            reply.view('404', {
                title: 'You found a missing page, but won the 404 error!'
            });
        },
        app: {
            name: '404'
        }
    }
}