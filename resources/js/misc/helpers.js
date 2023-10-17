var debug = true;

export const getFormData = (form) => {
    const formData = new FormData(form);

    let data = {};

    for (const [key, value] of formData) {
        data[key] = value;
    }

    return data;
};

export const strip = (data) => {
    if (!Boolean(data)) return "";
    return JSON.parse(JSON.stringify(data));
};

export const clog = (...data) => {
    const show = Boolean(debug);
    if (!show) return;
    console.log(...data);
};

export const polyline = (ctx, pts) => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
    ctx.stroke();
};

export const get1stDigit = (number) => {
    const symbol = Array.from(number.toString())[0];
    return Number(symbol);
};

/**
 * Получает ближайшее максимальное значение того же порядка, что и значение
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
