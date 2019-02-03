/*
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


//Input keys from the user's keyboard
addEventListener("keydown", function(event) {
	switch(event.keyCode) {

		//enter listener
		case 13:
		if(gameWork) game_handle();
		break;
	}
});


//Start game
function start_game() {
	document.getElementById("header").style.display = "none";
	document.getElementById("main").style.display = "none";
	document.getElementById("task").style.fontWeight = "100";
	$("#exercs").fadeOut(1000);
	$("#faq").fadeOut(1000);
	$("#game").fadeIn(1000);
}

//Sort of word list
function compareRandom(a, b) {
	return Math.random() - 0.5;
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		window.rwords.push(data.words[i]);
	}

	rwords.sort(compareRandom);
	//alert(rwords);
	all_elem = rwords.length;

	set_word();
}

//Button "check"
function game_handle() {
	var flag = false;

	if(document.getElementById("us_answer").value.toLowerCase().trim() == right_answer.toLowerCase().trim() || 
		document.getElementById("us_answer").value.toLowerCase().trim() == right_answer_s.toLowerCase().trim() ) {
		flag = true;
		rwords.shift();
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";

		position++;

		setTimeout(function () {
			set_word();
		}, 1500);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById("us_answer").value = rwords[0];
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";


		setTimeout(function () {
			set_word();
		}, 2000);
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

	document.getElementById("us_answer").focus();
	document.getElementById("us_answer").click();

	//replace the symbol
	var word_now = rwords[0].split('');
	var symb = 0;
	var flag = false;

	for(var j = 0; j < word_now.length; j++) {
		if(word_now[j] == "(") {
			symb = j; 
			flag = true;
		}

		if(word_now[j] == word_now[j].toUpperCase() && flag == false 
			&& word_now[j] != " ") {
			if(word_now[j] != "(" && word_now[j] != ")") right_answer_s = word_now[j];
			word_now[j] = "_";
		}

	}

	right_answer = rwords[0].toLowerCase();
	if(symb != 0) right_answer = rwords[0].substring(0, symb - 1);
	//console.log(symb);
	//console.log(word_now);
	//console.log(right_answer);
	//console.log(right_answer_s);

	document.getElementById("word").innerHTML = word_now.join('');
	document.getElementById("us_answer").style.background = "none";
	document.getElementById("us_answer").style.border = "1px solid #fff";
	document.getElementById("us_answer").style.color = "#fff";
	document.getElementById("us_answer").value = "";
	document.getElementById("counter").innerHTML = (position + 1) + "/" + all_elem;
}

