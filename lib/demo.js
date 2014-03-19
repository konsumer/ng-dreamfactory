var demoApp = angular.module('demoApp',["ngResource", "DreamFactory"]);

demoApp.controller('AngularDreamFactoryDemoController', function ($scope, DreamFactory) {    
    // replace this dsp_url with yours ( leave the /rest part )
    var dsp_url = "https://dsp-konsumer.cloud.dreamfactory.com/rest";
    
    // replace this app_name with yours
    var app_name = "todoangular";
    
    $scope.Todo = DreamFactory(dsp_url, app_name, 'todo');

    $scope.disabled = {};
    $scope.errors = {};
    $scope.responses = {};


    $scope.login = function(email, password){
        $scope.disabled['login']=true;
        $scope.errors['login'] = false;
        $scope.Todo.login(email, password)
            .then(function(response){
                $scope.loggedIn = true;
                $scope.disabled['login']=false;
                $scope.getTodos();
            },function(response){
                $scope.loggedIn = false;
                $scope.disabled['login']=false;
                $scope.errors['login'] = $scope.Todo.error(response)
            })
    };

    // generic handler
    var handle = function(obj, name){
        $scope.disabled[name] = true;
        $scope.errors[name] = false;
        $scope.responses[name] = false;

        obj.success(function(response){
            $scope.disabled[name] = false;
            $scope.records = response.record;
            $scope.responses[name] = response;
            if (name !='get'){
                $scope.getTodos();
            }
        }).error(function(response){
            $scope.disabled[name]=false;
            $scope.errors[name] = $scope.Todo.error(response)
        })
    }

    $scope.getTodos = function(){
        handle($scope.Todo.getList(), 'get');
    };

    $scope.addTodo = function(){
        handle($scope.Todo.insert({
            "name": "New Item",
            "complete": false
        }), 'insert');
    };

    $scope.updateTodo = function(updateId){
        handle($scope.Todo.update(updateId, {
            "complete": true
        }), 'update');
    };

    $scope.deleteTodo = function(deleteId){
        handle($scope.Todo.delete(deleteId), 'delete');
    };
});