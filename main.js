let Start = (() => {
  // let start = false;
  let bigBadBot = false;
  let name1 = false;
  let name2 = false;
  let mode = "hard";
  let botName = "🤖 BigBadBot"

  function returnBigBadBot() {
    return bigBadBot;
  }
  function returnMode() {
    return mode;
  }

  const startScreen = document.querySelector(".startScreen");

  // event listener for mode selection buttons
  modeSelection();
  function modeSelection() {
    const aiBtn = document.getElementById("aiMode");
    aiBtn.addEventListener("click", () => {
      aiMode();
    });

    const pvpBtn = document.getElementById("pvpMode");
    pvpBtn.addEventListener("click", () => {
      pvpMode();
    });
  }

  function pvpMode() {
    startScreen.style.opacity = "0";
    startScreen.style.zIndex = "-2";
    nameSelection();
  }
  function aiMode() {
    bigBadBot = true;
    difficulty();
    nameSelection();
    startScreen.style.opacity = "0";
    startScreen.style.zIndex = "-2";
  }

  function difficulty() {
    const nameSelection = document.querySelector(".nameSelection");
    const difficultyBtn = document.createElement("button");
    difficultyBtn.classList.add("hard");
    difficultyBtn.setAttribute("id", "difficulty");
    difficultyBtn.textContent = "Current mode: HARD";
    nameSelection.prepend(difficultyBtn);
    nameSelection.style.gap = "15px"

    difficultyBtn.addEventListener("click", () => {
      if (mode === "hard") {
        mode = "easy";
        botName = "👶 BabyBot"
        difficultyBtn.className = "easy";
        difficultyBtn.textContent = "Current mode: baby";
      } else {
        mode = "hard";
        botName = "🤖 BigBadBot"
        difficultyBtn.className = "hard";
        difficultyBtn.textContent = "Current mode: HARD";
      }
      console.log({botName});
    });
  }
  function nameSelection() {
    const nameSelection = document.querySelector(".nameSelection");
    const nameForm1 = document.getElementById("chooseName1");
    const nameForm2 = document.getElementById("chooseName2");
    function zIndex() {
      // nameSelection.style.transform = "scale(10)";
      nameSelection.style.opacity = "0";
      nameSelection.style.zIndex = "-3";
      if (bigBadBot === true)
        nameSelection.removeChild(document.getElementById("difficulty"));
    }

    nameSelection.style.zIndex = "3";

    nameForm1.addEventListener("submit", (e) => {
      e.preventDefault();
      Players.add(1, nameForm1.player1Name.value);
      nameForm1.reset();
      name1 = true;
      if (bigBadBot === true) {
        nameSelection.prepend(nameForm2)
        if (mode === "hard") Players.add(2, botName);
        if (mode === "easy") Players.add(2, botName);
      }
      if (name1 === true && name2 === true) zIndex();
      if (name1 === true && bigBadBot === true) zIndex();

    });
    if (bigBadBot === true) nameSelection.removeChild(nameForm2)

    if (bigBadBot !== true) {
      nameForm2.addEventListener("submit", (e) => {
        e.preventDefault();
        Players.add(2, nameForm2.player2Name.value);
        nameForm2.reset();
        name2 = true;
        if (name1 === true && name2 === true) zIndex();
      });
    }
  }
  document.getElementById("mainMenu").addEventListener("click", () => {
    location.reload();
  });
  return { returnBigBadBot, returnMode };
})();

