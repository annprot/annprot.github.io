/*
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/

clearTimeout(waiting);//fix waiting for the file

var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //now position
var all_elem = 0;

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

		$("#exercs").fadeOut(500);
		$("#faq").fadeOut(500);
		$("#block_tasks").fadeIn(1000);
	}
}


//Start game
function start_game() {
	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	document.getElementById("task").style.fontWeight = "100";

	document.getElementById("task").innerHTML = "Раскройте скобки:"
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
	
	rwords.sort(compareRandom);
	set_word();
	start_game();
}

//Button "check"
function game_handle() {
	var flag = false;

	if(document.getElementById("us_answer").value.toLowerCase().trim() == p_words.get(rwords[0]).toLowerCase().trim()) {
		flag = true;
		rwords.shift();
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";

		position++;

		setTimeout(function () {
			set_word();
		}, 1000);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById("us_answer").value = p_words.get(rwords[0]).toLowerCase().trim();
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";

		var a_flag = false;
		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == rwords[0] + " - " + p_words.get(rwords[0])) a_flag = true; 
		}

		if(!a_flag) rerrors.push(rwords[0] + " - " + p_words.get(rwords[0]));

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
		
		document.getElementById("block_tasks").style.display = "none";
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
