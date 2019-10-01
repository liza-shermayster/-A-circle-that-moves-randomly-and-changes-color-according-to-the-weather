export class Piece {
    constructor(el) {
        this.el = el;
        const pos = this.el.getBoundingClientRect();
        this.initLeft = pos.left;
        this.initTop = pos.top;
    }
    setColor(color) {
        this.el.classList.add(color);
    }
    reset() {
        this.el.style.left = this.initLeft + "px";
        this.el.style.top = this.initTop + "px";
    }
    moveRandom() {
        this.el.style.left = Math.floor(Math.random() * 100) + "vw";
        this.el.style.top = Math.floor(Math.random() * 100) + "vh";
    }
    createAnimation(delta, side) {
        const pos = this.el.getBoundingClientRect();
        const directionIsPositive = delta > 0;
        const final = getFinalPosition(pos[side], delta, side);
        const getCurrtSidePos = () => this.el.getBoundingClientRect()[side];
        const interval = setInterval(() => {
            const current = getCurrtSidePos();
            if (isFinalPosition(current, final, directionIsPositive)) {
                clearInterval(interval);
                return;
            }
            const step = directionIsPositive ? 3 : -3;
            this.el.style[side] = `${current + step}px`;
        }, 20);
    }

    moveDelta(dx, dy) {
        this.createAnimation(dx, 'left');
        this.createAnimation(dy, 'top');
    };
}


function getFinalPosition(pos, d, side) {
    const max = getMaxScreen(side);
    const newPos = pos + d;
    const maxPos = max - 100;

    return getFinalPiecePosition(newPos, maxPos);
}

function getMaxScreen(side) {
    if (side === 'left') {
        return window.innerWidth || document.documentElement.clientWidth;
    } else {
        return window.innerHeight || document.documentElement.clientHeight;
    }
}

function getFinalPiecePosition(newPos, maxPos) {
    if (newPos > maxPos) {
        return maxPos;
    } else if (newPos < 0) {
        return 0;
    }
    return newPos;
}
function isFinalPosition(current, final, direction) {
    if (direction) {
        return current >= final;
    } else {
        return final >= current;
    }
}