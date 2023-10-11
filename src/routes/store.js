import { writable } from 'svelte/store';
import { browser } from '$app/environment';
const initUser = browser && window.localStorage.user &&  window.localStorage.user !== "undefined" ? JSON.parse(window.localStorage.user) : undefined;
export let user = writable(initUser);
// export let user = writable({
//     id: 0,
//     name: "Mock account",
//     avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
//     email: "mockaccount@gmail.com",
//     about: "This is the test profile content \n This is second line content \n This is third line content"
// });

user.subscribe((value) => {
    if (browser) {       
        if (!value) { window.localStorage.removeItem("user"); }
        console.log("Subscribe user", value);
        window.localStorage.user = JSON.stringify(value);
    }
});

export let reloadQuiz = writable({});