/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import { createApp } from "vue";
import appPublicUsers from "./public/users.js";
import appPublicEmployees from "./public/employees.js";

if (document.getElementById("public-users")) {
    createApp(appPublicUsers).mount("#public-users");
}
if (document.getElementById("public-employees")) {
    createApp(appPublicEmployees).mount("#public-employees");
}
require("./public/ready");
// require("./public/vehicle");
// require("./public/grasslands");
