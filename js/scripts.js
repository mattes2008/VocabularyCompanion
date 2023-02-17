let data = {

	activeUser: undefined,
	log: [],
	practising: {

		activeVoc: undefined,
		remaining: [],
		direction: "",
		result: [],

	},
	activePluginElements: [],
	plugins: {

		plugins: [],
		active: [],

	}

}


document.addEventListener ("keyup", function (src) {

	if (src.key==="Escape") {
		document.getElementById("console").classList.toggle("hidden")
		reloadConsole()
		document.getElementById("consoleCommandLine").select()
	}

}, false)




function bodyOnLoad () {

	if (JSON.parse(localStorage.getItem("vocabularyCoach_userData"))===null) {
		document.getElementById("acceptLocalStorage").classList.remove("hidden");
	} else {
		acceptLocalStorage();
	}
	data.clockInterval = setInterval(function() {reloadClock()}, 1000);

}


function acceptLocalStorage () {

	document.getElementById("acceptLocalStorage").classList.add("hidden");
	data.userData = JSON.parse(localStorage.getItem("vocabularyCoach_userData"));


	if (data.userData===null) {
		data.userData = {};
	}
	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

	if (localStorage.getItem("vocabularyCoach_remainSignedIn")===null) {
		localStorage.setItem("vocabularyCoach_remainSignedIn", "empty")
	}

	if (localStorage.getItem("vocabularyCoach_plugins")===null) {
		localStorage.setItem("vocabularyCoach_plugins", JSON.stringify([]))
		data.plugins.plugins = []
	} else {
		data.plugins.plugins = JSON.parse(localStorage.getItem("vocabularyCoach_plugins"))
	}



	if (localStorage.getItem("vocabularyCoach_mainKey")===null) {
		localStorage.setItem("vocabularyCoach_mainKey", letterKey.createKey());
	}
	document.getElementById('startPractisingSrcToTar').checked = true;

	if (localStorage.getItem("vocabularyCoach_remainSignedIn")!=="empty") {
		signIn(JSON.parse(localStorage.getItem("vocabularyCoach_remainSignedIn")), letterKey.decrypt(data.userData[JSON.parse(localStorage.getItem("vocabularyCoach_remainSignedIn"))].password, localStorage.getItem("vocabularyCoach_mainKey")));
	}

	for (let i=0; i<data.plugins.plugins.length; i++) {

		let tempLoad = open.element.create("script", document.head);
		tempLoad.src = data.plugins.plugins[i];
		data.plugins.active.push(tempLoad);

	}

}




function signIn (username, password) {

	if (data.userData[username]!==undefined) {
		if (letterKey.decrypt(data.userData[username].password, localStorage.getItem("vocabularyCoach_mainKey"))===password) {
			data.activeUser = username;
			document.getElementById("login").classList.add("hidden");
			document.getElementById("main").classList.remove("hidden");
			reloadOverviewTable();
			style.change(data.userData[data.activeUser].style);

			if (document.getElementById("remainSignedIn").checked===true) {
				localStorage.setItem("vocabularyCoach_remainSignedIn", JSON.stringify(username));
			}

		}
	}

}


