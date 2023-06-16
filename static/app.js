let score = 0;
let time = 60;
let guesses = [];

$(function () {
	timer;
});

$('button').on('click', async function (e) {
	e.preventDefault();
	let guess = $('input');
	try {
		let response = await axios.post(
			'/check_guess',
			{
				word: guess.val(),
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		handleResponse(response, guess.val());
		guess.val('');
	} catch {
		alert('We encountered an issue');
	}
});

function handleResponse(resp, word) {
	if (checkIfDuplicate(word)) {
		alert('You have already guessed that word!');
	} else {
		if (resp.data == 'result: ok') {
			alert('Nice job!');
			guesses.push(word.toLowerCase());
			score += word.length;
			$('.num').text(score);
		} else if (resp.data == 'result: not-on-board') {
			alert('Sorry, that word is not on the board!');
			guesses.push(word.toLowerCase());
		} else {
			alert('Your guess must be a valid word!');
			guesses.push(word.toLowerCase());
		}
	}
}

function checkIfDuplicate(word) {
	for (let guess of guesses) {
		if (guess == word.toLowerCase()) {
			return true;
		}
	}
	return false;
}

let timer = setInterval(function () {
	time--;
	if (time == 0) {
		alert(`Time's up, your final score was ${score}!`);
		updateStats();
	}
}, 1000);

async function updateStats() {
	try {
		await axios.post(
			'/end_game',
			{
				score: score,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		location.reload();
	} catch {
		alert('We encountered an issue at the very end');
	}
}
