/*
	* This file is connected to the main page.
	* Here are a lot of different functions and methods for the game handler
	*/


var gameWork = false; //If the user is in the game, he can press 'enter' and 'shift' in the game
var allelem = 0; //All words + words where an user makes mistakes 
var beforeend = false; //Preparing for the end of the game

var rstart = [];
var rerrors = [];


//Input keys from the user's keyboard
addEventListener("keydown", function(event) {
	switch(event.keyCode) {

		//enter listener
		case 13:
		if(gameWork) select_handler();
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

	set_data();
}

//Sort of word list
function compareRandom(a, b) {
	return Math.random() - 0.5;
}

//Initialize all data from JSON file
function set_data(datajson) {
	data = JSON.parse(datajson);

	for(var i = 0; i < data.words.length; i++) {
		window.rstart.push(data.words[i]);
	}

	rstart.sort(compareRandom);
	alert(rstart);
	allelem = rstart.length;
}

//Button "check"
function game_handle_re() {
	var right_answer = ecoll.get(ewords[0]);
	var flag = false;

	if(document.getElementById("us_answer").value.toLowerCase().trim() == right_answer.toLowerCase()) {
		flag = true;
		ewords.push(ewords[0]);
		ewords.shift();
		ewords.sort(compareRandom);
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";


		setTimeout(function () {
			set_word_re();
		}, 1500);
	}

	if(!flag) {
		//alert("false");
		//handle mistake
		document.getElementById("us_answer").value = ecoll.get(ewords[0]);
		document.getElementById("us_answer").style.background = "#D63C3C";
		document.getElementById("us_answer").style.border = "1px solid #D63C3C";
		document.getElementById("us_answer").style.color = "#fff";

		ewords.push(ewords[0]);
		allelem += 1;

		setTimeout(function () {
			set_word_re();
		}, 2000);
	} 
}

//Change the word
function set_word_re() {
	//Restart game
	gameWork = true;
	//the end of the list
	if(beforeend) {
		document.getElementById("game").style.display = "none";
		gameWork = false;
		document.getElementById("img_dictionary").src = "https://mcflydesigner.github.io/" + imgend;
		document.body.style.background = "#8E2DE2"; 
		document.body.style.background = "webkit-linear-gradient(to right, #4A00E0, #8E2DE2)";
		document.body.style.background = "linear-gradient(to right, #4A00E0, #8E2DE2)"; 
		document.getElementById("end_text").innerHTML = "You have successfully completed the task \"" + currDict + "\"!";
		$("#end").fadeIn(1000);
		$("#img_dictionary").fadeIn(2000);
	}

	if(position == allelem) {
		beforeend = true;
	}

	document.getElementById("us_answer").focus();
	document.getElementById("us_answer").click();

	document.getElementById("lingvo").href = "https://www.lingvolive.com/ru-ru/translate/en-ru/" + ecoll.get(ewords[0]);
	document.getElementById("forvo").href = "https://ru.forvo.com/word/" + ecoll.get(ewords[0]) + "/#en/";
	document.getElementById("reverso").href = "https://context.reverso.net/перевод/английский-русский/" + ecoll.get(ewords[0]);

	document.getElementById("word").innerHTML = ewords[0];
	document.getElementById("pfs").innerHTML = "(" + epfs.get(ewords[0]) + ")";
	document.getElementById("us_answer").style.background = "none";
	document.getElementById("us_answer").style.border = "1px solid black";
	document.getElementById("us_answer").style.color = "black";
	document.getElementById("us_answer").value = "";
	document.getElementById("counter").innerHTML = position + "/" + allelem;
}

//Button "know"
function know_word() {
	if(game == 1) {
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";
		document.getElementById("us_answer").value = rcoll.get(rwords[0]).join(",");
		setTimeout(function () {
			set_word_er();
		}, 1500);
		rwords.shift();
		rwords.sort(compareRandom);
		position++;
		if(rstart[countword + 1] != null && rwords.length < 10) {
			countword++;
			rwords.push(rstart[countword]);
		}
	} else {
		document.getElementById("us_answer").value = ecoll.get(ewords[0]);
		document.getElementById("us_answer").style.background = "#57CE79";
		document.getElementById("us_answer").style.border = "1px solid #57CE79";
		document.getElementById("us_answer").style.color = "#fff";

		setTimeout(function () {
			set_word_re();
		}, 1500);
		ewords.shift();
		position++;

		ewords.sort(compareRandom);
		if(estart[countword + 1] != null && ewords.length < 10) {
			countword++;
			ewords.push(estart[countword]);
		}
	}
}
