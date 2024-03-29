/**
 * переменная для включения и выключения
 *
 * @param {Boolean} debug
 */
var debug = true;

/**
 * Получает данные от переданной формы
 *
 * @param {HTMLFormElement} form
 *
 * @returns {Object} пара ключ значение, где ключ имя поля
 */
export const getFormData = (form) => {
    const formData = new FormData(form);
    let data = {};

    for (const [key, value] of formData) {
        data[key] = value;
    }

    return data;
};

/**
 * Удаляет все методы и наследование объектов Vue
 *
 * @param {Any} data
 *
 * @returns {*} примитив JS
 */
export const strip = (data) => {
    if (!Boolean(data)) return "";
    return JSON.parse(JSON.stringify(data));
};

/**
 * Выводит в консоль данные
 *
 * @param  {...any} data строки
 *
 * @returns {Void}
 */
export const clog = (...data) => {
    const show = Boolean(debug);
    if (!show) return;
    console.log(...data);
    return;
};

/**
 * Отрисовка ломанной линии в канвас без анимации
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<Array<Int,Int>>} pts
 *
 * @returns void
 */
const polylineCb = (ctx, pts) => {
    ctx.beginPath();

    pts.forEach((p, i) => {
        if (i) {
            ctx.lineTo(...p);
        } else {
            ctx.moveTo(...p);
        }
    });
    ctx.stroke();
    return -1;
};

/**
 * Анимаированная отрисовка ломанной линии в канвас
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<Array<Int,Int>>} pts
 * @param {Boolean} draw - для рекурсивного вызова
 *
 * @returns void
 */
const animatePolylineCb = (ctx, pts) => {
    let points = pts;
    let iterator = 0;
    const animate = () => {
        const pointFrom = points[iterator];
        iterator++;
        if (!pointFrom) {
            return -1;
        }
        const pointTo = points[iterator];
        if (!pointTo) {
            return -1;
        }

        ctx.beginPath();
        ctx.moveTo(...pointFrom);
        ctx.lineTo(...pointTo);
        ctx.stroke();

        return requestAnimationFrame(animate);
    };

    animate();
};

/**
 * Рисует ломанную линию в canvas
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<Array<Int,Int>>} pts
 *
 * @returns void
 */
export const polyline = (ctx, pts, animate) => {
    return animate ? animatePolylineCb(ctx, pts) : polylineCb(ctx, pts);
};

/**
 * Получает первую цифру числа
 *
 * @param {Number} number
 *
 * @returns {Ineger}
 */
export const get1stDigit = (number) => {
    const symbol = Array.from(number.toString())[0];
    return Number(symbol);
};

/**
 * Получает ближайшее максимальное значение того же порядка,
 * что и значение
 *
 * @param {Number} value округляемое значение
 * @param {Enum} type  floor | ceil
 *
 * @returns {Number} округленное значение
 */
export const getRoundedValue = (value, type) => {
    const delta = type === "ceil" ? 1 : -1;
    let valueOrder = Math.floor(value).toString().length - 1;
    let firstDigit;

    if (get1stDigit(value) + delta <= 0) {
        firstDigit = 1;
    } else {
        firstDigit = get1stDigit(value) + delta;
    }

    const _return = firstDigit * Math.pow(10, valueOrder);

    return _return;
};

/**
 * Получает значение css свойства элемента
 *
 * @param {HTMLElement} oElm
 * @param {String} strCssRule
 * @param {Boolean} onlyDigits
 *
 * @returns {String|Number}
 */
export const getStyle = (oElm, strCssRule, onlyDigits) => {
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView
            .getComputedStyle(oElm, "")
            .getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }

    return onlyDigits ? parseFloat(strValue) : strValue;
};

/**
 * Получает высоту документа
 *
 * @returns {Number}
 */
export const getDocHeight = () => {
    var body = document.body,
        html = document.documentElement;

    var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );

    return height;
};

/**
 * Обновляет адрес страницы без перезагрузки
 *
 * @param {Array<Object<String, String>>} props массив объектов {prop, value}
 * @param {String} mode
 *
 * @returns {String}
 */
export const replaceUrlState = (props, title = "") => {
    let nextURL = `?`;
    let ampersand = "";
    props.forEach((p) => {
        nextURL = `${nextURL}${ampersand}${p.prop}=${p.value}`;
        ampersand = "&";
    });
    const nextTitle = `Весовая система. ${title}`;
    const nextState = {
        additionalInformation: "Updated the URL with js",
    };
    window.history.replaceState(nextState, nextTitle, nextURL);
    return nextURL;
};

/**
 * ищет значение свойства в URL
 *
 * @param {String} prop имя свойства для поиска
 *
 * @returns {String|false}
 */
export const getPropFromUrl = (prop) => {
    if (location.search.substring(prop) < 0) {
        return false;
    }
    const parts = location.search
        .substring(1)
        .split("&")
        .filter((p) => {
            return p.indexOf(prop) >= 0;
        });
    if (!parts.length) return false;
    const value = parts.pop().split("=").pop();
    return value;
};
