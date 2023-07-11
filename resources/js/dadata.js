/**
 * отправка запроса в дадата при регистрации
 *
 */
const nameInput = document.getElementById("organisation-name");
const taxInput = document.getElementById("tax-number");
let isFetching = false;

["input"].forEach((eventName) => {
    nameInput?.addEventListener(eventName, (e) => {
        if (!e.target.value) {
            return;
        }

        if (e.target.value.length < 3) {
            document.querySelector(".dropdown-container")?.remove();
            return;
        }

        if (isFetching) {
            return;
        }
        checkQuery(e.target.value, "#dropdown-place-name");
    });

    taxInput?.addEventListener(eventName, (e) => {
        if (!e.target.value) {
            return;
        }

        if (e.target.value.length < 3) {
            document.querySelector(".dropdown-container")?.remove();
            return;
        }

        if (isFetching) {
            return;
        }
        checkQuery(e.target.value, "#dropdown-place-tax");
    });
});

function checkQuery(query, selector) {
    isFetching = true;
    var url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
    var token = "83ff13189cdfe8176a112ab02dcde133ca20ea84";

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: query }),
    };

    fetch(url, options)
        .then((response) => response.text())
        .then((result) => {
            isFetching = false;
            showSuggestions(selector, JSON.parse(result));
        })
        .catch((error) => {
            console.log("error", error);
            isFetching = false;
        });
}

function applyOrganisation(e) {
    nameInput.value = e.target.dataset.name;
    taxInput.value = e.target.dataset.taxnumber;
    nameInput.classList.add("active");
    taxInput.classList.add("active");
    document.querySelector(".dropdown-container")?.remove();
}

function showSuggestions(selector, data) {
    const neighbor = document.querySelectorAll(selector);

    if (!neighbor) {
        return;
    }

    if (data.suggestions.length === 0) {
        document.querySelector(".dropdown-container")?.remove();
        return;
    }

    neighbor.forEach((htmlNode) => {
        const mayBeDropdown = htmlNode.nextElementSibling;

        if (mayBeDropdown?.classList.contains("dropdown-container")) {
            mayBeDropdown.remove();
        }
    });

    const dropdownWrapper = document.getElementById("dropdownWrapper");
    const dropdown = dropdownWrapper.content.cloneNode(true);
    const buttonTemplate = document.getElementById("dropdownItem");

    neighbor.forEach((htmlNode) => {
        data.suggestions.forEach((d) => {
            let button = buttonTemplate.content.cloneNode(true);
            button.firstElementChild.querySelector("span").innerText = d.value;
            button.firstElementChild
                .querySelector("span")
                .after(` ИНН: ${d.data.inn}`);
            button.firstElementChild.dataset.name = d.value;
            button.firstElementChild.dataset.taxnumber = d.data.inn;
            button.firstElementChild.addEventListener(
                "click",
                applyOrganisation
            );

            dropdown.firstElementChild.firstElementChild.append(button);
        });
        htmlNode.after(dropdown);
    });
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")?.length) {
        document.querySelectorAll(".dropdown")?.forEach((el) => {
            el.remove();
        });
    }
});
