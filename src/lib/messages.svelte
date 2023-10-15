<script lang="ts">
	import QuizDetail from './quiz-detail.svelte';
    import Messages from "./messages.svelte";
    import Sendbox from "./sendbox.svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { pusherMessageUrl, viewMode, } from "../routes/constants";
    import { user ,quizAnswering} from "../routes/store";
    import { quizMsgPrefix, quizMsgSuffix } from "../routes/constants";

    let newMessage = "";
    let pusher;
    let channel;
    let messages;
    let targetQuiz = { id: -1}

    export let targetUser = {
        id: 1,
        name: "Allen Panda",
        avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
        status: "Online",
        messageGroup: [],
    };

    onMount(async () => {

        scrollToBottom();
    });

    // Unsubscribe from realtime messages
    onDestroy(() => {});

    afterUpdate(() => {
        scrollToBottom();
    });

    const scrollToBottom = () => {
        var domWrapper = document.querySelector(".modal-body");
        domWrapper.scrollTo(0, 9999999);
        console.log(domWrapper.scrollTop);
    };

    const sendMessage = async (e) => {
        let content = e.detail;
        console.log("send msg", content);
        await submit(content);
        if (targetUser.messageGroup && targetUser.messageGroup.length > 0) {
            var lastMsgGroupItem =
                targetUser.messageGroup[targetUser.messageGroup.length - 1];
            if (lastMsgGroupItem.messages.length > 0) {
                var newMsg = {
                    id: Math.random(),
                    user: {
                        userId: 0,
                        name: "Me",
                        avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                    },
                    message: content,
                };
                targetUser.messageGroup[
                    targetUser.messageGroup.length - 1
                ].messages = [
                    ...targetUser.messageGroup[
                        targetUser.messageGroup.length - 1
                    ].messages,
                    newMsg,
                ];
            } else {
                var newMsgGroupItem = {
                    id: Math.random(),
                    time: "Just now",
                    messages: [
                        {
                            id: Math.random(),
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: content,
                        },
                    ],
                };

                targetUser.messageGroup = [
                    ...targetUser.messageGroup,
                    newMsgGroupItem,
                ];
            }
        } else {
            var newMsgGroup = [
                {
                    id: Math.random(),
                    time: "Just now",
                    messages: [
                        {
                            id: Math.random(),
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: content,
                        },
                    ],
                },
            ];
            targetUser.messageGroup = newMsgGroup;
        }
    };

    const submit = async (msg) => {
        console.log("submit triggered");

        let date = new Date();
        let localTime = date.toLocaleString("en-US", {
            timeZone: "Asia/Singapore",
        });

        await fetch(pusherMessageUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: $user.name,
                receiver: targetUser.name,
                message: msg,
                time: localTime,
            }),
        });
    };

    function getChannelName(username, receiver) {
        // Sort the usernames
        const sortedUsernames = [username, receiver].sort();

        // Join with a delimiter
        const channelName = sortedUsernames[0] + "-" + sortedUsernames[1];

        console.log(channelName);

        return channelName;
    }

    const switchReceiver = () => {
        console.log("receiver: " + targetUser.name);
        channel = pusher.subscribe(getChannelName($user.name, targetUser.name));
        messages = [];
        channel.bind("message", (data) => {
            messages = [...messages, data];
        });
        // messages = new_messages
    };

    const handleQuizClick = (message) =>{
        
        targetQuiz.id = 1;
        if(targetQuiz.id <= 0){ return; }
        quizAnswering.set(true);
    }

    function checkQuizMsg(message)
    {
        return message?.startsWith(quizMsgPrefix) && message?.endsWith(quizMsgSuffix)
    }

    function getQuizMsg(message)
    {
        let quizTitle = message?.replace(quizMsgPrefix, "").replace(quizMsgSuffix, "");
        return quizTitle
    }
</script>

<div class="msg-head">
    <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
            <img
                class="rounded-circle"
                src={targetUser.avatar
                    ? targetUser.avatar
                    : "./icons8-user-96.png"}
                alt="avatar"
                width="60px"
            />
        </div>
        <div class="flex-grow-1 ms-3">
            <h3>{targetUser.name}</h3>
            <p>{targetUser.status}</p>
        </div>
    </div>
</div>

