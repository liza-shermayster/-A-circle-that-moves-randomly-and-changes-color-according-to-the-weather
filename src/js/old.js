
const createAnimation = function (delta, el, axis) {
    const final = getFinalPosition(delta, el);
    const interval = setInterval(function () {
        const current = el.getBoundingClientRect().left;
        const direction = delta > 0 ? 'right' : 'left';
        if (direction === 'right' ? current >= final : final >= current) {
            clearInterval(interval);
            return;
        }
        const step = direction === 'right' ? 3 : -3;
        el.style.left = `${current + step}px`;
    }, 20);
};



const getFinalPosition = function (delta, el) {
    const pos = el.getBoundingClientRect();
    const screenWidth =
        window.innerWidth || document.documentElement.clientWidth;
    const newLeft = pos.left + delta;
    const maxLeft = screenWidth - 100;

    if (newLeft > maxLeft) {
        return maxLeft;
    } else if (newLeft < 0) {
        return 0;
    }
    return newLeft;
}



const moveDelta = function (dx, dy) {
    const pos = this.el.getBoundingClientRect();
    const screenHeight =
        window.innerHeight || document.documentElement.clientHeight;
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