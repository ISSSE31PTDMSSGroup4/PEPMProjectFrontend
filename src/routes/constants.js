import { base } from "$app/paths";
//Team Postman Mock Server
//const baseApiUrl = "https://3a2e6f26-d322-46fe-a0b5-2dd5a314213d.mock.pstmn.io"; 
//Personal Postman Mock Server
//const baseApiUrl = "https://88847fa7-9974-44f1-b303-5e68a533bd65.mock.pstmn.io";
//Domain Server
const baseApiUrl = "https://issse31ptdmss.xyz/api";
const chatServiceBaseUrl = "http://localhost:8000/api";
const loginServiceBaseUrl = "http://localhost:5000";
const userServiceBaseUrl = "http://localhost:8001";

export const userProfileUrl = userServiceBaseUrl + "/user/profile";
export const userProfilesUrl = userServiceBaseUrl + "/user/profiles";

export const getUserQuizListUrl = baseApiUrl + "/quiz/list";
export const getQuizDetailUrl = baseApiUrl + "/quiz/detail";
export const quizUrl = baseApiUrl + "/quiz";
export const questionUrl = baseApiUrl + "/quiz/question";

export const pusherCfgUrl = chatServiceBaseUrl + "/pusher_config";
export const pusherMessageUrl = chatServiceBaseUrl + "/message";

export const routeRoot = base + "/";
export const routeQuiz = base +"/quiz";
export const routeProfile = base +"/profile";
export const routeAbout = base +"/about";
export const routeLogin = baseApiUrl + "/auth/initiate_auth";
export const routeLogout = baseApiUrl + "/auth/logout";

export const viewMode = 1;
export const editMode = 2;