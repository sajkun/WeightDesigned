/**
 * Основной файл, собирающий весь скрипт приложения
 */
import { createApp } from "vue";
import homePage from "./pages/home.js";
import publicUsers from "./pages/users.js";
import publicEmployees from "./pages/employees.js";
import publicVehicles from "./pages/vehicle.js";
import publicGrasslands from "./pages/grasslands.js";
import publicRating from "./pages/rating.js";
import publicStatistics from "./pages/statistics.js";
require("./misc/ready.js");

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

// инициализация приложения рейтинга для публичной зоны
if (document.getElementById("public-rating")) {
    createApp(publicRating).mount("#public-rating");
}

// инициализация приложения статистики для публичной зоны
if (document.getElementById("public-statistics")) {
    createApp(publicStatistics).mount("#public-statistics");
}
