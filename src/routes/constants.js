import { base } from "$app/paths";
//Team Postman Mock Server
//const baseApiUrl = "https://3a2e6f26-d322-46fe-a0b5-2dd5a314213d.mock.pstmn.io"; 
//Personal Postman Mock Server
//const baseApiUrl = "https://88847fa7-9974-44f1-b303-5e68a533bd65.mock.pstmn.io";
//Domain Server
const baseApiUrl = "https://issse31ptdmss.xyz/api";
const chatServiceBaseUrl = "http://localhost:5005/api";
const loginServiceBaseUrl = "http://localhost:5000";
const userServiceBaseUrl = "http://localhost:8001/api";
//const quizServiceBaseUrl = "https://88847fa7-9974-44f1-b303-5e68a533bd65.mock.pstmn.io";
const quizServiceBaseUrl = "http://localhost:5050/api";
//user profile microservice
export const userProfileUrl = baseApiUrl + "/user/profile";
export const updateUserProfileUrl = baseApiUrl + "/user/profile/update";
export const userProfilesUrl = baseApiUrl + "/user/profiles";
export const uploadAvatar = baseApiUrl + "/user/profile/avatar/upload";
//quiz microservice
export const getUserQuizListUrl = baseApiUrl + "/quiz/list";
export const getQuizDetailUrl = baseApiUrl + "/quiz/detail";
export const quizUrl = baseApiUrl + "/quiz";
export const questionUrl = baseApiUrl + "/quiz/question";
//chat microservice
export const pusherCfgUrl = baseApiUrl + "/chat/config/";
export const chatMessageUrl = baseApiUrl + "/chat/message/";
export const chatHisotyUrl = baseApiUrl + "/chat/history/";
export const chatChannelUrl = baseApiUrl + "/chat/friendlist/";
export const addChannelUrl = baseApiUrl + "/chat/addfriend/";

//route
export const routeRoot = base + "/";
export const routeQuiz = base +"/quiz";
export const routeProfile = base +"/profile";
export const routeAbout = base +"/about";
//login microservice
export const routeLogin = baseApiUrl + "/auth/initiate_auth";
export const routeLogout = baseApiUrl + "/auth/logout";

//Other constants
export const viewMode = 1;
export const editMode = 2;
export const quizMode = 3;
export const reviewMode = 4;

export const newQuiz = 0;
export const draftQuiz = 1;
export const submittedQuiz = 2;

export const quizMsgPrefix = "##@@$$";
export const quizMsgSpliter = "**&&^^";