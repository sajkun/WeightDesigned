/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import MessagesComponent from "./../components/MessagesComponent/";

const homePage = {
    mixins: [messages],

    componentsa: {
        MessagesComponent,
    },
};

export default homePage;