function signUp (username, password, repeated) {

	let ver = document.getElementById("sidebarVersionNumber").innerHTML.split(" ")[2];

	if (data.userData[username]==undefined) {
		if (password===repeated) {
			data.userData[username] = {

				userKey: letterKey.createKey(),
				password: letterKey.encrypt(password, localStorage.getItem("vocabularyCoach_mainKey")),
				style: "dark",
				version: ver,
				vocabUnits: [],
				statistics: {

					totalStars: 0,
					percent: 0,
					tries: 0,
					perfectTries: 0,

				},

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
			statistics: {

				percent: 0,
				tries: 0,
				perfectTries: 0,

			}

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

	document.getElementById("unitStatisticPercentDisplay").innerHTML = "&oslash;&nbsp;Success Ratio:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent + "&percnt;";
	document.getElementById("unitStatisticTriesDisplay").innerHTML = "&star;&nbsp;Tries:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.tries
	document.getElementById("unitStatisticPerfectTriesDisplay").innerHTML = "&starf;&nbsp;Perfect Tries:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.perfectTries

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


function startPractising () {

	data.practising.activeVoc = undefined
	data.practising.activeVocab = undefined
	data.practising.direction = ""
	data.practising.remaining = []
	data.practising.result = []
	data.practising.roundedPercent = undefined

	if (document.getElementById("startPractisingSrcToTar").checked) {
		data.practising.direction = "srcToTar";
	} else if (document.getElementById("startPractisingTarToSrc").checked) {
		data.practising.direction = "tarToSrc";
	}

	for (let i=0; i<data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length; i++) {

		data.practising.remaining.push(i);

		if (i===data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length-1) {
			document.getElementById("unitDisplay").classList.add("hidden");
			document.getElementById("practise").classList.remove("hidden");
			cancelPractising();
			nextTask();
		}

	}

}




function nextTask () {

	data.practising.activeVocab = Math.round(Math.random() * (data.practising.remaining.length-1));

	if (data.practising.direction==="srcToTar") {
		document.getElementById("practiseSourceVocab").innerHTML = data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].source;
	} else if (data.practising.direction==="tarToSrc") {
		document.getElementById("practiseSourceVocab").innerHTML = data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].target;
	}

	document.getElementById("practiseInput").value = "";
	document.getElementById("practiseInput").select();

	document.getElementById("practiseOutput").innerHTML = "Type in your answer!"
	document.getElementById("practiseOutput").classList.remove("greenDisplay");
	document.getElementById("practiseOutput").classList.remove("redDisplay");
	document.getElementById("practisingConfirm").style = "background-color: green;";
	document.getElementById("practisingConfirm").onclick = function() {practisingConfirm();};
	document.getElementById("practisingProgress").innerHTML = "Progress: " + (data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length-data.practising.remaining.length) + " / " + data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length;

}


function practisingConfirm () {

	if (data.practising.direction==="srcToTar") {
		if (document.getElementById("practiseInput").value===data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].target) {
			document.getElementById("practiseOutput").innerHTML = "&check;&nbsp;&nbsp; - &nbsp;&nbsp;Great! You're right."
			document.getElementById("practiseOutput").classList.add("greenDisplay");
			data.practising.remaining.splice(data.practising.activeVocab, 1);
			data.practising.result.push(true);
			document.getElementById("practisingConfirm").style = "background-color: #777777;";
			document.getElementById("practisingConfirm").onclick = "";
			if (data.practising.remaining.length===0) {
				prepareResult();
			}
		} else {
			document.getElementById("practiseOutput").innerHTML = "&times;&nbsp;&nbsp; - &nbsp;&nbsp;Sorry! There's a mistake. The right word was <b>" + data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].target + "</b>."
			document.getElementById("practiseOutput").classList.add("redDisplay");
			data.practising.result.push(false);
			document.getElementById("practisingConfirm").style = "background-color: #777777;";
			document.getElementById("practisingConfirm").onclick = "";
		}
	} else if (data.practising.direction==="tarToSrc") {
		if (document.getElementById("practiseInput").value===data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].source) {
			document.getElementById("practiseOutput").innerHTML = "&check;&nbsp;&nbsp; - &nbsp;&nbsp;Great! You're right."
			document.getElementById("practiseOutput").classList.add("greenDisplay");
			data.practising.remaining.splice(data.practising.activeVocab, 1);
			data.practising.result.push(true);
			document.getElementById("practisingConfirm").style = "background-color: #777777;";
			document.getElementById("practisingConfirm").onclick = "";
			if (data.practising.remaining.length===0) {
				prepareResult();
			}
		} else {
			document.getElementById("practiseOutput").innerHTML = "&times;&nbsp;&nbsp; - &nbsp;&nbsp;Sorry! There's a mistake. The right word was <b>" + data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList[data.practising.remaining[data.practising.activeVocab]].source + "</b>."
			document.getElementById("practiseOutput").classList.add("redDisplay");
			data.practising.result.push(false);
			document.getElementById("practisingConfirm").style = "background-color: #777777;";
			document.getElementById("practisingConfirm").onclick = "";
		}
	}



}


