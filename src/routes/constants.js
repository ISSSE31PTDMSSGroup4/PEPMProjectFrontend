import { base } from "$app/paths";
//Team Postman Mock Server
//export const baseApiUrl = "https://3a2e6f26-d322-46fe-a0b5-2dd5a314213d.mock.pstmn.io"; 
//Personal Postman Mock Server
//export const baseApiUrl = "https://88847fa7-9974-44f1-b303-5e68a533bd65.mock.pstmn.io";
//Domain Server
export const baseApiUrl = "https://issse31ptdmss.xyz/api";

export const userProfileUrl = "/user/profile";
export const getUserQuizListUrl = "/quiz/list";
export const getQuizDetailUrl = "/quiz/detail";
export const quizUrl = "/quiz";
export const questionUrl = "/quiz/question";

export const routeRoot = base + "/";
export const routeQuiz = base + "/quiz";
export const routeProfile = base + "/profile";
export const routeAbout = base + "/about";
export const routeLogin = baseApiUrl + "/auth/initiate_auth/";
export const routeLogout = baseApiUrl + "/auth/logout";

export const viewMode = 1;
export const editMode = 2;