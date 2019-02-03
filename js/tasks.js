/* 
	* This file is connected to main page
	* Send POST request to file with a dictionary
	* !JSON! 
*/

//We get all words from a dictionary
//Dictionary is a JSON file
var jsonFile = new XMLHttpRequest();
var url = "https://annprot.github.io/tasks/";

//Initialize all words from JSON file
jsonFile.onreadystatechange = function() {
	if (jsonFile.readyState == 4 && jsonFile.status == 200) {
  		set_data(jsonFile.responseText);
  	}
  }

//View all dictionaries for user
function select_task(us_task) {
	window.url += us_task + ".json";

	jsonFile.open("GET",url,true);
	jsonFile.send();
	
	start_game();
}