function prepareResult () {

	document.getElementById("practisingResult").classList.remove("hidden");
	let percent
	let roundedPercent
	let tr = 0

	for (let i=0; i<data.practising.result.length; i++) {

		if (data.practising.result[i]) {
			tr++
		}

	}

	document.getElementById("practisingProgress").innerHTML = "Progress: " + (data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length-data.practising.remaining.length) + " / " + data.userData[data.activeUser].vocabUnits[data.activeUnit].vocabList.length;
	percent = tr/data.practising.result.length;
	percent *= 10000;
	percent = Math.round(percent);
	percent = percent/100;
	document.getElementById("percentDisplay").innerHTML = percent + "&percnt;";
	roundedPercent = Math.round(percent);
	data.practising.roundedPercent = roundedPercent

	document.getElementById("percentRangeDisplay").value = roundedPercent;

	if (roundedPercent<20) {
		document.getElementById("starDisplay").innerHTML = "&starf;&star;&star;&star;&star;"
		document.getElementById("6thStarDisplay").innerHTML = ""
		data.userData[data.activeUser].statistics.totalStars += 1
	} else if (roundedPercent<40) {
		document.getElementById("starDisplay").innerHTML = "&starf;&starf;&star;&star;&star;"
		document.getElementById("6thStarDisplay").innerHTML = ""
		data.userData[data.activeUser].statistics.totalStars += 2
	} else if (roundedPercent<60) {
		document.getElementById("starDisplay").innerHTML = "&starf;&starf;&starf;&star;&star;"
		document.getElementById("6thStarDisplay").innerHTML = ""
		data.userData[data.activeUser].statistics.totalStars += 3
	} else if (roundedPercent<80) {
		document.getElementById("starDisplay").innerHTML = "&starf;&starf;&starf;&starf;&star;"
		document.getElementById("6thStarDisplay").innerHTML = ""
		data.userData[data.activeUser].statistics.totalStars += 4
	} else if (roundedPercent<100) {
		document.getElementById("starDisplay").innerHTML = "&starf;&starf;&starf;&starf;&starf;"
		document.getElementById("6thStarDisplay").innerHTML = ""
		data.userData[data.activeUser].statistics.totalStars += 5
	} else if (roundedPercent>=100) {
		document.getElementById("starDisplay").innerHTML = "&starf;&starf;&starf;&starf;&starf;"
		document.getElementById("6thStarDisplay").innerHTML = "&starf;"
		data.userData[data.activeUser].statistics.totalStars += 6
		data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.perfectTries++
		data.userData[data.activeUser].statistics.perfectTries++
	}

	data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.tries++;
	data.userData[data.activeUser].statistics.tries++;

	let temp = data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent + percent
	data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent = temp
	if (data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.tries>1) {
		data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent = temp / 2;
	}

	let temp2 = data.userData[data.activeUser].statistics.percent + percent
	data.userData[data.activeUser].statistics.percent = temp2
	if (data.userData[data.activeUser].statistics.tries>1) {
		data.userData[data.activeUser].statistics.percent = temp2 / 2;
	}

	let temp3 = data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent*100
	temp3 = Math.round(temp3);
	data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent = temp3 / 100

	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

}


function stopPractising () {

	document.getElementById("practisingResult").classList.add("hidden");
	document.getElementById("practise").classList.add("hidden");
	document.getElementById("unitDisplay").classList.remove("hidden");
	reloadVocabTable();

}




function exportUnit () {

	document.getElementById("readUnitExport").classList.remove("hidden");
	document.getElementById("exportText").value = JSON.stringify(data.userData[data.activeUser].vocabUnits[data.activeUnit]);

}


function cancelExportUnit () {

	document.getElementById("readUnitExport").classList.add("hidden");

}


function importUnit () {

	let temp = JSON.parse(document.getElementById("importText").value)
	createUnit(temp.title, temp.sourceLanguage, temp.targetLanguage)

	for (let i=0; i<data.userData[data.activeUser].vocabUnits.length; i++) {

		if (data.userData[data.activeUser].vocabUnits[i].title===temp.title) {
			data.userData[data.activeUser].vocabUnits[i].vocabList = temp.vocabList;
			data.userData[data.activeUser].vocabUnits[i].statistics = temp.statistics;
		}

	}

}




