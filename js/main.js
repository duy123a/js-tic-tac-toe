import { TURN, CELL_VALUE, GAME_STATUS } from './constants.js';
import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
} from './selectors.js';
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
  // update current turn status on DOM
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isClicked) return;
  // set selected cell
  cell.classList.add(currentTurn);
  // toggle turn
  toggleTurn();

  console.log('click', cell, index);
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  if (!cellElementList) {
    throw new Error("Can't find cell element list");
  }
  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      handleCellClick(cell, index);
    });
  });
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
})();
