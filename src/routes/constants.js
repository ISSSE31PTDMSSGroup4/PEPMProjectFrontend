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
export const userProfileUrl = userServiceBaseUrl + "/user/profile";
export const updateUserProfileUrl = userServiceBaseUrl + "/user/profile/update";
export const userProfilesUrl = userServiceBaseUrl + "/user/profiles";
export const uploadAvatar = userServiceBaseUrl + "/user/profile/avatar/upload";
//quiz microservice
export const getUserQuizListUrl = quizServiceBaseUrl + "/quiz/list";
export const getQuizDetailUrl = quizServiceBaseUrl + "/quiz/detail";
export const quizUrl = quizServiceBaseUrl + "/quiz";
export const questionUrl = quizServiceBaseUrl + "/quiz/question";
//chat microservice
export const pusherCfgUrl = chatServiceBaseUrl + "/chat/config/";
export const chatMessageUrl = chatServiceBaseUrl + "/chat/message/";
export const chatHisotyUrl = chatServiceBaseUrl + "/chat/history/";
export const chatChannelUrl = chatServiceBaseUrl + "/chat/friendlist/";
export const addChannelUrl = chatServiceBaseUrl + "/chat/addfriend/";

//route
export const routeRoot = base + "/";
export const routeQuiz = base +"/quiz";
export const routeProfile = base +"/profile";
export const routeAbout = base +"/about";
//login microservice
export const routeLogin = loginServiceBaseUrl + "/auth/initiate_auth";
export const routeLogout = loginServiceBaseUrl + "/auth/logout";

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