/**
 * Основной файл, собирающий весь скрипт приложения
 */

import { createApp } from "vue";
import homePage from "./public/home.js";
import publicUsers from "./public/users.js";
import publicEmployees from "./public/employees.js";
import publicVehicles from "./public/vehicle.js";
import publicGrasslands from "./public/grasslands.js";

// инициализация домашней страницы для публичной зоны
if (document.getElementById("home-page")) {
    createApp(homePage).mount("#home-page");
}
// инициализация приложения пользователей для публичной зоны
if (document.getElementById("public-users")) {
    createApp(publicUsers).mount("#public-users");
}

// инициализация приложения сотрудников для публичной зоны
if (document.getElementById("public-employees")) {
    createApp(publicEmployees).mount("#public-employees");
}

// инициализация приложения техники для публичной зоны
if (document.getElementById("public-vehicles")) {
    createApp(publicVehicles).mount("#public-vehicles");
}

// инициализация приложения полей для публичной зоны
if (document.getElementById("public-grasslands")) {
    createApp(publicGrasslands).mount("#public-grasslands");
}

require("./public/ready");
// require("./public/vehicle");
// require("./public/grasslands");
