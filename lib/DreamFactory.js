/**
 * A self-contained service for DreamFactory
 */

// TODO: do we really need all the window stuff in here?
angular.module('demoApp',[])

    // service for DreamFactory API
    .service( 'DreamFactory', function(){
        var DreamFactory = function(dsp_url, app_name){
            if (!document.createEvent) {
                var apiReady = new Event('apiReady');
            } else {
                var apiReady = document.createEvent("Event");
                apiReady.initEvent("apiReady", true, false);
            }

            // These are are necessary to communicate with the DreamFactory API
            window.authorizations.add("X-DreamFactory-Application-Name", new ApiKeyAuthorization("X-DreamFactory-Application-Name", app_name, "header"));
            window.authorizations.add('Content-Type', new ApiKeyAuthorization('Content-Type', 'application/json', 'header'));

            // Here I grab all the apis available, assigning them to a global df object
            window.df = new SwaggerApi({
                url: dsp_url,
                supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'merge', 'delete'],
                success: function () {
                    if (window.df && window.df.ready === true) {
                        document.dispatchEvent(apiReady);
                    }
                },
                error: function () {
                    console.log("error occurred");
                }
            });

            // attach auth headers
            window.df.authorizations = window.authorizations;
            window.df.build();
        }

        return DreamFactory;
    });