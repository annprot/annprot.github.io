/*
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/

console.log("File is connected to the page!");

var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //now position
var all_elem = 0; //count all emenents in the list
var h_enter = false; //fix longing enter
var right_answer_p = ""; //right answer

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

	if(e.target && e.target.id == 'ac_btn_phrasal') {
		//debug only
		//alert($(e.target).attr('class'));
		//alert(right_answer_s);
		game_handle($(e.target).attr('class'));
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
	clearTimeout(waiting);//fix waiting for the file
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
	document.getElementById("task").style.fontWeight = "100";

	document.getElementById("us_answer").style.display = "none";
	document.getElementById("game_handle_btn").style.display = "none";
	document.getElementById("btn_answers").style.paddingBottom  = "50px";

	document.getElementById("task").innerHTML = "Выберите правильный ответ:";

	var html_code = '<button id="ac_btn_phrasal" class="1">' + "Сл..." + '</button>';
	html_code += '<button id="ac_btn_phrasal" class="2">' + "Раз..." + '</button>';
	html_code += '<button id="ac_btn_phrasal" class="3">' + "Деф..." + '</button>';

	$("#btn_answers").append(html_code);

	$("#exercs").fadeOut(1000);
	$("#faq").fadeOut(1000);
	$("#game").fadeIn(1000);
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		var pair_words = data.words[i].split("–");
		p_words.set(pair_words[0].trim().toLowerCase(), pair_words[1]);

		window.rwords.push(pair_words[0].trim().toLowerCase());
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
	var cut_position = classname.split("_");
	rwords = rwords.slice(cut_position[1].trim(), cut_position[0].trim());
	all_elem = rwords.length;
	
	document.getElementById("block_tasks").style.display = "none";
	rwords.sort(compareRandom);
	set_word();
	start_game();
}

//Button "check"
function game_handle(user_answ) {
	var flag = false;

	if(user_answ == right_answer_p) {
		flag = true;
		rwords.shift();
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #57CE79";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";

		position++;

		setTimeout(function () {
			set_word();
		}, 1000);

		setTimeout(function() {
			//clear styles
			for(var i = 1; i < 4; i++) {
				document.getElementById('btn_answers').getElementsByClassName(i)[0].style.background = "#fff";
				document.getElementById('btn_answers').getElementsByClassName(i)[0].style.border = "1px solid #fff";
				document.getElementById('btn_answers').getElementsByClassName(i)[0].style.color = "#FDC830";
			}
		}, 800);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.background = "#D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.border = "1px solid #D63C3C";
		document.getElementById('btn_answers').getElementsByClassName(user_answ)[0].style.color = "#fff";

		var a_flag = false;
		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == rwords[0] + " - " + p_words.get(rwords[0]).toLowerCase()) a_flag = true; 
		}

		if(!a_flag) rerrors.push(rwords[0] + " - " + p_words.get(rwords[0]).toLowerCase());

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

	document.getElementById("us_answer").focus();
	document.getElementById("us_answer").click();

	//generate buttons
	var word_now = p_words.get(rwords[0]).trim().split('');
	var symb = 0;
	var s_flag = false;
	var repl = false;
	var html_code = "";

	right_answer_p = 1; //coherent

	for(var j = 0; j < word_now.length; j++) {
		if(word_now[j] == "(") {
			symb = j; 
			s_flag = true;
		}

		//space
		if(!s_flag && word_now[j] == " ") {
			right_answer_p = 2;
		}

		//hyphen
		if(!s_flag && word_now[j] == "-") {
			right_answer_p = 3;
		}
	}

	document.getElementById("a_inform").href = "http://gramota.ru/slovari/dic/?word=" + p_words.get(rwords[0]) + "&all=x";
	document.getElementById("word").innerHTML = rwords[0];
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
