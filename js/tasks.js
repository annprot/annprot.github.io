/* 
	* This file is connected to main page
	* Send POST request to file with a dictionary
	* !JSON! 
	* Этот файл загружает все необходимые слова для выбранного задания
	* Осторожно, JSON формат!
*/

//Получаем список слов по ссылке
//Ссылка автоматически формируется(от выбранного пользователем задания)
//We get all words from a dictionary
//Dictionary is a JSON file
var jsonFile = new XMLHttpRequest();
var url = "https://annprot.github.io/tasks/";
var request_state = false;


//для 4 задания функция, реализующая вызов основного блока
function request_data_to_4() {
	get_data("4");
}

//Выбор режима игры(для некоторых заданий)
function select_task(user_task) {
	var html_code = "";
	switch(user_task) {
		case "4":
			html_code += '<button onclick="game_mode=0;request_data_to_4();">Режим запоминания</button>';
			html_code += '<button onclick="game_mode=1;request_data_to_4();;">Упрощённый режим</button>';
			$("#mode_game").append(html_code);

			$("#exercs").fadeOut(1000);
			$("#mode_game").fadeIn(1000);
		break;

		default: 
			get_data(user_task);
		break;
	}
}

//Функция получает список слов
//Функция подгружает необходимый обработчик самой игры для выбранного задания
//Get the list of words for the task
function get_data(user_task) {
	us_task = user_task;
	
	var script = document.createElement('script');
	switch(user_task) {
		case "4":
			//для 4 задания этот обработчик
			if(game_mode == 0) script.src = "js/game_handlers/accent_game_handle_0.js";
			else script.src = "js/game_handlers/accent_game_handle_1.js";
		break;

		case "5":
			//для 5 задания этот обработчик
			script.src = "js/game_handlers/paronyms_game_handle.js";
		break;

		case "7":
			//для 7 задания этот обработчик
			script.src = "js/game_handlers/plural_game_handle.js";
		break;

		default: 
			//для всех остальных заданий этот обработчик
     			 script.src = "js/game_handlers/game_handle.js";
		break;
	}

	//подключаем скрипт к странице
	//далее передаем управление скрипту, который был подключен
	window.url += user_task + ".json";
	jsonFile.open("GET",url,true);
	jsonFile.send();
	if(!request_state) document.getElementsByTagName('body')[0].appendChild(script);
	request_state = true;
	window.url = "https://annprot.github.io/tasks/";
}
