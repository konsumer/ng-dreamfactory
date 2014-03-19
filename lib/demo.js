// optional: for syntax-highlighting
prettyPrint();

angular.module('demoApp')

    .controller('AngularDreamFactoryDemoController', function ($scope, DreamFactory) {
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

        $scope.login = function(){
            df.api('login',
                $scope,
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
            df.api('get',
                $scope,
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
            df.api('insert',
                $scope,
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
            df.api('update',
                $scope,
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
            df.api('delete',
                $scope,
                window.df.apis.db.deleteRecords,
                {
                    "table_name": "todo",
                    "ids": deleteId
                }
            )
            .then($scope.getTodos);
        };
    });