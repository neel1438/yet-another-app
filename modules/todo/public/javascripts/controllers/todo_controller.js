angular.module('todoController', [])
	.controller('todoCtrl',['$scope','todo',function ($scope,todo) {
	$scope.formData={};
	todo.get()
		.success(function(data) {
			$scope.todos = data;
		});
	$scope.createTodo = function() {
		if (!$.isEmptyObject($scope.formData)) {
			todo.post($scope.formData)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.todos = data; 
				});
		}
	};
	$scope.deleteTodo = function(id) {
		todo.delete(id)
			.success(function(data) {
				$scope.todos= data; 
			});
	};
}]);