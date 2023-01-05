let openUI = {

	createElement: function(type, dest) {

		let a = document.createElement(type);
		dest.appendChild(a);
		return a;

	},
	stylesheet: function() {

		let a = openUI.createElement("style", document.head);
		a.innerHTML = ".hidden {visibility: hidden; display: none;}";

	},

}




openUI.stylesheet();




class EditableElement {

	constructor(type, dest, index) {

		this.container = openUI.createElement("div", dest);
		this.element = openUI.createElement(type, this.container);
		this.element.innerHTML = index;
		let over_this = this;
		this.element.addEventListener("click", function() {

			over_this.input = openUI.createElement("input", over_this.container);
			let _this = over_this;
			_this.element.classList.add("hidden");
			_this.input.value = _this.element.innerHTML;
			_this.input.addEventListener("keyup", function(src) {

				if (src.key==="Enter") {

					_this.element.innerHTML = _this.input.value;
					_this.input.remove();
					_this.element.classList.remove("hidden");

				}

			}, false);

		});

	}

}




class CommandLine {

	constructor(dest, infinitive) {

		this.log = [];
		this.input = openUI.createElement("input", dest);
		let _this = this;
		this.input.addEventListener("keyup", function(src) {

			if (src.key==="Enter") {

				let result = eval(_this.input.value);
				_this.input.value = "";

				if (infinitive) {
					_this.log.push(result);
					return result;
				} else {
					_this.log = result;
					_this.input.remove();
					return result;
				}

			}

		}, false);


	}

}




class Table {

	constructor (dest, rows, columns) {

		this.table = openUI.createElement("table", dest);
		this.column = columns;
		this.data = [];
		this.rows = [];
		this.insertRow = function(rows) {

			for (let i=0; i<rows; i++) {

				let newRow = openUI.createElement("tr", this.table);
				this.rows.push(newRow);
				this.data.push([]);

				for (let i2=0; i2<this.column; i2++) {

					let newColumn = openUI.createElement("td", newRow);
					this.data[this.data.length-1].push(newColumn);

				}

			}

		}
		this.insertColumn = function(columns) {

			for (let i=0; i<columns; i++) {

				this.column++;

				for (let i2=0; i2<this.rows.length; i2++) {

					let newColumn = openUI.createElement("td", this.rows[i2]);
					this.data[i2].push(newColumn);

				}

			}

		}
		this.editCell = function(attribute, value, row, column) {

			this.data[row][column][attribute] = value;

		}
		this.insertRow(rows);

	}

}




class OverviewTable {

	constructor(array, title, dest, func) {

		this.array = array;
		this.func = func;
		this.dest = dest;
		this.title = title;
		this.table = undefined;
		this.reload = function() {

			if (this.table!==undefined) {
				this.table.remove();
			}

			let _this = this;
			_this.table = openUI.createElement("div", _this.dest);
			_this.table.classList.add("overviewTable");
			let newTitle = openUI.createElement("h2", _this.table);
			newTitle.innerHTML = _this.title;
			let newContainer = openUI.createElement("div", _this.table);

			if (_this.array.length===0) {
				let newIndex = openUI.createElement("div", newContainer);
				let newIndexIndex = openUI.createElement("h3", newIndex);
				newIndexIndex.innerHTML = "[empty]";
				newIndex.classList.add("overviewTableIndex");
			} else {
				for (let i=0; i<_this.array.length; i++) {

					let newIndex = openUI.createElement("div", newContainer);
					let newIndexIndex = openUI.createElement("h3", newIndex);
					newIndexIndex.innerHTML = _this.array[i].title;
					newIndex.classList.add("overviewTableIndex");
					newIndex.onclick = function() {
						_this.func(newIndexIndex.innerHTML);
					}

				}
			}

		}
		this.reload();

	}

}