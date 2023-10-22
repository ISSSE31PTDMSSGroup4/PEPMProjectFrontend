import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initUser = browser && window.localStorage.user &&  window.localStorage.user !== "undefined" ? JSON.parse(window.localStorage.user) : undefined;
export let user = writable(initUser);
user.subscribe((value) => {
    if (browser) {       
        if (!value) { window.localStorage.removeItem("user"); }
        console.log("Subscribe user", value);
        window.localStorage.user = JSON.stringify(value);
    }
});

const initQuizHistory = browser && window.localStorage.quizHistory && window.localStorage.quizHistory !== "undefined" ? JSON.parse(window.localStorage.quizHistory) : [];
export let quizHistory = writable(initQuizHistory);
quizHistory.subscribe((value) => {
    if (browser) {       
        if (!value) { window.localStorage.removeItem("quizHistory"); }
        console.log("Subscribe quiz history", value);
        window.localStorage.quizHistory = JSON.stringify(value);
    }
});

export let reloadQuiz = writable({});
export let reloadQuizList = writable({});
export let quizzes = writable([]);
export let quizAnswering = writable(false);
export let xUser = writable("");
export let pusher = writable(undefined); 
export let userList = writable([]);
export let selectedUser = writable(undefined);