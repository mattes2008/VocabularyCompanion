function fullReset () {

	localStorage.removeItem("vocabularyCoach_mainKey");
	localStorage.removeItem("vocabularyCoach_remainSignedIn");
	localStorage.removeItem("vocabularyCoach_userData");
	location.reload(true);

}