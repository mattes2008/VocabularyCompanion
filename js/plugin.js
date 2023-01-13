plugin = {

	add: function(src) {

		src = "./plugins/" + src

		data.plugins.plugins.push(src);
		localStorage.setItem("vocabularyCoach_plugins", JSON.stringify(data.plugins.plugins))
		let tempPlugAdd = open.element.create("script", document.head);
		tempPlugAdd.src = src;
		data.plugins.active.push(tempPlugAdd);
		return "plugin added"

	},
	remove: function(src) {

		src = "./plugins/" + src

		for (let i=0; i<data.plugins.plugins.length; i++) {

			if (data.plugins.plugins[i]===src) {

				data.plugins.plugins.splice(i, 1);
				localStorage.setItem("vocabularyCoach_plugins", JSON.stringify(data.plugins.plugins));

				for (let i2=0; i2<data.plugins.active.length; i2++) {

					data.plugins.active[i2].remove()

					if (i2===data.plugins.active.length-1) {

						data.plugins.active = [];

						if (data.plugins.plugins.length===0) {
							return "removed plugin"
						} else {

							for (let i3=0; i3<data.plugins.plugins.length; i3++) {

								let tempLoad = open.element.create("script", document.head);
								tempLoad.src = data.plugins.plugins[i3];
								data.plugins.active.push(tempLoad);

								if (i3===data.plugins.plugins.length-1) {
									return "removed plugin"
								}

							}

						}

					}

				}

			}

		}

	},
	list: function() {

			return data.plugins.plugins

	}

}


class OverviewTablePlugin {

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
					newIndexIndex.innerHTML = _this.array[i];
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