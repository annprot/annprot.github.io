/*
	* Game mode == 1
	* Create buttons for user's answer
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/

var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //now position
var right_answer = "";
var right_answer_s = "";
var all_elem = 0;

var rwords = []; //all words
var rerrors = []; //user's mistakes

//Динамическое распределение слов по блокам
//Handle the buttons of the task
//Dynamic handle the buttons of the task
document.addEventListener('click',function(e){
	if(e.target && e.target.id == 'btn_block') {
		var e_task = $(e.target).attr('class');
		set_data_cut($(e.target).attr('class'));
	}

	if(e.target && e.target.id == 'ac_btn_game') {
		//debug only
		//alert($(e.target).attr('class'));
		//alert(right_answer_s);
		game_handle(right_answer_s, $(e.target).attr('class'));
	}
});

//Обработка клавиши "enter" для отправки ответа
//Input keys from the user's keyboard
addEventListener("keydown", function(event) {
	switch(event.keyCode) {

		//enter listener
		case 13:
			if(gameWork) game_handle();
		break;
	}
});

//Отображаем сами блоки и динамически распределяем слова
//Создаем кнопки с блоками
//Каждый блок содержит до 25 слов
//We divide the task to the blocks
//Every block contains <= 25 words
function view_blocks_tasks() {
	clearTimeout(waiting); //fix waiting for the file
	if(data.words.length <= 25) start_game();
	else {
		var length = data.words.length;
		var pos = 1;
		var end_l = length - 25;
		var html_code = "";

		do {
			html_code += '<button id="btn_block" class="' + length + "_" + end_l + '">' + "Блок " + pos +'</button>';
			pos++;
			length -= 25;
			end_l = length - 25;
			if(end_l < 0) end_l = 0;
		} while(length > 0);

		$("#block_tasks").append(html_code);

		$("#mode_game").fadeOut(500);
		$("#faq").fadeOut(500);
		$("#block_tasks").fadeIn(1000);
	}
}

//Start game
function start_game() {
	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	document.getElementById("main").style.display = "none";

	document.getElementById("us_answer").style.display = "none";
	document.getElementById("game_handle_btn").style.display = "none";
	document.getElementById("btn_answers").style.paddingBottom  = "50px";

	document.getElementById("task").innerHTML = "Выберите букву, на которую падает ударение в слове:"
	$("#game").fadeIn(1000);
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		window.rwords.push(data.words[i]);
	}

	//alert(rwords);
	all_elem = rwords.length;
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

//Button "check"
function game_handle(right_answ, user_answ) {
	var flag = false;

	if(right_answ == user_answ) {
		flag = true;
		rwords.shift();
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";


		position++;

		setTimeout(function () {
			document.getElementById("btn_answers").innerHTML = "";
			set_word();
		}, 1000);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";

		var flag = false;
		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == rwords[0]) flag = true; 
		}

		if(!flag) rerrors.push(rwords[0]);
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
		
		document.getElementById("us_pop_er").style.display = "block";
		if(rerrors.length > 0) {
			document.getElementById("us_errors").innerHTML += rerrors.join(', ');
		}
		else document.getElementById("btn_errors").style.display = "none";

		gameWork = false;
		$("#end").fadeIn(1000);

		return;
	}

	document.getElementById("us_answer").focus();
	document.getElementById("us_answer").click();

	//replace the symbol
	var word_now = rwords[0].split('');
	var symb = 0;
	var flag = false;
	var repl = false;
	var html_code = "";
	
	right_answer_s = "";
	for(var j = 0; j < word_now.length; j++) {
		if(word_now[j] == "(") {
			symb = j; 
			flag = true;
		}

		if(word_now[j] == word_now[j].toUpperCase() && flag == false 
			&& word_now[j] != " ") {
			if(word_now[j] != "(" && word_now[j] != ")") right_answer_s = j + 1;
		}

		if((word_now[j].toLowerCase() == "а" || word_now[j].toLowerCase() == "я" ||
			word_now[j].toLowerCase() == "е" || word_now[j].toLowerCase() == "ё" ||
			word_now[j].toLowerCase() == "и" || word_now[j].toLowerCase() == "ю" ||
			word_now[j].toLowerCase() == "у" || word_now[j].toLowerCase() == "э" ||
			word_now[j].toLowerCase() == "о" || word_now[j].toLowerCase() == "ы") && !flag) {
			html_code += '<button id="ac_btn_game" class="' + (j + 1) + '">' + word_now[j].toLowerCase() + '</button>';
		}
	}

	$("#btn_answers").append(html_code);
	//console.log(symb);
	//console.log(word_now);
	//console.log(right_answer);
	//console.log(right_answer_s);

	document.getElementById("a_inform").href = "http://gramota.ru/slovari/dic/?word=" + rwords[0].toLowerCase(); + "&all=x";
	document.getElementById("word").innerHTML = word_now.join('').toLowerCase();
	document.getElementById("us_answer").style.background = "none";
	document.getElementById("us_answer").style.border = "1px solid #fff";
	document.getElementById("us_answer").style.color = "#fff";
	document.getElementById("us_answer").value = "";
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
