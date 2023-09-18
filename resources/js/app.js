/**
 * Основной файл, собирающий весь скрипт приложения
 */

import { createApp } from "vue";
import appPublicUsers from "./public/users.js";
import appPublicEmployees from "./public/employees.js";

// инициализация приложения пользователей для публичной зоны
if (document.getElementById("public-users")) {
    createApp(appPublicUsers).mount("#public-users");
}

// инициализация приложения сотрудников для публичной зоны
if (document.getElementById("public-employees")) {
    createApp(appPublicEmployees).mount("#public-employees");
}

require("./public/ready");
// require("./public/vehicle");
// require("./public/grasslands");
