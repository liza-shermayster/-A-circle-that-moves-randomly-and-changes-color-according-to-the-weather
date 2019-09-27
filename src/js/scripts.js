// piece object
const piece = (function () {
  let el = null;
  let initTop;
  let initLeft;

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
    const screenWidth =
      window.innerWidth || document.documentElement.clientWidth;

    const screenHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const newLeft = pos.left + dx;
    const maxLeft = screenWidth - 100;

    const newLeftPos = () => {
      if (newLeft > maxLeft) {
        return maxLeft;
      } else if (newLeft < 0) {
        return 0;
      }
      return newLeft;
    }


    const newTop = pos.top + dy;
    const maxTop = screenHeight - 100;
    const newTopPos = () => {
      if (newTop > maxTop) {
        return maxTop;
      } else if (newTop < 0) {
        return 0;
      }
      return newTop;
    }
    const getCurrLeftPos = () => this.el.getBoundingClientRect().left;
    const createAnimationDx = setInterval(function () {
      const direction = dx > 0 ? 'right' : 'left';
      const final = newLeftPos();
      const current = getCurrLeftPos();

      if (direction === 'right' ? current >= final : final >= current) {
        clearInterval(createAnimationDx);
        return;
      }
      const step = direction === 'right' ? 3 : -3;
      this.el.style.left = `${current + step}px`;
    }.bind(this), 20)

    // this.el.style.left = `${newLeftPos()}px`;
    this.el.style.top = `${newTopPos()}px`;
  };

  const setColor = function (color) {
    this.el.classList.add(color);
  }
  return {
    init,
    reset,
    moveRandom,
    moveDelta,
    setColor
  };
})();

function handleClick(ev) {
  piece.moveDelta(parseInt(this.dataset.dx), parseInt(this.dataset.dy));
}

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

function initBtn(el) {
  const $btn = document.getElementById(el.btnId);
  $btn.dataset.dx = el.dx;
  $btn.dataset.dy = el.dy;
  $btn.addEventListener("click", handleClick);
}

function init() {
  for (const el of config) {
    initBtn(el);
  }
}

function resetBtnClicked() {
  piece.reset();
}
function initRandBtn(params) {
  const random = document.getElementById('btn-random');
  random.addEventListener('click', () => {
    piece.moveRandom();
  })
}

function resetLocation() {
  const reset = document.getElementById("btn-reset");
  reset.addEventListener('click', resetBtnClicked);
}


function fetchTemp() {

  fetch("http://api.apixu.com/v1/current.json?key=dda6e762ae4f41efb7e173552192204&q=tel%20aviv")
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(data => {
      console.log(data)
      return data.current.temp_c
    })
    .then(getColor)
    .then(piece.setColor.bind(piece));
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

window.addEventListener("DOMContentLoaded", event => {
  piece.init(document.getElementById("piece"));
  initRandBtn();
  resetLocation();
  init();
  fetchTemp();
});
