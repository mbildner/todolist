todolist
========

Todo list in vanilla js, html and css

Usage
-----

Add the form component by including `<script src="app.js"></script>`, the script will expose a single global function `mhbGetForm`.

API
---

`mhbGetForm` takes a single argument, which is an object with the following keys:

	- root (optional): a root element on which to render the form
	- action (optional): a uri to submit the form
	- validate (optional): a function to test text with before adding it to the list
	- method: the http method to use to submit the form

Example:

	```JavaScript
	var listForm = mhbGetForm({
		root: document.getElementById('mountpoint'),
		action: '/test/post',
		method: 'POST',
		validate: function (text) {
			return text.length > 0;
		}
	});
	```

`mhbGetForm` returns a controller object, which can set (or change) these values after the form has been initialized.

Example:

	```JavaScript
	var listForm = mhbGetForm({
		root: document.getElementById('mountpoint')
	});

	listForm.action('/test/post');
	listForm.method('POST');
	listForm.validate(function (text) {
		return /cool stuff/.test(text);
	});
	```

The controller also exposes the ability to inspect its model, and to add items, and to submit the list programmatically.

	```JavaScript
	var listForm = mhbGetForm({
		root: document.getElementById('mountpoint'),
		action: '/test/post',
		method: 'POST',
		validate: function (text) {
			return text.length > 0;
		}
	});

	listForm.addItem('cool new item');
	listForm.addItem('and another!');

	listForm.items(); // ['and another', 'cool new item'];

	listForm.submit(); // boom!
	```
