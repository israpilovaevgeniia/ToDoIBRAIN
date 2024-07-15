"use strict";

const HABBIT_KEY = "HABBIT_KET";
let globalActiveHabbitId; 


const page = {
    menu: document.querySelector(".menu__list"),
    header: {
        h1: document.querySelector(".content__title"),
        progressPercent: document.querySelector(".progress-percent"),
        scroll: document.querySelector(".scroll-active"),
    },
    content: {
        habbitDay: document.querySelector("#days"),
        nextDay: document.querySelector(".habbit__day")
    }
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
            element.addEventListener("click", () => rerender(habbit.id));
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

function renderHeader (activeHabbit) {
    if(!activeHabbit) return;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 ? 100 : (activeHabbit.days.length / activeHabbit.target) * 100;
    page.header.h1.innerText = activeHabbit.name;
    page.header.progressPercent.innerText = `${progress}%`;
    page.header.scroll.style.width = `${progress}%`; 
}

function renderContent (activeHabbit) {
    if(!activeHabbit) return;

    page.content.habbitDay.innerHTML = "";
    activeHabbit.days.forEach((day, idx) => {
        const element = document.createElement("div");
        element.classList.add("habbit");
        element.innerHTML = `
            <div class="habbit__day">День ${idx + 1}</div>
            <div class="habbit__comment">${day.comment }</div>
            <button class="form__delete">
            <img src="./image/delete.svg" alt="delete">
            </button>
            `;
        page.content.habbitDay.appendChild(element);
        page.content.nextDay.innerHTML = `День ${activeHabbit?.days?.length + 1}`;
    });
    if(!activeHabbit.days.length) {
        page.content.nextDay.innerHTML = `День ${activeHabbit?.days?.length + 1}`;
    }
}

function createDay (event) {
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form);
    const comment = data.get("comment");
    //Валидация 
    if(!comment) {
        form["comment"].classList.add("error");
    }else {
        form["comment"].classList.remove("error");
    }

    //creade day
    habbits = habbits.map((habbit) => {
         if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: [...habbit.days, { comment: comment}],
            }
         } else {
            return habbit;
         }
    });
    form["comment"].value = "";
    setData();
    rerender(globalActiveHabbitId);
}

function removeDay (activeHabbit) {
    if (!activeHabbit) return;

    document.querySelectorAll(".form__delete").forEach((deleteButton, buttonIndex) => {
        deleteButton.addEventListener("click", () => {
            const dayIndexToRemove = buttonIndex;
            const updatedDays = activeHabbit.days.reduce ((acc, day, dayIndex) => {
                if(dayIndex !== dayIndexToRemove) {
                    acc.push(day);
                    return acc;
                }
                return acc;
            }, []); 
            activeHabbit.days = updatedDays;
            setData();
            rerender(activeHabbit.id);   
        })
    })
}


function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const selectetHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    rerenderMenu(selectetHabbit);
    renderHeader(selectetHabbit);
    renderContent(selectetHabbit);
    removeDay(selectetHabbit);
}


//init(запуск приложения)
(() => {
    getData();
    rerender(habbits[0].id);
}) ();