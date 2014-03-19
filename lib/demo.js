// optional: for syntax-highlighting
prettyPrint();

angular.module('demoApp')

    .controller('AngularDreamFactoryDemoController', function ($scope, DreamFactory, $q) {
        // replace this dsp_url with yours ( leave the /rest/api_docs part )
        var dsp_url = "https://dsp-jetboystudio.cloud.dreamfactory.com/rest/api_docs";
        
        // replace this app_name with yours
        var app_name = "todoangular";

        $scope.loggedIn = false;
        
        $scope.user = {
            email: undefined,
            password: undefined
        };

        $scope.disabled = {};
        $scope.errors = {};
        $scope.responses = {};

        $scope.records = [];

        var df = new DreamFactory(dsp_url, app_name);

        // simple promise wrapper that works for everything on this page
        // TODO: there wouldn't need to be the $scope.$apply()'s below, if $http was used directly...
        var api = function(name, obj, body){
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

        $scope.login = function(){
            api('login',
                window.df.apis.user.login,
                {
                    "body": {
                        "email": $scope.user.email,
                        "password": $scope.user.password
                    }
                }
            )

            .then(function(response){
                $scope.loggedIn = true;
                window.authorizations.add("X-DreamFactory-Session-Token", new ApiKeyAuthorization("X-Dreamfactory-Session-Token", response.session_id, 'header'));
            })

            // update todolist
            .then($scope.getTodos);
        };

        $scope.getTodos = function(){
            api('get',
                window.df.apis.db.getRecords,
                {
                    "table_name": "todo"
                }
            )
            .then(function(response){
                // update list of records
                if (response && response.record){
                    $scope.records = response.record;
                }
            })
        };

        $scope.addTodo = function(){
            api('insert',
                window.df.apis.db.createRecords,
                {
                    "table_name": "todo",
                    "body": {
                        "record": [
                            {
                                "name": "New Item",
                                "complete": false
                            }
                        ]
                    }
                }
            )
            .then($scope.getTodos);
        };

        $scope.updateTodo = function(updateId){
            api('update',
                window.df.apis.db.updateRecords,
                {
                    "table_name": "todo",
                    "body": {
                        "record": [
                            {
                                "id": updateId,
                                "complete":true
                            }
                        ]
                    }
                }
            )
            .then($scope.getTodos);
        };

        $scope.deleteTodo = function(deleteId){
            api('delete',
                window.df.apis.db.deleteRecords,
                {
                    "table_name": "todo",
                    "ids": deleteId
                }
            )
            .then($scope.getTodos);
        };
    });