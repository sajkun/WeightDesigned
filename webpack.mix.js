const mix = require("laravel-mix");
const path = require("path");
const webpack = require("webpack");
mix.webpackConfig({
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
        }),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js/"),
        },
    },
});
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/app.js", "public/js")
    .vue()
    .version()
    .extract(["vue", "bootstrap"]);

mix.sass("resources/sass/app.scss", "public/css").version();

mix.copyDirectory("resources/js/libs/", "public/js/libs");
