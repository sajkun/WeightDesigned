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
