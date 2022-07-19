import { TURN, CELL_VALUE, GAME_STATUS } from './constants.js';
import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayButtonElement,
  getCellListElement,
} from './selectors.js';
import { checkGameStatus } from './utils.js';
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) {
    gameStatusElement.textContent = newGameStatus;
  }
}

function showReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) {
    replayButtonElement.classList.add('show');
  }
}

function hideReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) {
    replayButtonElement.classList.remove('show');
  }
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid win positions');
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add('win');
  }
}

function updateCurrentTurn(turn) {
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(turn);
  }
}

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
  // update current turn status on DOM
  updateCurrentTurn(currentTurn);
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isEndGame) return;
  // set selected cell
  cell.classList.add(currentTurn);

  // update cell value
  cellValues[index] =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  // toggle turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }
    default:
  }
}

function resetGame() {
  // reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  // reset current turn
  updateCurrentTurn(currentTurn);

  // hide replay button
  hideReplayButton();

  // reset game board
  const cellElementList = getCellElementList();
  if (!cellElementList) {
    throw new Error("Can't find cell element list");
  }
  for (const cell of cellElementList) {
    cell.className = '';
  }

  // ready to play again
  updateGameStatus(gameStatus);
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  if (!cellElementList) {
    throw new Error("Can't find cell element list");
  }
  cellElementList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  const ulElement = getCellListElement();
  if (!ulElement) {
    throw new Error("Can't find cell list element");
  }
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;
    const index = event.target.dataset.idx;
    handleCellClick(event.target, index);
  });
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) {
    replayButtonElement.addEventListener('click', resetGame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // autoplay audio, only check for Chrome-based browser
  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (isChrome) {
    document.querySelector('.game-page').addEventListener(
      'click',
      function () {
        document.getElementById('playAudio').play();
      },
      { once: true }
    );
  }
  // bind click event for all li elements
  initCellElementList();
  // bind click event for replay button
  initReplayButton();
  // change loading state to ready state
  updateGameStatus(gameStatus);
})();
