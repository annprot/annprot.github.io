/* 
	* This file is connected to main page
	* Send POST request to file with a dictionary
	* !JSON! 
	* Этот файл загружает все необходимые слова для выбранного задания
	* Осторожно! JSON формат!
*/

//Получаем список слов по ссылке
//Ссылка автоматически формируется(от выбранного пользователем задания)
//We get all words from a dictionary
//Dictionary is a JSON file
var jsonFile = new XMLHttpRequest();
var url = "https://annprot.github.io/tasks/";

//Функция получает список слов
//Функция подгружает необходимый обработчик самой игры для выбранного задания
//Get the list of words for the task
function select_task(user_task) {
	us_task = user_task;
	
	var script = document.createElement('script');
	switch(user_task) {
		case 4:
			//для 4 задания этот обработчик
			script.src = "js/game_handlers/accent_game_handle.js";
		break;

		case 5:
			//для 5 задания этот обработчик
			script.src = "js/game_handlers/paronyms_game_handle.js";
		break;

		default: 
			//для всех остальных заданий этот обработчик
      script.src = "js/game_handlers/game_handle.js";
		break;
	}

	//подключаем скрипт к странице
	//далее передаем управление скрипту, который был подключен
	document.getElementsByTagName('body')[0].appendChild(script);
	window.url += user_task + ".json";
	jsonFile.open("GET",url,true);
	jsonFile.send();
	window.url = "https://annprot.github.io/tasks/";
}