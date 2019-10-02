import { Piece } from "./piece";
import { getColor } from "./service";
import 'regenerator-runtime/runtime'
const config = [
  {
    btnId: 'btn-up',
    dx: 0,
    dy: -100
  },
  {
    btnId: 'btn-right',
    dx: 100,
    dy: 0
  },
  {
    btnId: 'btn-down',
    dx: 0,
    dy: 100
  },
  {
    btnId: 'btn-left',
    dx: -100,
    dy: 0
  }
];

let piece;

window.addEventListener("DOMContentLoaded", init);


function init() {
  piece = new Piece(document.getElementById("piece"));
  initRandomBtn();
  initResetBtn();
  initMoveBtns();
  fetchTemp();

}


function initRandomBtn() {
  const random = document.getElementById('btn-random');
  random.addEventListener('click', () => {
    piece.moveRandom();
  })
}
function initResetBtn() {
  const reset = document.getElementById("btn-reset");
  reset.addEventListener('click', resetBtnClicked);
}

function initMoveBtns() {
  for (const el of config) {
    initBtn(el);
  }
}


async function fetchTemp() {
  const color = await getColor();
  piece.setColor(color);
}

function initBtn(el) {
  const $btn = document.getElementById(el.btnId);
  $btn.dataset.dx = el.dx;
  $btn.dataset.dy = el.dy;
  $btn.addEventListener("click", handleClick);
}

function resetBtnClicked() {
  piece.reset();
}

function handleClick(ev) {
  piece.moveDelta(parseInt(this.dataset.dx), parseInt(this.dataset.dy));
}



