const PI = Math.PI;

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;

const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

const n1 = 7.5625;
const d1 = 2.75;


export class Ease {

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    linear(x) {
        return x;
    }

    inSine(x) {
        return 1 - Math.cos((x * PI) / 2);
    }

    outSine(x) {
        return Math.sin((x * PI) / 2);
    }

    inOutSine(x) {
        return -(Math.cos(PI * x) - 1) / 2;
    }

    inQuad(x) {
        return x * x;
    }

    outQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    inOutQuad(x) {
        if (x < 0.5) {
            return 2 * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    inCubic(x) {
        return x * x * x;
    }

    outCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    inOutCubic(x) {
        if (x < 0.5) {
            return 4 * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    inQuart(x) {
        return x * x * x * x;
    }

    outQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    inOutQuart(x) {
        if (x < 0.5) {
            return 8 * x * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 4) / 2;
    }

    inQuint(x) {
        return x * x * x * x * x;
    }

    outQuint(x) {
        return 1 - Math.pow(1 - x, 5);
    }

    inOutQuint(x) {
        if (x < 0.5) {
            return 16 * x * x * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    inExpo(x) {
        if (x === 0) return 0;
        return Math.pow(2, 10 * x - 10);
    }

    outExpo(x) {
        if (x === 1) return 1;
        return 1 - Math.pow(2, -10 * x);
    }

    inOutExpo(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        if (x < 0.5) {
            return Math.pow(2, 20 * x - 10) / 2;
        }
        return (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    inCirc(x) {
        return 1 - Math.sqrt(1 - x * x);
    }

    outCirc(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    inOutCirc(x) {
        if (x < 0.5) {
            return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2;
        }
        return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }

    inBack(x) {
        return c3 * x * x * x - c1 * x * x;
    }

    outBack(x) {
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    inOutBack(x) {
        if (x < 0.5) {
            return (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2;
        }
        return (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    inElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        return -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }

    outElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    inOutElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        if (x < 0.5) {
            return -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2;
        }
        return (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }

    inBouce(x) {
        return 1 - outBounce(1 - x);
    }

    outBounce(x) {
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }

    inOutBounce(x) {
        if (x < 0.5) {
            return (1 - outBounce(1 - 2 * x)) / 2;
        }
        return (1 + outBounce(2 * x - 1)) / 2;
    }
}