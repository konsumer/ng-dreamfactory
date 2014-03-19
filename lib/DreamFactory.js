angular.module('DreamFactory', []).factory('DreamFactory', function($http, $q) {
    return function(dsp_url, app_name, table) {
        $http.defaults.headers.common["X-DreamFactory-Application-Name"] = app_name;
        
        var d = {};

        var requires = function(name, chkval, val) {
            if (!chkval) {
                var o = {
                    "error": function(callback) {
                        "callback"({
                            "error": [{
                                "message": name + " is required."
                            }]
                        });
                    },
                    "success": function() {
                        return o;
                    }
                }
                return o;
            }
            return val;
        };

        d.getList = function() {
            return $http.get(dsp_url + '/db/' + table + '/');
        };

        d.getItem = function(id) {
            return requires('id', id, $http.get(dsp_url + '/db/' + table + '/' + id));
        };

        d.insert = function(record) {
            return requires('record', record, $http.post(dsp_url + '/db/' + table + '/', record));
        };

        d.update = function(id, record) {
            return requires('id & record', id && record, $http.put(dsp_url + '/db/' + table + '/' + id, record));
        };

        d.delete = function(id) {
            return requires('id', id, $http.delete(dsp_url + '/db/' + table + '/' + id));
        };

        d.login = function(email, password) {
            var deferred = $q.defer();
            $http.post(dsp_url + "/user/session", {
                "email": email,
                "password": password
            }).success(function(data, status) {
                $http.defaults.headers.common["X-DreamFactory-Session-Token"] = data.session_id;
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        };

        d.error = function(response) {
            var err = (response.error) ? response.error[0].message : "An error occurred, but the server provided no additional information.";
            return err;
        };

        return d;
    }
});