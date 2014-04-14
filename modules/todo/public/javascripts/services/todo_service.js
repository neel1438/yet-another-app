angular.module('todoService', [])
	.factory('todo', ['$http' , function ($http) {
		return {
			get : function() {
				return $http.get('/todos')
			},
			post : function(formData){
				return $http.post('/todos',formData)
			},
			delete : function(id){
				return $http.delete('/todos/'+id)
			}
		}
	}]);
