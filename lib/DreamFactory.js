/**
 * A self-contained service for DreamFactory
 */

// TODO: do we really need all the window stuff in here?
angular.module('demoApp',[])

    // service for DreamFactory API
    .service( 'DreamFactory', ['$q',function($q){
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

        // simple promise wrapper that works for everything on this page
        // TODO: there wouldn't need to be the $scope.$apply()'s below, if $http was used directly...
        DreamFactory.prototype.api = function(name, $scope, obj, body){
            var deferred = $q.defer();
            
            $scope.disabled[name] = true;
            $scope.errors[name] = false;
            $scope.responses[name] = undefined;
            
            obj(body, function (response) {
                $scope.disabled[name] = false;
                $scope.responses[name] = JSON.stringify(response);
                $scope.$apply();
                deferred.resolve(response);
            }, function(response) {
                $scope.disabled[name] = false;
                $scope.errors[name] = (response.content && response.content.data && response.content.data.error) ? 
                    response.content.data.error[0].message :
                    "An error occurred, but the server provided no additional information.";
                $scope.$apply();
                deferred.fail(response);
            });
            
            return deferred.promise;
        }

        return DreamFactory;
    }]);