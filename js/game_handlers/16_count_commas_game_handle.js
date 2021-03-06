/*
	* Обработчик стандартных заданий
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
*/


//==================
//Все для самой игры
//==================
var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //Now position in the task
var right_answer = ""; //Contains the right answer for user's task
var right_answer_s = ""; //Contains the symbol of right answer for user's task
var all_elem = 0; //Number of words in the task
var h_enter = false; //fix longing enter
var answers = new Map();
var h_timer = true; //fix fast click

var rwords = []; //All words
var rerrors = []; //User's mistakes

//Динамическое распределение слов по блокам
//Handle the buttons of the task
//Dynamic handle the buttons of the task
document.addEventListener('click',function(e){
	if(e.target && e.target.id == 'btn_block') {
		var e_task = $(e.target).attr('class');
		set_data_cut($(e.target).attr('class'));
	}

	if(e.target && e.target.id == 'cc_btn_game' && h_timer == true) {
		//debug only
		//alert($(e.target).attr('class'));
		game_handle($(e.target).attr('class'));
		h_timer = false;

		setTimeout(function () {
			h_timer = true;
		}, 1000);
	}
});

//Обработка клавиши "enter" для отправки ответа
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

//Отображаем сами блоки и динамически распределяем слова
//Создаем кнопки с блоками
//Каждый блок содержит до 25 слов
//We divide the task to the blocks
//Every block contains <= 10 words
function view_blocks_tasks() {
	clearTimeout(waiting);//fix waiting for the file
	if(data.words.length <= 10) start_game();
	else {
		var length = data.words.length;
		var pos = 1;
		var end_l = length - 10;
		var html_code = "";

		do {
			html_code += '<button id="btn_block" class="' + length + "_" + end_l + '">' + "Блок " + pos +'</button>';
			pos++;
			length -= 10;
			end_l = length - 10;
			if(end_l < 0) end_l = 0;
		} while(length > 0);

		$("#block_tasks").append(html_code);

		$("#exercs").fadeOut(500);
		$("#faq").fadeOut(500);
		$("#block_tasks").fadeIn(1000);
	}
}

//Старт игры
//Start game
function start_game() {
	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	document.getElementById("task").style.fontWeight = "100";
	document.getElementById("a_inform").style.display = "none";
	document.getElementById("word").style.maxWidth = "100%";
	document.getElementById("word").style.fontSize = "36px";
	document.getElementById("task").innerHTML = "Сколько запятых нужно поставить в предложении?";
	
	document.getElementById("btn_answers").style.paddingTop  = "30px";
	document.getElementById("counter").style.paddingBottom  = "50px";

	document.getElementById("us_answer").style.display = "none";
	document.getElementById("counter").style.paddingTop = "50px";
	document.getElementById("game_handle_btn").style.display = "none";
	document.getElementById("word").style.fontSize = "30px";

	$("#exercs").fadeOut(1000);
	$("#faq").fadeOut(1000);
	$("#game").fadeIn(1000);
}

//Рандомная сортировка слов в списке
//Sort of word list
function compareRandom(a, b) {
	return Math.random() - 0.5;
}

//Обработка выбранной кнопки(блок слов) пользователем
//Slice the list of the words
function set_data_cut(classname) {
	var cut_position = classname.split("_");
	rwords = rwords.slice(cut_position[1].trim(), cut_position[0].trim());
	all_elem = rwords.length;
	
	document.getElementById("block_tasks").style.display = "none";
	rwords.sort(compareRandom);
	set_word();
	start_game();
}

//Загружаем целый список слов из JSON файла
//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		var div_words = data.words[i].split("—>");
		window.answers.set(div_words[0].trim(), Number(div_words[1].trim()));
		rwords.push(div_words[0].trim());
	}

	all_elem = rwords.length;
}

//Кнопка "Проверить"
//Button "check"
function game_handle(user_answ) {
	var flag = false;

	if(user_answ == answers.get(rwords[0])) {
		flag = true; //ответ верный or right answer
		rwords.shift();
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";

		position++;

		setTimeout(function () {
			set_word();
		}, 1000);
	}

	if(!flag) {
		//ответ неверный
		//handle mistake
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";

		var flag = false;
		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == rwords[0] + " -> " + answers.get(rwords[0]) + " запятая(ых)") flag = true; 
		}

		if(!flag) rerrors.push(rwords[0] + " -> " + answers.get(rwords[0]) + " запятая(ых)");


		setTimeout(function () {
			set_word();
		}, 1500);
	} 
}

//Random value for the generating the task
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//Следующее слово, функция автоматически вызывается кнопкой "Проверить"
//Change the word
function set_word() {
	//Start game
	gameWork = true;
	//the end of the list
	if(position == all_elem) {
		//Игра завершена, выводим необходимый блок
		document.getElementById("game").style.display = "none";
		document.getElementById("number").innerHTML = us_task;
		document.getElementById("end_text").innerHTML += us_task + " задания!";
		document.getElementById("type_error").innerHTML = "Предложение(я), в котором(ых) ты допустил ошибку";

		document.body.style.background = "#8E2DE2"; 
		document.body.style.background = "webkit-linear-gradient(to right, #4A00E0, #8E2DE2)";
		document.body.style.background = "linear-gradient(to right, #4A00E0, #8E2DE2)"; 

		document.getElementById("us_pop_er").style.display = "block";
		if(rerrors.length > 0) {
			document.getElementById("us_errors").innerHTML += rerrors.join('<br>');
		}
		else document.getElementById("btn_errors").style.display = "none";

		gameWork = false;
		$("#end").fadeIn(1000);

		return;
	}

	document.getElementById("us_answer").focus();
	document.getElementById("us_answer").click();

	//replace the symbol
	var html_code = "";

	for(var j = 0; j < answers.get(rwords[0]) + getRandomArbitrary(1, 3); j++) {
		html_code += '<button id="cc_btn_game" class="' + j + '">' + j + '</button>';
	}

	document.getElementById("btn_answers").innerHTML = html_code;
	//debug only
	//console.log(symb);
	//console.log(word_now);
	//console.log(right_answer);
	//console.log(right_answer_s);

	document.getElementById("word").innerHTML = rwords[0];
	document.getElementById("counter").innerHTML = (position + 1) + "/" + all_elem;
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
