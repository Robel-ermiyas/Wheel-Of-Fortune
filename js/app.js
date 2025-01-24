//  Constants-------------------------- //
const letters = 'BCDFGHJKLMNPQRSTVWXYZ';
const letterArr = letters.split('');
const spinAmounts = [
  '200',
  '1000',
  '600',
  '300',
  '700',
  '450',
  '100',
  '800',
  'LOSE A TURN',
  '250',
  '400',
  '500',
  'BANKRUPT',
  '900',
  '300',
  '250',
  '900',
  '200',
  '400',
  '550',
  '200',
  '500',
  'LOSE A TURN',
  '600',
];
const puzzles = [
  { category: 'Horror Movies', puzzle: 'Night of the Living Dead' },
  { category: 'Horror Movies', puzzle: 'Day of the Dead' },
  { category: 'Horror Movies', puzzle: 'Dawn of the Dead' },
  { category: 'Horror Movies', puzzle: 'Land of the Dead' },
  { category: 'Prison Movies', puzzle: 'The Green Mile' },
  { category: 'Prison Movies', puzzle: 'The Shawshank Redemption' },
  { category: 'Prison Movies', puzzle: 'Ernest Goes to Jail' },
  { category: 'Prison Movies', puzzle: 'Con Air' },
];
const players = {
  1: {
    name: '',
    score: 0,
  },
  2: {
    name: '',
    score: 0,
  },
};

//-------------------------- Global Variables --------------------------//
let currentPlayer = 1;
let puzzleArr = [];
let puzzle = {};
let boardLetters;
let spinResult;

//-------------------------- Grab DOM Elements -------------------------//
const wheel = document.querySelector('.wheel');
const pointer = document.querySelector('.pointer');
const spinBtn = document.getElementById('spin-btn');
const playerMsg = document.getElementById('player-msg');
const spinResultModal = document.querySelector('.spin-result');
const buyVowelBtn = document.getElementById('buy-vowel-btn');
const vowelContainer = document.querySelector('.vowel-container');
const solveBtn = document.getElementById('solve-btn');
const board = document.querySelector('.board');
const puzzleArea = document.querySelector('.puzzle');
const infoModal = document.querySelector('.info-modal');
const modalInput = document.getElementById('player-name');
const modalBtn = document.getElementById('submit-name');
const category = document.getElementById('category');
const letterContainer = document.querySelector('.letters');
const player1Name = document.querySelector('.player1-name');
const player1Score = document.querySelector('.player1-score');
const player2Name = document.querySelector('.player2-name');
const player2Score = document.querySelector('.player2-score');
const spinSound = document.getElementById('spin-sound');
const bankruptSound = document.getElementById('bankrupt-sound');
const solveSound = document.getElementById('solve-sound');
const puzzleReveal = document.getElementById('puzzle-reveal');
const dingSound = document.getElementById('ding');
const buzzerSound = document.getElementById('buzzer');

//-----------------------Attach Event Listeners-------------------------//
spinBtn.addEventListener('click', handleSpin);
buyVowelBtn.addEventListener('click', buyVowel);
solveBtn.addEventListener('click', solvePuzzle);
modalBtn.onclick = createPlayer1;
modalInput.onkeypress = handleKeypress;

//-------------------------- Game Functions ----------------------------//

// Create buttons for each consonant and add to letter container
function createLetters() {
  letterArr.forEach((letter) => {
    const newLetter = document.createElement('button');
    newLetter.setAttribute('id', letter);
    newLetter.setAttribute('class', 'letter-btn');
    newLetter.textContent = letter;
    letterContainer.appendChild(newLetter);
  });
}

// Player Setup
spinBtn.disabled = true;

// Create Player 1
function createPlayer1() {
    infoModal.querySelector('h2').textContent = 'Player 1 Enter Your Name:';
    if (!modalInput.value) {
        return;
    }
    players[1].name = modalInput.value;
    players[1].score = 0;
    infoModal.classList.toggle('hide');
    
    // After Player 1 registration, prompt for Player 2
    setTimeout(() => {
        infoModal.querySelector('h2').textContent = 'Player 2 Enter Your Name:';
        modalInput.value = '';
        modalInput.focus();
        modalBtn.onclick = createPlayer2;
        infoModal.classList.toggle('hide');
    }, 1000);
}

