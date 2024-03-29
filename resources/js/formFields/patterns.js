const patternData = {
    russianLetter: {
        pattern: "[А-Яа-я]{1,}",
        title: "Допустимы только русские буквы. Удалите пробелы",
    },

    email: {
        pattern: "[a-z0-9]+@[a-z]+\\.[a-z]{2,4}",
        title: "email в формате <foo@bar.com>, допускаются латинские буквы и цифры. Обязательно наличие символов @ и . после точки допускается от 2х до 4х символов",
    },

    phone: {
        pattern: "[+]{0,1}[0-9\\-\\(\\)\\s]{1,}",
        title: "Допустимы цифры, и символы (, ), +, -",
    },

    float: {
        pattern: "\\d*\\.?\\d{1}",
        title: "Допустимы только цифры и разделитель регистра (.) После точки должна быть строго 1 цифра",
    },

    wordsDigitsSpace: {
        pattern: "[a-zA-Zа-яёА-ЯЁ\\d\\s]{1,}",
        title: "Допустимы буквы, цифры и пробелы",
    },
};

export default patternData;
