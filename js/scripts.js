let data = {

	activeUser: undefined,

}




function bodyOnLoad () {

	data.userData = JSON.parse(localStorage.getItem("vocabularyCoach_userData"));

	if (data.userData===null) {
		data.userData = {};
	}
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

	if (localStorage.getItem("vocabularyCoach_mainKey")===null) {
		localStorage.setItem("vocabularyCoach_mainKey", letterKey.createKey());
	}
	document.getElementById('startPractisingSrcToTar').checked = true;

}




function signIn (username, password) {

	if (data.userData[username]!==undefined) {
		if (letterKey.decrypt(data.userData[username].password, localStorage.getItem("vocabularyCoach_mainKey"))===password) {
			data.activeUser = username;
			document.getElementById("login").classList.add("hidden");
			document.getElementById("main").classList.remove("hidden");
			reloadOverviewTable();
		}
	}

}


function signUp (username, password, repeated) {

	if (data.userData[username]==undefined) {
		if (password===repeated) {
			data.userData[username] = {

				userKey: letterKey.createKey(),
				password: letterKey.encrypt(password, localStorage.getItem("vocabularyCoach_mainKey")),
				vocabUnits: [],

			}

			localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
			alert("Your account has been created");
			cancelSignUp();
			signIn(username, password);

		} else {
			alert("Your account hasn't been created: Something went wrong");
		}
	} else {
		alert("Your account hasn't been created: The account " + username + " already exists");
	}


}


function cancelSignUp () {

	document.getElementById("createAccount").classList.add("hidden");

}




function reloadOverviewTable () {

	document.getElementById("overviewTable").innerHTML = "";
	data.overviewTable = new OverviewTable(data.userData[data.activeUser].vocabUnits, "&nbsp;&nbsp;&nbsp;&nbsp;Units", document.getElementById("overviewTable"), function(src) {readUnit(src); document.getElementById('unitDisplayTitle').value = data.userData[data.activeUser].vocabUnits[data.activeUnit].title; document.getElementById('unitDisplaySource').value = data.userData[data.activeUser].vocabUnits[data.activeUnit].sourceLanguage; document.getElementById('unitDisplayTarget').value = data.userData[data.activeUser].vocabUnits[data.activeUnit].targetLanguage;})
	let temp = open.element.create("div", data.overviewTable.table);
	temp.style = "text-align: right; font-weight: bold; font-size: 30px;";
	temp.innerHTML = "+&nbsp;&nbsp;";
	temp.addEventListener("click", function(){document.getElementById('mainCreateUnitTitle').value = ''; document.getElementById('mainCreateUnitLanguage1').value = ''; document.getElementById('mainCreateUnitLanguage2').value = ''; document.getElementById('mainCreateUnit').classList.remove('hidden');});

}




function createUnit (title, firstLanguage, secondLanguage) {

	 if (data.userData[data.activeUser].vocabUnits.length===0) {

		data.userData[data.activeUser].vocabUnits.push({

			title: title,
			sourceLanguage: firstLanguage,
			targetLanguage: secondLanguage,
			vocabList: [],

		})
		alert("Your unit has been created.")
		document.getElementById("mainCreateUnit").classList.add("hidden");
		reloadOverviewTable();
		localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

	} else {
		for (let i=0; i<data.userData[data.activeUser].vocabUnits.length; i++) {

			if (data.userData[data.activeUser].vocabUnits[i].title===title) {
				alert("Your unit hasn't been created: Unit " + title + " already exists.")
				break
			} else if (i===data.userData[data.activeUser].vocabUnits.length-1) {

				data.userData[data.activeUser].vocabUnits.push({

					title: title,
					sourceLanguage: firstLanguage,
					targetLanguage: secondLanguage,
					vocabList: [],

				})
				alert("Your unit has been created.")
				document.getElementById("mainCreateUnit").classList.add("hidden");
				reloadOverviewTable();
				localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
				break


			}

		}
	}

}


function cancelCreateUnit () {

	document.getElementById("mainCreateUnit").classList.add("hidden");

}




function readUnit (title) {

	document.getElementById("unitDisplay").classList.remove("hidden");
	document.getElementById("main").classList.add("hidden");

	for (let i=0;i<data.userData[data.activeUser].vocabUnits.length; i++) {

		if (data.userData[data.activeUser].vocabUnits[i].title===title) {
			data.activeUnit = i;
			break
		}

	}

	reloadVocabTable();

}


function reloadVocabTable () {

	document.getElementById("unitDisplayVocabTable").innerHTML = ""
	data.vocabTable = new Table(document.getElementById("unitDisplayVocabTable"), 0, 2)
	data.vocabTable.table.style = "margin-left: 82.5px;";

	if (data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length===0) {
		data.vocabTable.insertRow(1);
		data.vocabTable.editCell("innerHTML", "[empty]", 0, 0);
	} else {

		for (let i=0; i<data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length; i++) {

			data.vocabTable.insertRow(1);

			data.vocabTable.editCell("innerHTML", data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[i].source, i, 0);
			data.vocabTable.editCell("innerHTML", data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[i].target, i, 1);

			data.vocabTable.rows[i].addEventListener("click", function() {document.getElementById("readUnitEditVocab").classList.remove("hidden"); document.getElementById("readUnitEditVocabSource").value = data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[i].source; document.getElementById("readUnitEditVocabTarget").value = data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[i].target; data.activeVocab = i;})

		}

	}

}


function deleteUnit () {

	data.userData[data.activeUser].vocabUnits.splice(data.activeUnit, 1);
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
	cancelReadUnit();

}


function cancelReadUnit () {

	document.getElementById("unitDisplay").classList.add("hidden");
	document.getElementById("main").classList.remove("hidden");
	data.activeUnit = undefined;
	reloadOverviewTable();

}




function createVocab () {

	data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.push({

		source: document.getElementById("readUnitCreateVocabSource").value,
		target: document.getElementById("readUnitCreateVocabTarget").value,

	})
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
	cancelCreateVocab();

}


function cancelCreateVocab () {

	document.getElementById("readUnitCreateVocab").classList.add("hidden");
	reloadVocabTable();

}




function editVocab () {

	data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.activeVocab].source = document.getElementById("readUnitEditVocabSource").value;
	data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.activeVocab].target = document.getElementById("readUnitEditVocabTarget").value;
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
	cancelEditVocab();

}


function cancelEditVocab () {

	document.getElementById("readUnitEditVocab").classList.add("hidden");
	data.activeVocab = undefined;
	reloadVocabTable();

}


function editVocabDelete () {

	data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.splice(data.activeVocab, 1);
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
	cancelEditVocab();

}




function cancelPractising () {

	document.getElementById("startPractising").classList.add("hidden");

}