function openAccountSettings () {

	if (data.activeUser!==undefined) {

		document.getElementById("login").classList.add("hidden");
		document.getElementById("main").classList.add("hidden");
		document.getElementById("unitDisplay").classList.add("hidden");
		document.getElementById("practise").classList.add("hidden");
		document.getElementById("accountSettings").classList.remove("hidden");

		let temp = data.userData[data.activeUser].statistics.percent * 100;
		temp = Math.round(temp);
		temp = temp/100

		document.getElementById("userStatisticTotalStarsDisplay").innerHTML = "&starf;&nbsp;Total Stars:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].statistics.totalStars;
		document.getElementById("userStatisticPercentDisplay").innerHTML = "&oslash;&nbsp;Success Ratio:&nbsp;&nbsp;&nbsp;" + temp + "&percnt;";
		document.getElementById("userStatisticTriesDisplay").innerHTML = "&star;&nbsp;Tries:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].statistics.tries;
		document.getElementById("userStatisticPerfectTriesDisplay").innerHTML = "&starf;&nbsp;Perfect Tries:&nbsp;&nbsp;&nbsp;" + data.userData[data.activeUser].statistics.perfectTries;
		document.getElementById("styleSelect").value = data.userData[data.activeUser].style;
		document.getElementById("accountSettingsRenameUser").value = data.activeUser;

	}

}


function accountSettingsRenameUser () {

	let temp = document.getElementById("accountSettingsRenameUser").value;

	if (data.userData[temp]==undefined) {

		data.userData[temp] = data.userData[data.activeUser];
		data.userData[data.activeUser] = undefined
		data.activeUser = temp;
		openAccountSettings();
		localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
		alert("Your account has been renamed.");

	} else {
		alert("The account " + temp + " already exists.");
		document.getElementById("accountSettingsRenameUser").value = data.activeUser;
	}

}


function exportUser () {

	document.getElementById("userExport").classList.remove("hidden");
	document.getElementById("exportUserText").value = JSON.stringify(data.userData[data.activeUser]);

}


function accountSettingsChangePassword () {

	let temp = letterKey.decrypt(data.userData[data.activeUser].password, localStorage.getItem("vocabularyCoach_mainKey"))

	if (document.getElementById("changePasswordRepeatOld").value===document.getElementById("changePasswordOld").value && document.getElementById("changePasswordOld").value===temp) {
		data.userData[data.activeUser].password = letterKey.encrypt(document.getElementById("changePasswordNew").value, localStorage.getItem("vocabularyCoach_mainKey"))
		alert("Your password have been changed.");
		document.getElementById("accountSettingsChangePassword").classList.add("hidden");
		localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
	} else {
		alert("Something went wrong.");
	}

}


function openChangePassword () {

	document.getElementById("changePasswordNew").value = "";
	document.getElementById("changePasswordOld").value = "";
	document.getElementById("changePasswordRepeatOld").value = "";
	document.getElementById("accountSettingsChangePassword").classList.remove("hidden");

}


function deleteUser () {

	if (document.getElementById("deleteUserPasswordInput").value===document.getElementById("deleteUserRepeatPasswordInput").value && document.getElementById("deleteUserPasswordInput").value===letterKey.decrypt(data.userData[data.activeUser].password, localStorage.getItem("vocabularyCoach_mainKey"))) {

		data.userData[data.activeUser] = undefined;
		localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
		alert("Your account " + data.activeUser + " has been deleted.")
		document.getElementById('deleteUser').classList.add('hidden');
		logOut();

	} else {
		alert("Something went wrong.")
	}

}




function logOut () {

	data.activeUser = undefined;
	document.getElementById("login").classList.remove("hidden");
	document.getElementById("main").classList.add("hidden");
	document.getElementById("unitDisplay").classList.add("hidden");
	document.getElementById("practise").classList.add("hidden");
	document.getElementById("accountSettings").classList.add("hidden");
	document.getElementById("loginUsername").value = "";
	document.getElementById("loginPassword").value = "";
	localStorage.setItem("vocabularyCoach_remainSignedIn", "empty");
	document.getElementById("remainSignedIn").checked = false;
	style.change("dark");

}




