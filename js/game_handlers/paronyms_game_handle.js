/*
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/

//Initialize all words from JSON file
jsonFile.onreadystatechange = function() {
	if (jsonFile.readyState == 4 && jsonFile.status == 200) {
  		set_data(jsonFile.responseText);
  		start_game();
  }
}


var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var position = 0; //now position
var all_elem = 0;

var p_words = new Map();
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

	document.getElementById("task").innerHTML = "Напишите пароним к слову:"
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

	rwords.sort(compareRandom);
	all_elem = rwords.length;

	set_word();
}

//Sort of word list
function compareRandom(a, b) {
	return Math.random() - 0.5;
}

//Button "check"
function game_handle() {
	var flag = false;

	var right_answers;
	try {
		right_answers = p_words.get(rwords[0]).split(' ');
	} catch(err) {
		right_answers = p_words.get(rwords[0]);
	}

	right_answers.shift();

	//Check for the answer
	var r_flag = false;
	for(var i = 0; i < right_answers.length; i++) {
		if(right_answers[i] == document.getElementById("us_answer").value.trim().toLowerCase()) r_flag = true;
	}

	if(r_flag) {
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
		document.getElementById("us_answer").value = right_answers.join(', ');
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";

		var a_flag = false;
		for(var i = 0; i < rerrors.length; i++) {
			if(rerrors[i] == rwords[0] + " - " + right_answers.join(', ')) a_flag = true; 
		}

		if(!a_flag) rerrors.push(rwords[0] + " - " + right_answers.join(', '));

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

	document.getElementById("a_inform").href = "http://gramota.ru/slovari/dic/?word=" + rwords[0] + "&all=x";
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
