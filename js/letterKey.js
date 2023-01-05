let letterKey = {

	createKey: function() {

		let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];
		let keyLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];
		let key = {};

		for (let i=0; i<letters.length; i++) {

			let value = Math.round(Math.random() * (keyLetters.length-1));
			key[letters[i]] = keyLetters[value];
			keyLetters.splice(value, 1);

			if (i===letters.length-1) {
				key = JSON.stringify(key);
				return key;
			}

		}

	},
	encrypt: function(text, key) {

		text = text.split("");
		let result = "";
		key = JSON.parse(key);
		let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];

		for (let i=0; i<text.length; i++) {

			result += key[text[i]];

			if (i===text.length-1) {
				return result;
			}

		}

	},
	decrypt: function(text, key) {

		key = JSON.parse(key);
		text = text.split("");
		let result = "";
		let antiKey = {};
		let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];

		for (let i=0; i<letters.length; i++) {

			antiKey[key[letters[i]]] = letters[i];

			if (i===letters.length-1) {

				for (let i2=0; i2<text.length; i2++) {

					result += antiKey[text[i2]]

					if (i2===text.length-1) {
						return result;
					}

				}
			}

		}

	}
}