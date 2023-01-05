let open = {

	element: {

		create: function(type, dest) {

			let newElement = document.createElement(type);
			dest.appendChild(newElement);
			return newElement;

		},
		remove: function(element) {

			element.remove();
			return element;

		},
		read: function(element) {

			return element;

		},
		edit: function(element, attribute, value) {

			element[attribute] = value;
			return element;

		},
		show: function(element) {

			element.classList.remove("hidden");
			return element;

		},
		hide: function(element) {

			element.classList.add("hidden");
			return element;

		},

	},
	array: {

		run: function(array, func) {

			for (let i=0; i<array.length; i++) {

				func(array[i]);

			}

		},

	},
	stylesheet: function() {

		let a = open.element.create("style", document.head);
		a.innerHTML = ".hidden {visibility: hidden; display: none;}";

	}

}




open.stylesheet()




class AjaxCall {

	constructor(url) {

		this.url = url;
		this.response = undefined;
		this.call = function() {

			let _this = this;
			let xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = function() {

				if (this.readyState==4 && this.status==200) {
					_this.response = JSON.parse(this.responseText);
				}

			}

			xhttp.open("GET", _this.url, true);
			xhttp.send();

		}
		this.call();

	}

}




class Link {

	constructor(url) {

		this.url = url;
		let _this = this;
		this.open = {

			thisTab: function() {

				location.href = _this.url;

			},
			newTab: function() {

				window.open(_this.url);

			},

		}

	}

}