let Gameboard = (() => {
  const cells = document.querySelectorAll(".cell");
  let gameboard = [];
  let playerTurn = "X";
  let roundTurn = "X";
  let xScore = 0;
  let oScore = 0;
  let block = false;

  for (let i = 0; i < 9; i++) gameboard.push(""); //builds board array

  // eventlistener for each cell of the board
  _selectTile();
  function _selectTile() {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (block === true) return;
        if (playerTurn === "X") {
          _add(cell.id);
          return;
        }

        if (playerTurn === "O") {
          _add(cell.id);
          return;
        }
      });
    });
  }
  // adds X or O to cell
  function _add(cell) {
    if (gameboard[cell] !== "") return;
    if (playerTurn === "X") gameboard.splice(cell, 1, "X");
    if (playerTurn === "O") gameboard.splice(cell, 1, "O");
    _render(cell);
  }

  // displays array on the board
  function _render(cellId) {
    let cell = document.getElementById(cellId);

    if (playerTurn === "O") cell.textContent = "⭘";
    if (playerTurn === "X") cell.textContent = "✕";

    let win = _checkWin();
    if (win !== null) return _announceResult(win);

    _nextTurn();
    if (Start.returnBigBadBot() === true && playerTurn === "O") {
      block = true;
      let aiCell;
      let mode = Start.returnMode();
      if (mode === "hard") aiCell = bestMove();
      if (mode === "easy") aiCell = aiPlay();
      gameboard.splice(aiCell, 1, "O");
      setTimeout(() => {
        _render(aiCell);
        block = false;
      }, 1000);
    }
  }

  // checks if board array matches winning arrays
  function _checkWin() {
    let result = null;
    const winningArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    winningArray.forEach((i) => {
      if (
        gameboard[i[0]] === "X" &&
        gameboard[i[1]] === "X" &&
        gameboard[i[2]] === "X"
      ) {
        return (result = "X");
      }
      if (
        gameboard[i[0]] === "O" &&
        gameboard[i[1]] === "O" &&
        gameboard[i[2]] === "O"
      ) {
        return (result = "O");
      }
    });
    let tieCount = 0;
    gameboard.forEach((e) => {
      if (e === "") tieCount++;
    });
    if (tieCount === 0 && result === null) return (result = "tie");
    return result;
  }
  // displays result when there's a win or a tie
  function _announceResult(result) {
    const container = document.querySelector(".resultScreen");
    const div = document.createElement("div");
    div.classList.add("result");
    if (result === "X") {
      xScore++;
      div.textContent = `${Players.players[0]} wins the game!`;
      document.querySelector(".xScore").textContent = `score: ${xScore}`;
    }
    if (result === "O") {
      oScore++;
      div.textContent = `${Players.players[1]} wins the game!`;
      document.querySelector(".oScore").textContent = `score: ${oScore}`;
    }
    if (result === "tie") div.textContent = `It's a tie...`;
    container.prepend(div);
    container.style.zIndex = "1";
    restart();
  }
  // changes turn from X to O and vice versa
  function _nextTurn() {
    const right = document.getElementById("right");
    const left = document.getElementById("left");

    if (playerTurn === "O") {
      right.className = "right";
      left.className = "leftActive";
      playerTurn = "X";
    } else {
      right.className = "rightActive";
      left.className = "left";
      playerTurn = "O";
    }
  }

  // adds restart button
  function restart() {
    const container = document.querySelector(".resultScreen");
    const btn = document.createElement("button");
    container.appendChild(btn);
    btn.classList.add("restart");
    btn.textContent = "Replay";
    btn.addEventListener("click", () => reload());
  }
  // resets board and adjusts player turns
  function reload() {
    gameboard = [];
    for (let i = 0; i < 9; i++) {
      let cell = document.getElementById(i);
      cell.textContent = "";
      gameboard.push("");
    }

    let resultScreen = document.querySelector(".resultScreen");
    resultScreen.style.zIndex = "-1";
    let result = document.querySelector(".result");
    let btn = document.querySelector(".restart");
    resultScreen.removeChild(result);
    resultScreen.removeChild(btn);
    if (roundTurn === "X") {
      playerTurn = "X";
      roundTurn = "O";
    } else {
      playerTurn = "O";
      roundTurn = "X";
    }
    _nextTurn();
    if (Start.returnBigBadBot() === true && playerTurn === "O") _add(aiPlay());
    _selectTile();
  }

  // random num generator for "dumb" ai
  function aiPlay() {
    let randomNum = Math.floor(Math.random() * 9);
    if (gameboard[randomNum] !== "") {
      return aiPlay();
    }
    return randomNum;
  }

  // calls minimax algorithm
  function bestMove() {
    let move;
    let bestScore = Infinity;
    for (let i = 0; i <= gameboard.length; i++) {
      if (gameboard[i] === "") {
        gameboard[i] = "O";
        let score = miniMax(gameboard, 0, true);
        gameboard[i] = "";
        if (score < bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }
  let scores = {
    X: 10,
    O: -10,
    tie: 0,
  };
  // minimax algorithm (find the most optimal move with recursive function)
  function miniMax(board, depth, isMaximizing) {
    let result = _checkWin();
    if (result !== null) return scores[result];

    if (isMaximizing === true) {
      let bestScore = -Infinity;
      for (let i = 0; i <= board.length; i++) {
        if (board[i] === "") {
          board[i] = "X";
          let score = miniMax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
    if (isMaximizing === false) {
      let bestScore = Infinity;
      for (let i = 0; i <= board.length; i++) {
        if (board[i] === "") {
          board[i] = "O";
          let score = miniMax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function returnGameboard() {
    return gameboard;
  }

  return {
    oScore,
    xScore,
    returnGameboard,
    restart,
  };
})();

const Players = (() => {
  const nameSelection = document.querySelector(".nameSelection");
  let players = ["", ""];

  let add = (player, name) => {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    if (player === 1) {
      nameSelection.removeChild(document.getElementById("chooseName1"));
      players.splice(0, 1, name);
      if (players[0] === "") {
        player1.textContent = "Player1";
        players[0] = "Player1";
        return;
      } else return (player1.textContent = `${players[0]}`);
    }
    if (player === 2) {
      nameSelection.removeChild(document.getElementById("chooseName2"));
      players.splice(1, 1, name);
      if (players[1] === "") {
        player2.textContent = "Player2";
        players[1] = "Player2";
        return;
      } else return (player2.textContent = `${players[1]}`);
    }
  };

  return { players, add };
})();
