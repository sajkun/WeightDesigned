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
