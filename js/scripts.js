let data = {

	activeUser: undefined,
	practising: {

		activeVoc: undefined,
		remaining: [],
		direction: "",
		result: [],

	}

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
	data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent = temp/data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.tries;

	let temp2 = data.userData[data.activeUser].statistics.percent + percent
	data.userData[data.activeUser].statistics.percent = temp2 / data.userData[data.activeUser].statistics.tries

	data.userData[data.activeUser].vocabUnits[data.activeUnit].statistics.percent


	localStorage.setItem("vocabularyCoach_userData", JSON.stringify(data.userData));

}


function stopPractising () {

	document.getElementById("practisingResult").classList.add("hidden");
	document.getElementById("practise").classList.add("hidden");
	document.getElementById("unitDisplay").classList.remove("hidden");
	reloadVocabTable();

}