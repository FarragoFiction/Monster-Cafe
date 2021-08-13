const PI = Math.PI;

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;

const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

const n1 = 7.5625;
const d1 = 2.75;


export class Ease {

    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static linear(x) {
        return x;
    }

    static inSine(x) {
        return 1 - Math.cos((x * PI) / 2);
    }

    static outSine(x) {
        return Math.sin((x * PI) / 2);
    }

    static inOutSine(x) {
        return -(Math.cos(PI * x) - 1) / 2;
    }

    static inQuad(x) {
        return x * x;
    }

    static outQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    static inOutQuad(x) {
        if (x < 0.5) {
            return 2 * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    static inCubic(x) {
        return x * x * x;
    }

    static outCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    static inOutCubic(x) {
        if (x < 0.5) {
            return 4 * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    static inQuart(x) {
        return x * x * x * x;
    }

    static outQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    static inOutQuart(x) {
        if (x < 0.5) {
            return 8 * x * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 4) / 2;
    }

    static inQuint(x) {
        return x * x * x * x * x;
    }

    static outQuint(x) {
        return 1 - Math.pow(1 - x, 5);
    }

    static inOutQuint(x) {
        if (x < 0.5) {
            return 16 * x * x * x * x * x;
        }
        return 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    static inExpo(x) {
        if (x === 0) return 0;
        return Math.pow(2, 10 * x - 10);
    }

    static outExpo(x) {
        if (x === 1) return 1;
        return 1 - Math.pow(2, -10 * x);
    }

    static inOutExpo(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        if (x < 0.5) {
            return Math.pow(2, 20 * x - 10) / 2;
        }
        return (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    static inCirc(x) {
        return 1 - Math.sqrt(1 - x * x);
    }

    static outCirc(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    static inOutCirc(x) {
        if (x < 0.5) {
            return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2;
        }
        return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }

    static inBack(x) {
        return c3 * x * x * x - c1 * x * x;
    }

    static outBack(x) {
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    static inOutBack(x) {
        if (x < 0.5) {
            return (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2;
        }
        return (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    static inElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        return -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }

    static outElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    static inOutElastic(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        if (x < 0.5) {
            return -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2;
        }
        return (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }

    static inBouce(x) {
        return 1 - outBounce(1 - x);
    }

    static outBounce(x) {
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

    static inOutBounce(x) {
        if (x < 0.5) {
            return (1 - outBounce(1 - 2 * x)) / 2;
        }
        return (1 + outBounce(2 * x - 1)) / 2;
    }
}