function importUser () {

	let temp = JSON.parse(document.getElementById("userImportText").value)
	let tempPW = letterKey.decrypt(temp.password, localStorage.getItem("vocabularyCoach_mainKey"))
	signUp(document.getElementById("userImportName").value, tempPW, tempPW);
	data.userData[document.getElementById("userImportName").value].userKey = temp.userKey;
	data.userData[document.getElementById("userImportName").value].statistics = temp.statistics;
	data.userData[document.getElementById("userImportName").value].vocabUnits = temp.vocabUnits;
	document.getElementById("userImport").classList.add("hidden");
	reloadOverviewTable()

}




function reloadConsole () {

	for (let i=0; i<9; i++) {

		if (data.log[i]!==undefined) {
			document.getElementById("logLine" + i).innerHTML = data.log[i]
		}

	}

}


function consoleSend (evt) {

	if (evt.key==="Enter") {

		let conTemp = document.getElementById("consoleCommandLine").value;
		let conOut = eval(conTemp);

		data.log.unshift(">> " + " " + conOut);
		document.getElementById("consoleCommandLine").value = "";
		reloadConsole();

	}

}




function showSidebar () {

	if (data.activeUser!==undefined) {
		document.getElementById("sidebarLogOut").classList.remove("hidden")
	} else {
		document.getElementById("sidebarLogOut").classList.add("hidden")
	}
	document.getElementById("sidebar").classList.remove("hidden");

}




function reloadPluginTable () {

	document.getElementById("pluginMenu").classList.remove("hidden");
	document.getElementById("login").classList.add("hidden");
	document.getElementById("main").classList.add("hidden");
	document.getElementById("unitDisplay").classList.add("hidden");
	document.getElementById("practise").classList.add("hidden");
	document.getElementById("accountSettings").classList.add("hidden");
	document.getElementById("pluginOverviewTable").innerHTML = "";
	temp2 = new OverviewTablePlugin(data.plugins.plugins, "&nbsp;&nbsp;&nbsp;&nbsp;Plugins", document.getElementById("pluginOverviewTable"), function(src) {alert(src)})
	let temp = open.element.create("div", temp2.table);
	temp.style = "text-align: right; font-weight: bold; font-size: 30px;";
	temp.innerHTML = "+&nbsp;&nbsp;";
	temp.addEventListener("click", function(){document.getElementById('addPlugin').classList.remove('hidden'); document.getElementById('addPluginSrc').value = "";});


}


function closePluginMenu () {

	if (data.activeUser!==undefined) {
		document.getElementById("login").classList.add("hidden");
		document.getElementById("main").classList.remove("hidden");
		document.getElementById("unitDisplay").classList.add("hidden");
		document.getElementById("practise").classList.add("hidden");
		document.getElementById("accountSettings").classList.add("hidden");
		document.getElementById("pluginMenu").classList.add("hidden");
	} else {
		logOut();
		document.getElementById("pluginMenu").classList.add("hidden");
	}

}




let style = {

	change: function(theme) {

		if (theme==="dark") {
			document.getElementById("style_dark").href = "css/style.css";
			document.getElementById("title_image").src = "storage/vocabularyCompanionRendering.png";
			document.getElementById("accountIconMain").style.backgroundImage = "url('storage/menuIcon.png')";
		} else if (theme==="light") {
			document.getElementById("style_dark").href = "";
			document.getElementById("title_image").src = "storage/readmeImage.png";
			document.getElementById("accountIconMain").style.backgroundImage = "url('storage/menuIcon_white.png')";
		}

	},
	settingsChange: function(theme) {

		if (data.activeUser!==undefined) {
			style.change(theme);
			data.userData[data.activeUser].style = theme;
			localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));
		}

	},

}




function styleSettingsChange (src) {
	style.settingsChange(src);
}


function reloadClock () {

	let clockTime = new Date;
	let hou = clockTime.getHours();
	let min = clockTime.getMinutes();
	let day = clockTime.getDay();
	if (hou<10) {
		hou = "0" + String(hou);
	}
	if (min<10) {
		min = "0" + String(min);
	}
	document.getElementById("clock").innerHTML = hou + ":" + min;

}


let terminal = {

	close: function() {

		document.getElementById("console").classList.add("hidden");
		return "console has been closed";

	},
	clear: function() {

		data.log = [];
		reloadConsole();
		return "";

	},

}