{#if $quizAnswering}
    <QuizDetail
        {targetQuiz}
    />
{:else}  
<div class="modal-dialog-scrollable">
    <div class="modal-content">
        <div class="modal-body">
            <div class="msg-body">
                {#if targetUser && targetUser.messageGroup}
                    {#each targetUser.messageGroup as messageGroup (messageGroup.id)}
                        <span class="time">{messageGroup.time}</span>
                        {#each messageGroup.messages as message (message.id)}
                            <ul>
                                <li
                                    class={message.user.userId === targetUser.id
                                        ? "sender"
                                        : "reply"}
                                >
                                    <img
                                        class="rounded-circle"
                                        src={message.user.avatar
                                            ? message.user.avatar
                                            : "./icons8-user-96.png"}
                                        alt="avatar"
                                        width="50px"
                                    />
                                    <div class="msg-content">
                                        {#if message.user.userId === targetUser.id}
                                            <small>
                                                {message.user?.name}
                                            </small>
                                        {/if}
                                        {#if checkQuizMsg(message.message)}
                                            <div class="card text-center" >
                                                <div class="card-header">                                                    
                                                    {message.user?.name} invite you join the quiz
                                                  </div>
                                                  <div class="card-body">
                                                    {getQuizMsg(message.message)}
                                                  </div>
                                                <div
                                                    class="card-footer text-body-secondary"
                                                    style="align-content: center;"
                                                >
                                                    <button class="btn btn-info" on:click={()=>handleQuizClick(message.message)}
                                                        >Start Quiz</button
                                                    >
                                                </div>
                                            </div>
                                        {:else}
                                            <p class="msg-text">
                                                {message.message}
                                            </p>
                                        {/if}
                                    </div>
                                </li>
                            </ul>
                        {/each}
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>
<Sendbox on:messageSent={sendMessage} />
{/if}

<style>
    ul,
    li {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    small {
        color: #a9a9a9;
        text-align: left;
        font-size: 1px;
    }

    h3 {
        font-size: 26px;
    }

    p {
        font-size: 15px;
    }

    * {
        margin-bottom: 0;
    }

    .modal-dialog-scrollable {
        width: auto;
        overflow-y: auto;
        height: 38rem;
        /* border-left: 1px solid #ccc; */
    }

    .msg-head h3 {
        color: #222;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 0;
    }

    .msg-head p {
        color: #343434;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        text-transform: capitalize;
        margin-bottom: 0;
    }

    .msg-head {
        padding: 15px;
        border-bottom: 1px solid #ccc;
    }

    .msg-body ul {
        overflow: hidden;
    }

    .msg-body ul li {
        list-style: none;
        margin: 15px 0;
    }

    .msg-body ul li.sender {
        display: block;
        width: 100%;
        position: relative;
    }

    .msg-body ul li.sender img {
        display: inline-block;
        position: relative;
    }

    .msg-body ul li.sender div.msg-content {
        display: inline-block;
        position: relative;
        margin-left: 5px;
    }

    .msg-body ul li.sender small {
        display: flex;
        width: 100%;
        position: relative;
    }

    .msg-body ul li.sender:before {
        display: block;
        clear: both;
        content: "";
        position: absolute;
        /* top: -6px;
        left: -7px;
        width: 0;
        height: 0; */
        /* border-style: solid;
        border-width: 0 12px 15px 12px;
        border-color: transparent transparent #f5f5f5 transparent;
        -webkit-transform: rotate(-37deg);
        -ms-transform: rotate(-37deg);
        transform: rotate(-37deg); */
    }

    .msg-body ul li.sender p {
        color: #000;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 400;
        padding: 15px;
        background: #e8e4e4;
        display: inline-block;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-bottom: 0;
    }

    .msg-body ul li.reply {
        display: block;
        width: 100%;
        text-align: right;
        position: relative;
        float: right;
    }

    .msg-body ul li.reply img {
        float: right;
        position: relative;
    }
    .msg-body ul li.reply div.msg-content {
        display: inline-flex;
        float: right;
        position: relative;
        margin-right: 5px;
    }

    .msg-body ul li.reply small {
        display: inline-block;
    }

    .msg-body ul li.reply:before {
        float: right;
        display: block;
        clear: both;
        content: "";
        position: absolute;
        /* bottom: 15px;
        right: -7px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 12px 15px 12px; */
        /* border-color: transparent transparent #4b7bec transparent; */
        /* -webkit-transform: rotate(37deg);
        -ms-transform: rotate(37deg);
        transform: rotate(37deg); */
    }

    .msg-body ul li.reply p {
        color: #fff;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 400;
        padding: 15px;
        background: #4b7bec;
        display: inline-block;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        margin-bottom: 0;
    }

    .msg-body ul li.reply:after {
        display: block;
        content: "";
        clear: both;
    }

    .time {
        display: block;
        width: 30%;
        margin: auto;
        text-align: center;
        color: #000;
        background-color: transparent;
        font-size: 12px;
        line-height: 1.5;
        font-weight: 400;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        padding: 4px;
    }

    @media (max-width: 767px) {
        .modal-dialog-scrollable {
            width: 100%;
            position: absolute;
            left: 1000px;
            right: 0;
            background: #fff;
            transition: all 0.5s ease;
            border-left: none;
        }
        .msg-head h3 {
            font-size: 14px;
        }
        .msg-head p {
            font-size: 12px;
        }
        .msg-head .flex-shrink-0 img {
            height: 30px;
        }

        .msg-body ul li.sender p {
            font-size: 13px;
            padding: 8px;
            border-bottom-left-radius: 6px;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
        }
        .msg-body ul li.reply p {
            font-size: 13px;
            padding: 8px;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            border-bottom-left-radius: 6px;
        }
    }
</style>
