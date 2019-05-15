/*
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/

var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //now position
var all_elem = 0; //count all emenents in the list
var h_enter = false; //fix longing enter
var right_answer = ""; //right answer
var us_error = false; //don't change the task for user

var first_tasks = new Map();
var second_tasks = new Map();
var third_tasks = new Map();

var texts = []; //all texts
var rerrors = []; //user's mistakes

//Динамическое распределение слов по блокам
//Handle the buttons of the task
//Dynamic handle the buttons of the task
document.addEventListener('click',function(e){
	if(e.target && e.target.id == 'btn_block') {
		var e_task = $(e.target).attr('class');
		set_data_cut($(e.target).attr('class'));
	}
});

//Input keys from the user's keyboard
addEventListener("keydown", function(event) {
	if(event.keyCode == 13) {
		if(h_enter) return;
    h_enter = true;

    if(gameWork) game_handle();
	}
}, false);

//Input keys from the user's keyboard
addEventListener('keyup', function () {
    h_enter = false;
}, false);

//Отображение 1 упражнения
function show_task_first() {
	document.getElementById("buttons").style.display = 'none';
	document.getElementById("container_task").style.display = 'block';
	document.getElementById("container_task").innerHTML = '<p class="title_task">Выберите верные утверждения:</p>';
	for(var i = 0; i < first_tasks.get(texts[0]).length - 1; i++) {
		document.getElementById("container_task").innerHTML += '<p class="user_answ">' + first_tasks.get(texts[0])[i] + '</p>';
	}
	right_answer = first_tasks.get(texts[0])[first_tasks.get(texts[0]).length - 1];
	document.getElementById("container_task").innerHTML += '<form onsubmit="return false;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><input type="text" id="us_answer"></form>';
	document.getElementById("container_task").innerHTML += '<button id="game_handle_btn" onclick="game_handle();">Проверить</button>';
	document.getElementById("container_task").innerHTML += '<button id="step_back_btn" onclick="step_back();">Назад</button>';
}

//Отображение 2 упражнения
function show_task_second() {
	document.getElementById("buttons").style.display = 'none';
	document.getElementById("container_task").style.display = 'block';
	document.getElementById("container_task").innerHTML = '<p class="title_task">' + second_tasks.get(texts[0])[0] +'</p>';
	right_answer = first_tasks.get(texts[0])[first_tasks.get(texts[0]).length - 1];
	document.getElementById("container_task").innerHTML += '<form onsubmit="return false;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><input type="text" id="us_answer"></form>';
	document.getElementById("container_task").innerHTML += '<button id="game_handle_btn" onclick="game_handle();">Проверить</button>';
	document.getElementById("container_task").innerHTML += '<button id="step_back_btn" onclick="step_back();">Назад</button>';
}

//Отображаем 3 основные кнопки
function step_back() {
	document.getElementById("container_task").style.display = 'none';
	document.getElementById("buttons").style.display = 'block';
}

//Отображаем сами блоки и динамически распределяем слова
//Создаем кнопки с блоками
//Каждый блок содержит до 25 слов
//We divide the task to the blocks
//Every block contains <= 25 words
function view_blocks_tasks() {
	clearTimeout(waiting);//fix waiting for the file
	if(data.tasks.length <= 5) start_game();
	else {
		var length = data.tasks.length;
		var pos = 1;
		var end_l = length - 5;
		var html_code = "";

		do {
			html_code += '<button id="btn_block" class="' + length + "_" + end_l + '">' + "Блок " + pos +'</button>';
			pos++;
			length -= 5;
			end_l = length - 5;
			if(end_l < 0) end_l = 0;
		} while(length > 0);

		$("#block_tasks").append(html_code);

		$("#exercs").fadeOut(500);
		$("#faq").fadeOut(500);
		$("#block_tasks").fadeIn(1000);
	}
}


//Start game
function start_game() {
	//Add own HTML structure for this task
	//ATTENTION! CLASS "start_tasks" IS ONLY FOR THIS TASK
	document.getElementById("game").innerHTML = '<p  class="start_tasks" class="par" id="task">Работа с текстом:</p>';
	document.getElementById("game").innerHTML += '<p  class="start_tasks" class="par" id="text_field"></p>';
	document.getElementById("game").innerHTML += '<div id="buttons"><button id="start_tasks" onclick="show_task_first()">1</button><button id="start_tasks" onclick="show_task_second()">2</button><button id="start_tasks" onclick="show_task_third()">3</button></div>';
	document.getElementById("game").innerHTML += '<div id="container_task"></div>';
	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	//document.getElementById("task").style.fontWeight = "100";

	$("#exercs").fadeOut(1000);
	$("#faq").fadeOut(1000);
	$("#game").fadeIn(1000);
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.tasks.length; i++) {
		texts.push(data.tasks[i].text);
		first_tasks.set(data.tasks[i].text, data.tasks[i].first_task);
		second_tasks.set(data.tasks[i].text, data.tasks[i].second_task);
		third_tasks.set(data.tasks[i].text, data.tasks[i].third_task);
	}

	all_elem = data.tasks.length;
}

//Sort of word list
function compareRandom(a, b) {
	return Math.random() - 0.5;
}

//Обработка выбранной кнопки(блок слов) пользователем
//Slice the list of the words
function set_data_cut(classname) {
	clearTimeout(waiting);//fix waiting for the file
	var cut_position = classname.split("_");
	texts = texts.slice(cut_position[1].trim(), cut_position[0].trim());
	all_elem = texts.length;
	
	document.getElementById("block_tasks").style.display = "none";
	texts.sort(compareRandom);
	start_game();
	set_word();
}

//Button "check"
function game_handle() {
	var flag = false;

	if(right_answer == document.getElementById("us_answer").value) {
		flag = true;
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";

		us_error = false;

		setTimeout(function () {
			document.getElementById("us_answer").placeholder = '';
			document.getElementById("us_answer").style.background = "none";
			document.getElementById("us_answer").style.border = "1px solid #fff";
			document.getElementById("us_answer").style.color = "#fff";
			document.getElementById("us_answer").value = "";
		}, 1000);
	}

	if(!flag) {
		//handle mistake
		document.getElementById("us_answer").value = "";
		document.getElementById("us_answer").placeholder = right_answer;
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";

		setTimeout(function () {
			document.getElementById("us_answer").placeholder = '';
			document.getElementById("us_answer").style.background = "none";
			document.getElementById("us_answer").style.border = "1px solid #fff";
			document.getElementById("us_answer").style.color = "#fff";
			document.getElementById("us_answer").value = "";
		}, 1500);
	} 
}

//Change the word
function set_word() {
	//Start game
	gameWork = true;
	//the end of the list
	if(position == all_elem) {
		document.getElementById("game").style.display = "none";
		document.getElementById("number").innerHTML = us_task;
		document.getElementById("end_text").innerHTML += us_task + " задания!";

		document.body.style.background = "#8E2DE2"; 
		document.body.style.background = "webkit-linear-gradient(to right, #4A00E0, #8E2DE2)";
		document.body.style.background = "linear-gradient(to right, #4A00E0, #8E2DE2)"; 

		gameWork = false;
		$("#end").fadeIn(1000);

		return;
	}

	document.getElementById("text_field").innerHTML = texts[0];
	//document.getElementById("counter").innerHTML = (position + 1) + "/" + all_elem;
}



//Errors popup
//FAQ block 
function er_show(state) {
	switch(state) {
		case "block":
			$("#er_window").fadeIn(1000);
			$("#er_wrap").fadeIn(1000);
		break;

		case "none":
			$("#er_window").fadeOut(1000);
			$("#er_wrap").fadeOut(1000);
		break;
	}
}
