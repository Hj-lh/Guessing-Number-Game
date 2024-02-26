const game = {
    secretNumbers: [],
    userGuess: [],
    attempts: 0,
    result: [],
};

function generateRandomNumbers() {
    const digits = Array.from({ length: 9 }, (_, i) => i + 1);
    let randomNumbers = [];

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        const randomDigit = digits.splice(randomIndex, 1)[0];
        randomNumbers.push(randomDigit);
    }

    return randomNumbers;
}

function countCorrectGuesses(userGuess, secretNumbers) {
    let correctPositions = 0;
    let correctNumbers = 0;

    for (let i = 0; i < 4; i++) {
        if (userGuess[i] === secretNumbers[i]) {
            correctPositions++;
        }

        if (secretNumbers.includes(userGuess[i])) {
            correctNumbers++;
        }
    }

    return [correctNumbers, correctPositions];
}

function reset() {
    game.secretNumbers = generateRandomNumbers();
    game.userGuess = [];
    game.attempts = 10;
    game.result = [];
    resetPopups();

    const guessResultsContainer = document.getElementById('guess-results-container');
    guessResultsContainer.innerHTML = '';

    updateMessage("Game reset. I have selected 4 unrepeated new random numbers. Your task is to guess them.");
}
function showWinPopup() {
    document.getElementById('win-popup').style.display = 'block';
}

function showLosePopup(secretNumbers) {
    document.getElementById('lose-popup').style.display = 'block';
    document.getElementById('secret-numbers').innerText = secretNumbers.join(' ');
}

function resetPopups() {
    document.getElementById('win-popup').style.display = 'none';
    document.getElementById('lose-popup').style.display = 'none';
}


function guess(userInput) {
    if (game.attempts === 0) {
        showLosePopup(game.secretNumbers);
        return;
    }

    if (!userInput) {
        updateMessage("Please enter your guess.");
        return;
    }

    if (userInput.length !== 4 || !/^\d+$/.test(userInput)) {
        updateMessage("Please enter 4 digits.");
        return;
    }

    game.userGuess = userInput.split('').map(Number);

    if (new Set(game.userGuess).size < 4) {
        updateMessage("Numbers must not repeat. Try again.");
        return;
    }

    const [correctNumbers, correctPositions] = countCorrectGuesses(game.userGuess, game.secretNumbers);

    if (correctPositions === 4) {
        showWinPopup();
        return;
    }

    game.attempts--;
    // const guessResult = document.createElement('p');
    // guessResult.innerHTML = `Guess: ${game.userGuess.join(' ')}  Correct numbers: ${correctNumbers}  Correct positions: ${correctPositions}`;
    // document.getElementById('guess-results-container').appendChild(guessResult);

    updateMessage(`  Attempts left: ${game.attempts}`);
    document.getElementById('user-input').value = "";
    
    const guessResultsContainer = document.getElementById('guess-results-container');
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = `
    <span style="font-weight: bold;">Guess:</span> ${game.userGuess.join(' ')}
    <span font-weight: bold;">Correct numbers:</span> <span style="font-weight: bold;">${correctNumbers}</span>
    <span font-weight: bold;">Correct positions:</span> <span style="font-weight: bold;"background-color: #ffcccb">${correctPositions}</span>
`;
    guessResultsContainer.appendChild(newParagraph);


    setTimeout(() => {
        newParagraph.classList.add('show');
    }, 10); 
}

function updateMessage(message) {
    document.getElementById('game-message').innerText = message;
}

window.onload = function () {
    reset();
};
