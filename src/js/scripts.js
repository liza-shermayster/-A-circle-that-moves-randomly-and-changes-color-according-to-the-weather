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

// piece object
const piece = (function () {
  let el = null;
  let initTop;
  let initLeft;

  const setColor = function (color) {
    this.el.classList.add(color);
  }

  const init = function (el) {
    this.el = el;
    const pos = this.el.getBoundingClientRect();
    initLeft = pos.left;
    initTop = pos.top;
  };

  const reset = function () {
    this.el.style.left = initLeft + "px";
    this.el.style.top = initTop + "px";
  }

  const moveRandom = function () {
    this.el.style.left = Math.floor(Math.random() * 100) + "vw";
    this.el.style.top = Math.floor(Math.random() * 100) + "vh";
  }

  const createAnimation = function (delta, el, side) {
    const pos = el.getBoundingClientRect();
    const directionIsPositive = delta > 0;
    const final = getPieceLeftPosition(pos[side], delta);
    const getCurrLeftPos = () => el.getBoundingClientRect()[side];
    const interval = setInterval(() => {
      const current = getCurrLeftPos();

      if (isFinalPosition(current, final, directionIsPositive)) {
        clearInterval(interval);
        return;
      }
      const step = directionIsPositive ? 3 : -3;
      el.style[side] = `${current + step}px`;
    }, 20);
  }
  const isFinalPosition = function (current, final, direction) {
    if (direction) {
      return current >= final;
    } else {
      return final >= current;
    }
  }

  const moveDelta = function (dx, dy) {

    createAnimation(dx, this.el, 'left');
    createAnimation(dy, this.el, 'top');

  };

  return {
    init,
    reset,
    moveRandom,
    moveDelta,
    setColor
  };
})();


window.addEventListener("DOMContentLoaded", init);

function init() {
  piece.init(document.getElementById("piece"));
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

/**
 * @desc gives color to piece element according to Tel Aviv temperature
 */
function fetchTemp() {
  const telAvivTempUrl = "http://api.apixu.com/v1/current.json?key=dda6e762ae4f41efb7e173552192204&q=tel%20aviv";
  fetch(telAvivTempUrl)
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(getTempInC)
    .then(getColor)
    .then(piece.setColor.bind(piece));
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

function validateResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function readResponseAsJSON(response) {
  return response.json();
}

function getTempInC(data) {
  return data.current.temp_c;
}

function getColor(tem) {
  switch (tem) {
    case tem <= 10:
      return 'blue';
    case 10 < tem <= 20:
      return 'green';
    case 20 < tem <= 30:
      return 'yellow';
    default:
      return "red";

  }
}

function getPieceLeftPosition(posLeft, dx) {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const newLeft = posLeft + dx;
  const maxLeft = screenWidth - 100;

  return getFinalPiecePosition(newLeft, maxLeft);
}

function getPieceTopPosition(posTop, dy) {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight;
  const newTop = posTop + dy;
  const maxTop = screenHeight - 100;

  return getFinalPiecePosition(newTop, maxTop);
}

function getFinalPiecePosition(newPos, maxPos) {
  if (newPos > maxPos) {
    return maxPos;
  } else if (newPos < 0) {
    return 0;
  }
  return newPos;
}


