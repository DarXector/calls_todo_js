# Simple AngularJS TODO App
Calls TODO App,
JavaScript (AngularJS)

# Global

* * *

### sortType
Set the default sort type (by Name or by Time)
**Type**" `string`

### sortReverse
Set the default sort order
**Type**" `Boolean`

### nextTodo
Object containing the next to-do item, sorted by time.
Used for displaying the next item in the Next Item table
**Type**" `Object`

### init()

init
Initialize the App



### addTodo()

Adding a new TODO entry
Before the entry is added the app passes through several validations for Name, Phone, and Time, to make sure all entries are in the correct format.
After that the entry is added at the beginning of the todo array



### deleteTodo(item)

Deleting a TODO entry

**Parameters**

**item**: , Deleting a TODO entry



### getCurrentTime()

Getting current time from the Date object and formatting it to HH:MM

**Returns**: `string`


### dateCompare(time1, time2)

Comparing times. Returns 1 if greater, -1 if less and 0 if the same

**Parameters**

**time1**: , Comparing times. Returns 1 if greater, -1 if less and 0 if the same

**time2**: , Comparing times. Returns 1 if greater, -1 if less and 0 if the same

**Returns**: `number`


### showFn(todo)

Filter Function for All | Next | Finished.
Checks if todo entry belongs to one of these categories

**Parameters**

**todo**: , Filter Function for All | Next | Finished.
Checks if todo entry belongs to one of these categories

**Returns**: `boolean`


### getNextTodo()

Getting the next TODO entry if any

**Returns**: `Object`



* * *










