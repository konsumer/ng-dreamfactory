angular.module('DreamFactory',[])
	.factory('DreamFactory', function ($http, $q) {
		return function(dsp_url, app_name, table){
			$http.defaults.headers.common["X-DreamFactory-Application-Name"] = app_name;

			var d={};

			d.getList = function(){
				return $http.get(dsp_url + '/db/' + table + '/');
			}

			d.getItem = function(id){
				if (!id){
					var o = {error:function(callback){
						callback({error:[{message:"id is required."}]});
					}, success:function(){ return o; }}
					return o;
				}
				return $http.get(dsp_url + '/db/' + table + '/' + id);
			}

			d.insert = function(record){
				if (!record){
					var o = {error:function(callback){
						callback({error:[{message:"record is required."}]});
					}, success:function(){ return o; }}
					return o;
				}
				return $http.post(dsp_url + '/db/' + table + '/', record);
			};

			d.update = function(id, record){
				if (!id){
					var o = {error:function(callback){
						callback({error:[{message:"id is required."}]});
					}, success:function(){ return o; }}
					return o;
				}
				if (!record){
					var o = {error:function(callback){
						callback({error:[{message:"record is required."}]});
					}, success:function(){ return o; }}
					return o;
				}
				return $http.put(dsp_url + '/db/' + table + '/' + id, record);
			};

			d.delete = function(id){
				if (!id){
					var o = {error:function(callback){
						callback({error:[{message:"id is required."}]});
					}, success:function(){ return o; }}
					return o;
				}
				return $http.delete(dsp_url + '/db/' + table + '/' + id);
			};

	        d.login = function(email, password){
	        	var deferred = $q.defer();
	        	 $http.post(dsp_url + "/user/session", {"email":email, "password":password})
	        		.success(function(data, status) {
	        			$http.defaults.headers.common["X-DreamFactory-Session-Token"] = data.session_id;
	        			deferred.resolve(data);
	        		})
	        		.error(deferred.reject);
	        	return deferred.promise;
	        }

	        d.error = function(response){
	        	var err = (response.error) ? 
	                response.error[0].message :
	                "An error occurred, but the server provided no additional information.";
	            return err;
	        }

	        return d;
		}
	});