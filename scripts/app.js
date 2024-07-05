"use strict";

const HABBIT_KEY = "HABBIT_KET";

const page = {
    menu: document.querySelector(".menu__list")
};

let habbits = [];


//data utils -  получаем данные из хранилища, работа с данными 
function getData () {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
};

//Сохраняем данные в хранилище, работа с данными 
function setData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
};


//Отрисовываем меню (навигационное меню)
function rerenderMenu (activeHabbit) {
    if(!activeHabbit) {
        return;
    }
    for(const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if(!existed) {
            const element = document.createElement("button");
            element.setAttribute("menu-habbit-id", habbit.id);
            element.classList.add("menu__item");
            element.innerHTML = `<img src="./image/${habbit.icon}.svg" alt="${habbit.name} logo">`
            element.addEventListener("click", () => rerenderMenu(habbit.id));
            if(activeHabbit.id === habbit.id) {
                element.classList.add("menu__item-active");

            }
            page.menu.appendChild(element);
            continue;
        }
        if(activeHabbit.id === habbit.id) {
            existed.classList.add("menu__item-active");
        } else {
            existed.classList.remove("menu__item-active"); 
        }
    }
}


function rerender(activeHabbitId) {
    const selectetHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    rerenderMenu(selectetHabbit);

}


//init(запуск приложения)
(() => {
    getData();
    rerenderMenu(habbits[0]);
}) ();