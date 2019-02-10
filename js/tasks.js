/* 
	* This file is connected to main page
	* Send POST request to file with a dictionary
	* !JSON! 
*/

//We get all words from a dictionary
//Dictionary is a JSON file
var jsonFile = new XMLHttpRequest();
var url = "https://annprot.github.io/tasks/";

//View all dictionaries for user
function select_task(user_task) {
	us_task = user_task;
	
	var script = document.createElement('script');
	switch(user_task) {
		case 4:
			script.src = "js/game_handlers/accent_game_handle.js";
		break;

		default: 
      script.src = "js/game_handlers/game_handle.js";
		break;
	}
	document.getElementsByTagName('body')[0].appendChild(script);

	window.url += user_task + ".json";
	jsonFile.open("GET",url,true);
	jsonFile.send();
}