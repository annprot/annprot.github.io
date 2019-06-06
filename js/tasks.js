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
var waiting; //waiting for loading the game handler
var script = document.createElement('script');

//Initialize all words from JSON file
jsonFile.onreadystatechange = function() {
	if (jsonFile.readyState == 4 && jsonFile.status == 200) {
  		try {
  			set_data(jsonFile.responseText);
	  		view_blocks_tasks();
  		} catch(e) {
  				waiting = setInterval(function(){
  					console.log("waiting for loading the file..."); 
	  				set_data(jsonFile.responseText);
			  		view_blocks_tasks();
  			}, 500);
  		}
  }
}

//для 4 задания функция, реализующая вызов основного блока
function request_data_to_4() {
	get_data("4");
}

//для 5 задания функция, реализующая вызов основного блока
function request_data_to_5() {
	get_data("5");
}

//для 7 задания функция, реализующая вызов основного блока
function request_data_to_7() {
	get_data("7");
}

//для 14 задания функция, реализующая вызов основного блока
function request_data_to_14() {
	get_data("14");
}

//Выбор режима игры(для некоторых заданий)
function select_task(user_task) {
	var html_code = "";

	switch(user_task) {
		case "4":
			html_code += '<button onclick="game_mode=0;request_data_to_4();">Режим запоминания</button>';
			html_code += '<button onclick="game_mode=1;request_data_to_4();;">Упрощённый режим</button>';
			html_code += '<button id="btn_back" onclick="come_back_sg();">Назад</button>';
			$("#mode_game_btns").append(html_code);

			$("#exercs").fadeOut(1000);
			$("#mode_game").fadeIn(1000);
		break;

		case "5":
			html_code += '<button onclick="game_mode=0;request_data_to_5();">Подобрать пароним</button>';
			html_code += '<button onclick="game_mode=1;request_data_to_5();;">Сопоставить паронимы</button>';
			html_code += '<button id="btn_back" onclick="come_back_sg();">Назад</button>';
			$("#mode_game_btns").append(html_code);

			$("#exercs").fadeOut(1000);
			$("#mode_game").fadeIn(1000);
		break;	

		case "7":
			//html_code += '<button onclick="game_mode=1;request_data_to_7();">Исправь ошибку</button>';
			html_code += '<button onclick="game_mode=0;request_data_to_7();;">Образование мн. формы слова</button>';
			html_code += '<button id="btn_back" onclick="come_back_sg();">Назад</button>';
			$("#mode_game_btns").append(html_code);

			$("#exercs").fadeOut(1000);
			$("#mode_game").fadeIn(1000);
		break;

		case "14":
			html_code += '<button onclick="game_mode=0;request_data_to_14();">Режим запоминания</button>';
			html_code += '<button onclick="game_mode=1;request_data_to_14();;">Упрощённый режим</button>';
			html_code += '<button id="btn_back" onclick="come_back_sg();">Назад</button>';
			$("#mode_game_btns").append(html_code);

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
	script.src = "";
	
	switch(user_task) {
		case "1-3":
			//задание 1-3
			user_task = "1-3";
			script.src = "js/game_handlers/1_3_tasks_game_handler.js";
		break;

		case "4":
			//для 4 задания этот обработчик
			if(game_mode == 0) script.src = "js/game_handlers/accent_game_handle_0.js";
			else script.src = "js/game_handlers/accent_game_handle_1.js";
		break;

		case "5":
			//для 5 задания этот обработчик
			if(game_mode == 0) {
				user_task = "5_0";
				script.src = "js/game_handlers/paronyms_game_handle_0.js";
			}
			else {
				user_task = "5_1";
				script.src = "js/game_handlers/paronyms_game_handle_1.js";
			}
		break;

		case "6":
			script.src = "js/game_handlers/6_task.js";
		break;

		case "7":
			//для 7 задания этот обработчик
			if(game_mode == 0) script.src = "js/game_handlers/plural_game_handle_0.js";
			else {
				user_task = "7_1";
				script.src = "js/game_handlers/plural_game_handle_1.js";
			}
		break;

		case "14":
			//для 14 задания этот обработчик
			if(game_mode == 0) script.src = "js/game_handlers/phrasal_handle_0.js";
			else script.src = "js/game_handlers/phrasal_handle_1.js";
		break;

		case "16":
			script.src = "js/game_handlers/16_count_commas_game_handle.js";
		break;

		case "17":
			script.src = "js/game_handlers/commas_game_handle.js";
		break;

		case "18":
			script.src = "js/game_handlers/commas_game_handle.js";
		break;

		case "19":
			script.src = "js/game_handlers/commas_game_handle.js";
		break;

		case "20":
			script.src = "js/game_handlers/commas_game_handle.js";
		break;

		case "21":
			script.src = "js/game_handlers/21_commas_game_handle.js";
		break;

		default: 
			//для всех остальных заданий этот обработчик
     		script.src = "js/game_handlers/game_handle.js";
		break;
	}

	//подключаем скрипт к странице
	//далее передаем управление скрипту, который был подключен
	if(!request_state) document.getElementsByTagName('body')[0].appendChild(script);
	request_state = true;
	window.url += user_task + ".json";
	jsonFile.open("GET",url,true);
	jsonFile.send();
	window.url = "https://annprot.github.io/tasks/";
	console.log("The main function is ready!");
}
