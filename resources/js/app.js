/**
 * Основной файл, собирающий весь скрипт приложения
 */

import { createApp } from "vue";
import appPublicUsers from "./public/users.js";
import appPublicEmployees from "./public/employees.js";
import appPublicVehicles from "./public/vehicle.js";
import appPublicGrasslands from "./public/grasslands.js";

// инициализация приложения пользователей для публичной зоны
if (document.getElementById("public-users")) {
    createApp(appPublicUsers).mount("#public-users");
}

// инициализация приложения сотрудников для публичной зоны
if (document.getElementById("public-employees")) {
    createApp(appPublicEmployees).mount("#public-employees");
}

// инициализация приложения техники для публичной зоны
if (document.getElementById("public-vehicles")) {
    createApp(appPublicVehicles).mount("#public-vehicles");
}

// инициализация приложения полей для публичной зоны
if (document.getElementById("public-grasslands")) {
    createApp(appPublicGrasslands).mount("#public-grasslands");
}

require("./public/ready");
// require("./public/vehicle");
// require("./public/grasslands");
