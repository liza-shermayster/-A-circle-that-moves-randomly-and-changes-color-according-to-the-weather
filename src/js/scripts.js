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

  const moveDelta = function (dx, dy) {
    const pos = this.el.getBoundingClientRect();

    //move on x axis 
    const getCurrLeftPos = () => this.el.getBoundingClientRect().left;
    const createAnimationDx = setInterval(() => {
      const direction = dx > 0 ? 'right' : 'left';
      const final = getPieceLeftPosition(pos.left, dx);
      const current = getCurrLeftPos();

      if (direction === 'right' ? current >= final : final >= current) {
        clearInterval(createAnimationDx);
        return;
      }
      const step = direction === 'right' ? 3 : -3;
      this.el.style.left = `${current + step}px`;
    }, 20);

    //move on y axis
    const getCurrTopPos = () => this.el.getBoundingClientRect().top;
    const createAnimationDy = setInterval(() => {
      const direction = dy > 0 ? 'top' : 'down';
      const final = getPieceRightPosition(pos.top, dy);
      const current = getCurrTopPos();

      if (direction === 'top' ? current >= final : final >= current) {
        clearInterval(createAnimationDy);
        return;
      }
      const step = direction === 'top' ? 3 : -3;
      this.el.style.top = `${current + step}px`;
    }, 20)
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

  if (newLeft > maxLeft) {
    return maxLeft;
  } else if (newLeft < 0) {
    return 0;
  }
  return newLeft;
}

function getPieceRightPosition(posRight, dy) {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight;
  const newTop = posRight + dy;
  const maxTop = screenHeight - 100;

  if (newTop > maxTop) {
    return maxTop;
  } else if (newTop < 0) {
    return 0;
  }
  return newTop;
}


