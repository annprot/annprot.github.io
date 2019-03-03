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

var p_words = new Map();
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
	//Add own HTML structure for this task
	//ATTENTION! CLASS "par" IS ONLY FOR THIS TASK
	document.getElementById("game").innerHTML = '<p class="par" id="task">Соотнестите определения со словами:</p>';
	document.getElementById("game").innerHTML += '<div class="par" id="main_table"><table id="par_task"><tr class="task_tr><th>Слова</th><th>Определения</th></tr></tr></table></div>';
	document.getElementById("game").innerHTML += '<form onsubmit="return false;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><input class="par" type="text" id="us_answer"></form>';
	document.getElementById("game").innerHTML += '<button class="par" id="game_handle_btn" onclick="game_handle();">Проверить</button>';
	document.getElementById("game").innerHTML += '<p class="par" id="counter"></p>';
	document.getElementById("game").innerHTML += '<a class="par" href="https://paronymonline.ru/ege.html" id="a_inform" target="_blank">Словарь паронимов</a>';

	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	document.getElementById("task").style.fontWeight = "100";

	$("#exercs").fadeOut(1000);
	$("#faq").fadeOut(1000);
	$("#game").fadeIn(1000);
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		var pair_words = data.words[i].split("–");
		var arr_of_words = [];

		for(var j = 0; j < pair_words.length; j++) {
			var div_words = pair_words[j].split("(");
			add_arr = div_words[0].trim().toLowerCase();
			arr_of_words.push(div_words[0].trim().toLowerCase());
			div_words[1] = div_words[1].trim().toLowerCase();
			div_words[1] = div_words[1].slice(0, -1);

			p_words.set(add_arr, div_words[1]);
		}

		//rwords - double array
		window.rwords.push(arr_of_words);
	}

	all_elem = rwords.length;
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
	rwords = rwords.slice(cut_position[1].trim(), cut_position[0].trim());
	all_elem = rwords.length;
	
	document.getElementById("block_tasks").style.display = "none";
	rwords.sort(compareRandom);
	start_game();
	set_word();
}

//Button "check"
function game_handle() {
	var flag = false;

	if(right_answer == document.getElementById("us_answer").value) {
		flag = true;
		rwords.shift();
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";

		us_error = false;

		position++;

		setTimeout(function () {
			set_word();
		}, 1000);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById("us_answer").value = "";
		document.getElementById("us_answer").placeholder = right_answer;
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";

		us_error = true;

		var a_flag = false;

		var err_str = "";
		for(var i = 0; i < rwords[0].length; i++) {
			err_str += rwords[0][i] + " - " + p_words.get(rwords[0][i]);
		}

		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == err_str) a_flag = true; 
		}

		if(!a_flag) rerrors.push(err_str);

		setTimeout(function () {
			set_word();
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
		
		document.getElementById("us_pop_er").style.display = "block";
		if(rerrors.length > 0) {
			document.getElementById("us_errors").innerHTML += rerrors.join('<br>');
		}
		else document.getElementById("btn_errors").style.display = "none";

		gameWork = false;
		$("#end").fadeIn(1000);

		return;
	}


	//it's true when user don't make a mistake
	if(!us_error) {
		//random sort answers
		//get list of right answers from the main array
		var ranswers = [];
		for(var i = 0; i < rwords[0].length; i++) {
			ranswers.push(p_words.get(rwords[0][i]));
		}
		ranswers.sort(compareRandom);

		//split data from array
		//create the table
		var html_table = '<table id="par_task"><tr class="task_tr"><th>Слова</th><th>Определения</th></tr>';
		for(var i = 0; i < rwords[0].length; i++) {
			html_table += '<tr><th>' + rwords[0][i] + '</th><th>' + (i+1) + '. ' + ranswers[i]  + '</th></tr>';
		}

		html_table += '</table>';
		document.getElementById("main_table").innerHTML = html_table;

		right_answer = "";
		//form right answer
		for(var i = 0; i < rwords[0].length; i++) {
			for(var j = 0; j < ranswers.length; j++) {
				if(p_words.get(rwords[0][i]) == ranswers[j]) right_answer += j + 1;
			}
		}
	}

	document.getElementById("us_answer").placeholder = '';
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
