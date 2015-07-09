# Simple AngularJS TODO App
Calls TODO App,
JavaScript (AngularJS)

Detailed documentation concerning App.js functionality can be found in the comments inside the JS file.

# Global

* * *

### $scope.sortType

Set the default sort type (by Name or by Time)

**Type**: `String`

### $scope.sortReverse

Set the default sort order

**Type**: `Boolean`

### $scope.nextTodo

Object containing the next to-do item, sorted by time.
Used for displaying the next item in the Next Item table

**Type**: `Object`

### $scope.init()

init
Initialize the App

### $scope.show

By default show all entries
**type** `String`

### $scope.addTodo()

Adding a new TODO entry
Before the entry is added the app passes through several validations for Name, Phone, and Time, to make sure all entries are in the correct format.
After that the entry is added at the beginning of the todo array

**Members**

+timeRe
+phoneRe
+timeMembers

### $scope.deleteTodo(item)

Deleting a TODO entry

**Parameters**

**item**: `Object`



### $scope.getCurrentTime()

Getting current time from the Date object and formatting it to HH:MM

**Returns**: `String`


### $scope.dateCompare(time1, time2)

Comparing times. Returns 1 if greater, -1 if less and 0 if the same

**Parameters**

**time1**: `String`

**time2**: `String`

**Returns**: `Number`


### $scope.showFn(todo)

Filter Function for All | Next | Finished.
Checks if todo entry belongs to one of these categories

**Parameters**

**todo**: `Object`

Checks if todo entry belongs to one of these categories

**Returns**: `Boolean`


### $scope.getNextTodo()

Getting the next TODO entry if any

**Returns**: `Object`

### ordered

First order the todo list to increasing values by time

**type**: `Array`

* * *










