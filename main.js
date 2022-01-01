let Start = (() => {
  // let start = false;
  let bigBadBot = false;
  let name1 = false;
  let name2 = false;

  function returnBigBadBot() {
    return bigBadBot;
  }
  const startScreen = document.querySelector(".startScreen");
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
    startScreen.style.transform = "scale(30)"
    startScreen.style.opacity = "0"
    setTimeout(() => {
      startScreen.style.zIndex = "-2";
      nameSelection();
    }, 200);
  }
  function aiMode() {
    bigBadBot = true;
    nameSelection();
    startScreen.style.transform = "scale(30)"
    startScreen.style.opacity = "0"
    setTimeout(() => {
      startScreen.style.zIndex = "-2";
    }, 200);
  }
  
  function nameSelection() {
    const nameSelection = document.querySelector(".nameSelection");
    const nameForm1 = document.getElementById("chooseName1");
    const nameForm2 = document.getElementById("chooseName2");
    function zIndex() {
      nameSelection.style.transform = "scale(10)"
      nameSelection.style.opacity = "0"
      nameSelection.style.zIndex = "-3";
    }
    
    nameSelection.style.zIndex = "3";
    
    nameForm1.addEventListener("submit", (e) => {
      e.preventDefault();
      Players.add(1, nameForm1.player1Name.value);
      nameForm1.reset();
      name1 = true;
      if (name1 === true && name2 === true) zIndex();
      if (name1 === true && bigBadBot === true) zIndex()
    });

    if (bigBadBot === true) {
      Players.add(2, "BigBadBot");
    }
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
  return { returnBigBadBot };
})();

let Gameboard = (() => {
  const cells = document.querySelectorAll(".cell");
  let gameboard = [];
  let playerTurn = "X";
  let win = false;
  let tie = false;
  let xScore = 0;
  let oScore = 0;
  let block =false

  for (let i = 0; i < 9; i++) gameboard.push(""); //builds board array

  function returnGameboard() {
    return gameboard;
  }

  // displays array on the board
  function _render(cellId) {

    let cell = document.getElementById(cellId);
    if (playerTurn === "O") cell.textContent = "⭘";
    if (playerTurn === "X") cell.textContent = "✕";
    _checkWin();
    if (win === true) return;
    _nextTurn();
    block = true
    setTimeout(() => {
      if (
        Start.returnBigBadBot() === true &&
        playerTurn === "O" &&
        win === false
        ) {
          let randomCell = aiPlay();
          gameboard.splice(randomCell, 1, "O");
          _render(randomCell);
        }
        block = false
      }, 500);
  }

  function _announceResult(result) {
    const container = document.querySelector(".resultScreen");
    const div = document.createElement("div");
    container.prepend(div);
    div.classList.add("result");
    if (result === "X") {
      div.textContent = `${Players.players[0]} wins the game!`;
      document.querySelector(".xScore").textContent = `score: ${xScore}`;
    }
    if (result === "O") {
      div.textContent = `${Players.players[1]} wins the game!`;
      document.querySelector(".oScore").textContent = `score: ${oScore}`;
    }
    if (result === tie) div.textContent = `It's a tie...`;
    container.style.zIndex = "1";

    restart();
  }

  function restart() {
    const container = document.querySelector(".resultScreen");
    const btn = document.createElement("button");
    container.appendChild(btn);
    btn.classList.add("restart");
    btn.textContent = "Replay";
    btn.addEventListener("click", () => reload());
  }

  function reload() {
    gameboard = [];
    for (let i = 0; i < 9; i++) {
      let cell = document.getElementById(i);
      cell.textContent = "";
      gameboard.push("");
    }

    win = false;
    tie = false;

    let resultScreen = document.querySelector(".resultScreen");
    resultScreen.style.zIndex = "-1";
    let result = document.querySelector(".result");
    let btn = document.querySelector(".restart");
    resultScreen.removeChild(result);
    resultScreen.removeChild(btn);
    if (Start.returnBigBadBot() === false) _nextTurn();
    if (Start.returnBigBadBot() === true) playerTurn = "X";
    _selectTile();
  }

  // checks if board array matches winning arrays
  function _checkWin() {
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
        win = true;
        xScore += 1;
        return _announceResult("X");
      }
      if (
        gameboard[i[0]] === "O" &&
        gameboard[i[1]] === "O" &&
        gameboard[i[2]] === "O"
      ) {
        win = true;
        oScore += 1;
        console.log({ oScore });
        return _announceResult("O");
      }
    });

    let tieCount = 0;
    gameboard.forEach((e) => {
      if (e === "") tieCount++;
    });
    if (tieCount === 0 && win !== true) {
      win = true;
      return _announceResult(tie);
    }
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

  function aiPlay() {
    let randomNum = Math.floor(Math.random() * 9);
    if (gameboard[randomNum] !== "") {
      return aiPlay();
    }
    return randomNum;
  }

  // adds X or O to cell
  function _add(cell) {
    if (gameboard[cell] !== "") return;
    if (playerTurn === "X") gameboard.splice(cell, 1, "X");
    if (playerTurn === "O") gameboard.splice(cell, 1, "O");
    _render(cell);
  }

  // eventlistener for each cell of the board
  _selectTile();
  function _selectTile() {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (block === true) return;
        if (playerTurn === "X" && win !== true && tie !== true) {
          _add(cell.id);
          return;
        }

        if (playerTurn === "O" && win !== true && tie !== true) {
          _add(cell.id);
          return;
        }
      });
    });
  }

  return { oScore, xScore, returnGameboard, restart };
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

  function restart() {
    players = ["", ""];
    p1HasName = false;
    p2HasName = false;
  }
  return { players, add, restart };
})();
