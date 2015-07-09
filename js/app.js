"use strict";

var App = angular.module("CallsTODOApp", ["LocalStorageModule"]); // Using LocalStorageModule for simplified local storage acces with cookie fallback https://github.com/grevory/angular-local-storage

App.controller("CallsTODO", function ($scope, $filter, localStorageService) {

	/**
	 * set the default sort type (by Name or by Time)
	 * @type {String}
	 */
	$scope.sortType = 'time';

	/**
	 * set the default sort order
	 * @type {Boolean}
	 */
	$scope.sortReverse  = false;

	/**
	 * Object containing the next to-do item, sorted by time.
	 * Used for displaying the next item in the Next Item table
	 * @type {Object}
	 */
	$scope.nextTodo = {name: "", phone:"", time:""};

	/**
	 * init
	 * Initialize the App
	 */
	$scope.init = function () {

		/**
		 * check if there is already a Local Storage entry for this app
		 * If there is load it and parse JSON string to Object
		 */
		if (!localStorageService.get("todoCallsList")) {

			// Test values when there is no Local Storage entries
			$scope.todos = [
				{ name: "Janko Marko", phone:"00420777888999", time:"09:20", isDone: false },
				{ name: "John Waters", phone:"00420777888991", time:"09:30", isDone: true },
				{ name: "Jackson Wille", phone:"00420777888920", time:"10:20", isDone: false },
				{ name: "Peter Petrelli", phone:"00420777888777", time:"14:11", isDone: false }
			];
		}else{
			$scope.todos = angular.fromJson(localStorageService.get("todoCallsList"));
		}

		/**
		 * By default show all entries
		 * @type {String}
		 */
		$scope.show = "All";
	};

	/**
	 * Adding a new TODO entry
	 * Before the entry is added the app passes through several validations for Name, Phone, and Time, to make sure all entries are in the correct format.
	 * After that the entry is added at the beginning of the todo array
	 */
	$scope.addTodo = function () {

		// RegExp validated using: https://regex101.com
		/**
		 * Validating if time is correct format of HH:MM
		 *  ^ assert position at start of the string
		 *  1st Capturing group ([0-9]|0[0-9]|1[0-9]|2[0-3])
		 *  1st Alternative: [0-9]
		 *  [0-9] match a single character present in the list below
		 *  0-9 a single character in the range between 0 and 9
		 *  2nd Alternative: 0[0-9]
		 *  0 matches the character 0 literally
		 *  [0-9] match a single character present in the list below
		 *  0-9 a single character in the range between 0 and 9
		 *  3rd Alternative: 1[0-9]
		 *  1 matches the character 1 literally
		 *  [0-9] match a single character present in the list below
		 *  0-9 a single character in the range between 0 and 9
		 *  4th Alternative: 2[0-3]
		 *  2 matches the character 2 literally
		 *  [0-3] match a single character present in the list below
		 *  0-3 a single character in the range between 0 and 3
		 *  : matches the character : literally
		 *  [0-5] match a single character present in the list below
		 *  0-5 a single character in the range between 0 and 5
		 *  [0-9] match a single character present in the list below
		 *  0-9 a single character in the range between 0 and 9
		 *  $ assert position at end of the string
		 * @type {RegExp}
		 */
		var timeRe=/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,

			/**
			 * Validating if the phone number is in the correct format
			 * ^ assert position at start of a line
			 * 1st Capturing group (00|\+)
			 * 1st Alternative: 00
			 * 00 matches the characters 00 literally
			 * 2nd Alternative: \+
			 * \+ matches the character + literally
			 * [(]? match a single character present in the list below
			 * Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
			 * ( the literal character (
			 * [0-9]{3} match a single character present in the list below
			 * Quantifier: {3} Exactly 3 times
			 * 0-9 a single character in the range between 0 and 9
			 * [)]? match a single character present in the list below
			 * Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
			 * ) the literal character )
			 * [-\s]? match a single character present in the list below
			 * Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
			 * - the literal character -
			 * \s match any white space character [\r\n\t\f ]
			 * [0-9]{3} match a single character present in the list below
			 * Quantifier: {3} Exactly 3 times
			 * 0-9 a single character in the range between 0 and 9
			 * [\s]? match a single character present in the list below
			 * Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
			 * \s match any white space character [\r\n\t\f ]
			 * [0-9]{3} match a single character present in the list below
			 * Quantifier: {3} Exactly 3 times
			 * 0-9 a single character in the range between 0 and 9
			 * [\s]? match a single character present in the list below
			 * Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
			 * \s match any white space character [\r\n\t\f ]
			 * [0-9]{3} match a single character present in the list below
			 * Quantifier: {3} Exactly 3 times
			 * 0-9 a single character in the range between 0 and 9
			 * $ assert position at end of a line
			 * i modifier: insensitive. Case insensitive match (ignores case of [a-zA-Z])
			 * m modifier: multi-line. Causes ^ and $ to match the begin/end of each line (not only begin/end of string)
			 * @type {RegExp}
			 */
			phoneRe = /^(00|\+)[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[\s]?[0-9]{3}[\s]?[0-9]{3}$/im,
			timeMembers;

		// Check if the entry contains anything else except blank spaces or anything at all
		if (!/\S/.test($scope.newName)) {
			window.alert("Name Entry is Empty");
			return;
		}

		// Check if the entry does not exceed the maximum of 30 characters
		if ($scope.newName.length > 30) {
			window.alert("Name Entry Too Long");
			return;
		}

		// Validating if the phone number entry is in the required format
		if(!phoneRe.test($scope.newPhone)){
			window.alert("Invalid Phone Number Entry");
			return;
		}

		// Removing all the special characters, replacing + symbol with 00 and removing blank spaces to unify the format of the phone number entries
		$scope.newPhone = $scope.newPhone.replace(/\+/g, "00").replace(/\-|\s|\(|\)/g, "");

		// Validating if the time entry is in the required format
		if(!timeRe.test($scope.newTime)){
			window.alert("Invalid Time Entry");
			return;
		}

		// Assuring that the time entry format is HH::MM for easier sorting
		timeMembers = $scope.newTime.split(":");
		if(timeMembers[0].length < 2){
			$scope.newTime = "0"+$scope.newTime;
		}

		//prepend new entry  to array
		$scope.todos.splice(0, 0, {name: $scope.newName, phone: $scope.newPhone, time:$scope.newTime,  isDone: false });

		//Reset the Fields
		$scope.newName = "";
		$scope.newPhone = "";
		$scope.newTime = "";
	};

	/**
	 * Deleting a TODO entry
	 * @param item
	 */
	$scope.deleteTodo = function (item) {
		var index = $scope.todos.indexOf(item);
		$scope.todos.splice(index, 1);
	};

	/**
	 * Getting current time from the Date object and formatting it to HH:MM
	 * @returns {string}
	 */
	$scope.getCurrentTime = function(){
		var currentdate = new Date();
		return currentdate.getHours() + ":" + currentdate.getMinutes();
	};

	/**
	 * Comparing times. Returns 1 if greater, -1 if less and 0 if the same
	 * @param time1
	 * @param time2
	 * @returns {number}
	 */
	$scope.dateCompare = function(time1,time2) {
		var t1 = new Date(), t2, parts;

		parts = time1.split(":");
		t1.setHours(parts[0],parts[1],0,0);

		t2 = new Date();
		parts = time2.split(":");
		t2.setHours(parts[0],parts[1],0,0);

		if (t1.getTime()>t2.getTime()) return 1;
		if (t1.getTime()<t2.getTime()) return -1;
		return 0;
	};

	/**
	 * Filter Function for All | Next | Finished.
	 * Checks if todo entry belongs to one of these categories
	 * @param todo
	 * @returns {boolean}
	 */
	$scope.showFn = function (todo) {

		if ($scope.show === "All") {
			return true;
		}else if(todo.isDone && $scope.show === "Finished"){ // if entry is finished and current category is finished
			return true;
		}else if($scope.dateCompare(todo.time, $scope.getCurrentTime()) > -1 && !todo.isDone && $scope.show === "Next"){ // if entry is not finished and it's time is greater than current time
			return true;
		}else{
			return false;
		}
	};

	/**
	 * Getting the next TODO entry if any
	 * @returns {Object}
	 */
	$scope.getNextTodo = function () {

		/**
		 * First order the todo list to increasing values by time
		 * @type {Array}
		 */
		var ordered = $filter('orderBy')($scope.todos, 'time', false);

		// Find in the ordered array an entry that is not yet finished and it's time is grater than current time
		for(var i = 0, l = ordered.length; i < l; i++){
			if($scope.dateCompare(ordered[i].time, $scope.getCurrentTime()) > -1 && !ordered[i].isDone){
				return ordered[i];
			}
		}

		// If there is no entry that fulfills the conditions save empty entry
		return {name: "", phone:"", time:""};
	};

	/**
	 * Watching the todos array for changes
	 * On every change update the Local Storage and Next Item
	 */
	$scope.$watch("todos",function (newVal,oldVal) {

		if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
			localStorageService.add("todoCallsList", angular.toJson(newVal));
		}

		$scope.nextTodo = $scope.getNextTodo();

	}, true);

});

/**
 * Angular.js directive that enables adding entries on Enter
 */
App.directive("ngEnter",function  () {

	return function  (scope, elem) {
		$(elem).keyup(function  (e) {
			if (e.keyCode === 13) {
				scope.$apply(function (){
					scope.addTodo();//Call addTodo defined inside controller
				});
			}
		});
	};
});