// Create Player 2
function createPlayer2() {
    if (!modalInput.value) {
        return;
    }
    players[2].name = modalInput.value;
    players[2].score = 0;
    infoModal.classList.toggle('hide');
    
    // Enable the spin button after both players are registered
    spinBtn.disabled = false;

    createPuzzle();
    createLetters();
    updateGame();
}


function createPuzzle() {
  let regex = /[\s',]/;
  puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  puzzleArr = puzzle.puzzle.split('');

  let i = 0;
  while (i < puzzleArr.length) {
    const word = document.createElement('div');
    word.classList.add('word');
    if (puzzleArr[i] === ' ') {
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('letter-container', 'board-space');
      letterDiv.innerHTML = `<div class='puzzle-char'>${puzzleArr[i].toUpperCase()}</div>`;
      puzzleArea.appendChild(letterDiv);
      i++;
    } else {
      while (puzzleArr[i] !== ' ' && i < puzzleArr.length) {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter-container');
        if (regex.test(puzzleArr[i])) {
          letterDiv.innerHTML = `<div class='special-char puzzle-char'>${puzzleArr[i].toUpperCase()}</div>`;
        } else {
          letterDiv.innerHTML = `<div class='hide board-letter puzzle-char'>${puzzleArr[i].toUpperCase()}</div>`;
        }
        word.appendChild(letterDiv);
        i++;
      }
      puzzleArea.appendChild(word);
    }
  }
  category.firstChild.textContent = puzzle.category.toUpperCase();
  boardLetters = document.querySelectorAll('.puzzle-char');
  puzzleReveal.play();
}

// Handle spin Function
function handleSpin() {
    toggleButtons(true);
    wheel.classList.add('spin');
    pointer.classList.add('ticker');
    spinSound.play();

    const spinDuration = 4000; // Total duration of the spin
    const fullRotations = 6; // Number of full rotations
    let index = Math.floor(Math.random() * spinAmounts.length); // Random index for spin result
    spinResult = spinAmounts[index];

    // Calculate the rotation angle
    let rotationAngle = (index * 15) + (360 * fullRotations); // 15 degrees per slice

    // Apply transition and rotation
    wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.33, 1, 0.68, 1)`; // Smooth transition
    wheel.style.transform = `rotateZ(${rotationAngle}deg)`;
    spinResultModal.style.transform = `rotateZ(${-rotationAngle}deg)`;

    setTimeout(() => {
        wheel.classList.remove('spin');
        pointer.classList.remove('ticker');

        spinResultModal.textContent = spinResult;
        spinResultModal.classList.remove('hide');

        if (spinResult !== 'BANKRUPT' && spinResult !== 'LOSE A TURN') {
            playerMsg.textContent = 'Choose a Letter';
            letterContainer.addEventListener('click', pickLetter);
        } else {
            setTimeout(() => {
                if (spinResult === 'BANKRUPT') {
                    players[currentPlayer].score = 0;
                    bankruptSound.play();
                } else {
                    buzzerSound.play();
                }
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                spinResultModal.classList.add('hide');
                spinBtn.disabled = false;
                updateGame();
            }, 1500);
        }
    }, spinDuration);
}

// Handle Keypress
function handleKeypress(e) {
  if (e.which === 13) {
    modalBtn.onclick();
  }
}

// Buy A Vowel
function buyVowel() {
  if (players[currentPlayer].score >= 250) {
    toggleButtons(true);
    vowelContainer.addEventListener('click', pickLetter);
    playerMsg.textContent = `${players[currentPlayer].name} Choose a Vowel`;
    spinResult = 'vowel';
  }
}

// Solve Puzzle
function solvePuzzle() {
  infoModal.querySelector('h2').textContent = `${players[currentPlayer].name} Can you solve the puzzle?`;
  modalInput.value = '';
  modalInput.focus();
  modalBtn.onclick = submitAnswer;
  infoModal.classList.toggle('hide');
  toggleButtons(true);
  modalBtn.disabled = false;

  function submitAnswer() {
    if (!modalInput.value) {
      return;
    }
    infoModal.classList.toggle('hide');
    if (modalInput.value.trim().toUpperCase() === puzzle.puzzle.toUpperCase()) {
      if (players[currentPlayer].score < 1000) {
        players[currentPlayer].score = 1000;
      }
      solveSound.play();
      infoModal.querySelector('h2').textContent = `Congratulations ${players[currentPlayer].name}! You won with a total of $${players[currentPlayer].score}`;
      modalInput.style.opacity = '0';
      modalBtn.textContent = 'Play Again';
      modalBtn.onclick = startGame;
      toggleButtons(false);
      infoModal.classList.toggle('hide');
    } else {
      modalBtn.disabled = true;
      infoModal.querySelector('h2').textContent = `Sorry ${players[currentPlayer].name}. That is incorrect`;
      infoModal.classList.toggle('hide');
      setTimeout(() => {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        infoModal.classList.toggle('hide');
        updateGame();
      }, 2000);
    }
  }
}

// Pick a Letter Handler
function pickLetter(e) {
  if (e.target.classList.contains('letter-btn')) {
    vowelContainer.removeEventListener('click', pickLetter);
    letterContainer.removeEventListener('click', pickLetter);
    let chosenLetter = e.target.textContent;

    // Change the color of the selected letter
    e.target.style.backgroundColor = '#e67e22'; // Change to a different color (orange)
    e.target.style.color = 'white'; // Adjust text color for contrast
    e.target.disabled = true;

    let indexArr = [];
    puzzleArr.forEach((letter, i) => {
      if (chosenLetter === letter.toUpperCase()) {
        indexArr.push(i);
      }
    });
    if (indexArr.length > 0) {
      flipLetters(indexArr);
      calcScore(indexArr);
    } else {
      buzzerSound.play();
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updateGame();
    }
  }
}

// Flip Board Letters
function flipLetters(indexArr) {
  let i = 0;
  let id = setInterval(() => {
    boardLetters[indexArr[i]].classList.remove('hide');
    dingSound.play();
    i++;
    if (i >= indexArr.length) {
      clearInterval(id);
    }
  }, 1200);
  setTimeout(updateGame, 1200 * indexArr.length);
}

// Calculate Score
function calcScore(indexArr) {
  if (spinResult === 'vowel') {
    players[currentPlayer].score -= 250;
  } else {
    players[currentPlayer].score += parseInt(spinResult) * indexArr.length;
  }
}

// Game Update Function
function updateGame() {
  player1Name.textContent = players[1].name.toUpperCase();
  player1Score.textContent = `$${players[1].score}`;
  player2Name.textContent = players[2].name.toUpperCase();
  player2Score.textContent = `$${players[2].score}`;
  playerMsg.textContent = `${players[currentPlayer].name} Make a Choice:`;
  spinResultModal.classList.add('hide');
  if (currentPlayer === 1) {
    player1Name.classList.add('current-player');
    player2Name.classList.remove('current-player');
  } else {
    player2Name.classList.add('current-player');
    player1Name.classList.remove('current-player');
  }
  toggleButtons(false);
}

// Toggle Button States
function toggleButtons(state) {
  spinBtn.disabled = state;
  buyVowelBtn.disabled = state;
  solveBtn.disabled = state;
  modalBtn.disabled = state;
}

function startGame() {
    currentPlayer = 1;
    infoModal.classList.add('hide');
    infoModal.querySelector('h2').textContent = 'Player 1 Enter Your Name:';
    modalInput.style.opacity = '1';
    modalInput.value = '';
    modalInput.focus();
    modalBtn.textContent = 'Submit';
    letterContainer.innerHTML = '';
    puzzleArea.innerHTML = '';
    vowelContainer.childNodes.forEach((btn) => (btn.disabled = false));
    modalBtn.onclick = createPlayer1;
    infoModal.classList.toggle('hide');
    
    // Ensure the spin button is disabled at the start
    spinBtn.disabled = true;
}

// Call startGame to initialize the game
startGame();