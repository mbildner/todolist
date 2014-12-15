;(function (document, window) {
	/**
	 * list-form factory function
	 * @param  {HTMLElement} formOptions.rootElement DOM element on which to mount form
	 * @param  {String} formOptions.name
	 * @param  {String} formOptions.method HTTP method to use, typically GET or POST
	 * @param  {String} formOptions.action URI for the form to access
	 * @param  {Function} formOptions.validate validate item input text
	 * @return {Object} form controller object
	 * @return {Function}
	 */
	function getForm (formOptions) {
		// get defaults
		// do we need to make our own root node?
		var userProvidedRootElement = (formOptions.root &&
			formOptions.root.nodeType > 0);

		var rootElement = userProvidedRootElement ? formOptions.root : create('div');
		var formName = formOptions.name;
		var method = formOptions.method || 'POST';
		var action = formOptions.action || '';
		if (!action) {
			console.warn('no action provided on initialization,' +
				'action must be added programmatically. Use:\n' +
				'myForm.action(\'/some/route/on/server\');');
		}

		var validate = formOptions.validate || function () {};
		// list model
		var items = [];

		/**
		 * get a clean version of the items list
		 * @return {<Array<String>}
		 */
		function getStrippedItems () {
			return items.map(function (item) {
				return item.text;
			});
		}

		/**
		 * factory function to get list item
		 * @param  {String} text
		 * @return {Object<HTMLElement, String>}
		 */
		function getItem (text) {
			var element = create('div');
			element.textContent = text;
			element.classList.add('todo-item');

			var item = {
				element: element,
				text: text
			};

			return item;
		}

		/**
		 * add a todo item to our list
		 * @param {String} text
		 */
		function addItem (text) {
			if (!validate(text)) {
				return;
			}

			var item = getItem(text);

			items.unshift(item);

			formListViewMount.insertBefore(item.element, formListViewMount.firstChild);

			// handle item removal
			var clearElementListener = handle(item.element, 'click', function (event) {
				var element = event.target;
				clearElementListener();
				element.parentElement.removeChild(event.target);
				// don't shadow `item`
				items = items.filter(function (fItem) {
					return fItem.element !== event.target;
				});
			});

		}

		function handleAddItemClick (event) {
			// stop form from submitting
			event.preventDefault();
			var text = addItemInput.value;

			addItemInput.value = '';
			addItem(text);

			return false;
		}

		// DOM manipulation
		var form = create('form');
		form.name = name;
		form.method = method;
		form.action = action;

		var addItemInput = create('input');
		addItemInput.classList.add('add-input');

		var addItemButton = create('button');
		addItemButton.classList.add('add-button');
		addItemButton.textContent = 'ADD';

		var hiddenInput = create('input');
		hiddenInput.type = 'hidden';
		hiddenInput.name = 'list';

		var submitButton = create('button');
		submitButton.textContent = 'Submit List';
		submitButton.classList.add('submit-button');

		var formListViewMount = create('div');

		if (!userProvidedRootElement) {
			document.body.appendChild(rootElement);
		}

		var formDocFragment = document.createDocumentFragment();

		formDocFragment.appendChild(form);
		form.appendChild(addItemInput);
		form.appendChild(addItemButton);
		form.appendChild(submitButton);
		form.appendChild(formListViewMount);
		form.appendChild(hiddenInput);

		function updateHiddenInput () {
			var stripped = getStrippedItems();
			var asString = JSON.stringify(stripped);
			hiddenInput.value = asString;
		}
		var clearAddButtonListener = handle(addItemButton, 'click', handleAddItemClick);

		handle(form, 'submit', function (event) {
			updateHiddenInput();
		});

		// mount the fragment
		rootElement.appendChild(formDocFragment);

		function clear () {
			items = [];
		}

		// build return object
		var controller = {};
		controller.submit = function () { updateHiddenInput(); form.submit(); };
		controller.items = getStrippedItems;
		controller.clear = clear;
		controller.action = function (action) { form.action = action; };
		controller.addItem = addItem;
		controller.validate = function (validationFunc) {
			validate = validationFunc;
		};

		return controller;

	}

	// expose api
	window.mhbGetForm = getForm;

	// helpers
	/**
	 * wrapper to add event listeners
	 * @param  {HTMLElement} element
	 * @param  {String} event
	 * @param  {Function} handler
	 * @return {Function}         function to remove this event listener, to help avoid memory leaks
	 */
	function handle (element, event, handler) {
		element.addEventListener(event, handler);
		return element.removeEventListener.bind(element, handler);
	}

	/**
	 * wrapper for document.createElement
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
	function create (tagName) {
		return document.createElement(tagName);
	}


})(document, window);
