plugin = {

	add: function(src) {

		if (data.activeUser!==undefined) {

			src = "./plugins/" + src

			data.userData[data.activeUser].plugins.push(src);
			let tempPlugAdd = open.element.create("script", document.head);
			tempPlugAdd.src = src;
			data.activePluginElements.push(tempPlugAdd);
			localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

			return "plugin added"

		}

	},
	remove: function(src) {

		if (data.activeUser!==undefined) {

			src = "./plugins/" + src

			for (let i=0; i<data.userData[data.activeUser].plugins.length; i++) {

				if (data.userData[data.activeUser].plugins[i]===src) {

					data.userData[data.activeUser].plugins.splice(i, 1);
					localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

					for (let i2=0; i2<data.activePluginElements.length; i2++) {

						if (data.activePluginElements[i].src===src) {
							data.activePluginElements[i].remove();
							return "removed plugin"
						}

					}

				}

			}

		}

	},
	list: function() {

		if (data.activeUser!==undefined) {
			return data.userData[data.activeUser].plugins
		}

	}

}