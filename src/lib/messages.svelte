<script lang="ts">
    import { xUser } from "./../routes/store.js";
    import QuizDetail from "./quiz-detail.svelte";
    import Messages from "./messages.svelte";
    import Sendbox from "./sendbox.svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import {
        draftQuiz,
        newQuiz,
        chatMessageUrl,
        quizMode,
        reviewMode,
        submittedQuiz,
        chatHisotyUrl,
    } from "../routes/constants";
    import {
        user,
        selectedUser,
        quizAnswering,
        quizHistory,
        pusher,
    } from "../routes/store";
    import {
        quizMsgPrefix,
        quizMsgSpliter,
        routeLogout,
    } from "../routes/constants";
    import Spinner from "./spinner.svelte";

    const bindName = "message";
    let fetching = true;
    let mounted = false;
    let newMessage = "";
    let channel;
    let prevChannelName;
    let messages;
    let enterQuizMode = quizMode;
    let targetQuiz = { quiz_id: "" };

    selectedUser.subscribe((value) => {
        if (value && mounted) {
            switchReceiver(value);
        }
    });

    onMount(async () => {
        scrollToBottom();
        switchReceiver($selectedUser);
        mounted = true;
    });

    // Unsubscribe from realtime messages
    onDestroy(() => {
        if (channel) {
            channel.unbind(bindName);
            $pusher.unsubscribe(prevChannelName);
        }
    });

    afterUpdate(() => {
        scrollToBottom();
    });

    const scrollToBottom = () => {
        if ($quizAnswering || !$selectedUser || fetching) {
            return;
        }
        var domWrapper = document.querySelector(".modal-body");
        domWrapper.scrollTo(0, 9999999);
    };

    const sendMessage = async (e) => {
        let content = e.detail;
        console.log("send msg", content);

        await submit(content);
    };

    const sendQuiz = async (e) => {
        let content = e.detail;
        console.log("send quiz", JSON.stringify(content));

        let encodeContent =
            quizMsgPrefix + quizMsgSpliter + JSON.stringify(content);
        await submit(encodeContent);
    };

    const submit = async (msg) => {
        console.log("submit triggered");
        const message_body = JSON.stringify({
            userInfo: {
                userId: $user._id,
                name: $user.name,
                avatar: $user.avatar,
            },
            receiverInfo: {
                userId: $selectedUser._id,
                avatar: $selectedUser.avatar,
                name: $selectedUser.name,
            },
            message: msg,
            userEmail: $xUser,
            receiverEmail: $selectedUser.email,
        });
        await fetch(chatMessageUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "X-USER": $xUser,
            },
            body: message_body,
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

    const switchReceiver = async (newUser) => {
        if (newUser.id === -999) {
            return;
        }

        let newChannelName = getChannelName($xUser, newUser.email);
        if (channel) {
            channel.unbind(bindName);
            $pusher.unsubscribe(prevChannelName);
            // Clear the messages in current window
            messages = [];
        }
        channel = $pusher.subscribe(newChannelName);

        console.log("switchReceiver triggered: ", newChannelName);

        prevChannelName = newChannelName;

        // Fetch chat history when switching receiver
        await fetchHistory();
        channel.bind(bindName, (data) => receiveNewMessage(data));
    };

    const receiveNewMessage = (data) => {
        messages = [...messages, data];
    };

    const handleQuizClick = (message, mode) => {
        let quiz = getQuizObj(message);
        if (!quiz) {
            //alert("Invalid quiz link");
            return;
        }
        targetQuiz.quiz_id = quiz.quiz_id;
        if (targetQuiz.quiz_id === "") {
            return;
        }
        enterQuizMode = mode;
        quizAnswering.set(true);
    };

    function checkQuizMsg(message) {
        if (!message || !message?.startsWith(quizMsgPrefix)) {
            return false;
        }
        let infos = message.split(quizMsgSpliter);
        if (!infos || infos.length < 1) {
            return false;
        }

        return true;
    }

    function getQuizObj(message) {
        if (!message || !message?.startsWith(quizMsgPrefix)) {
            return undefined;
        }
        let infos = message.split(quizMsgSpliter);
        if (!infos || infos.length < 1) {
            return undefined;
        }
        try {
            let obj = JSON.parse(infos[1]);
            return obj;
        } catch {
            return undefined;
        }
    }

    function checkQuizSubmitStatus(message) {
        let quiz = getQuizObj(message);
        if (!quiz) {
            //alert("Invalid quiz link");
            return;
        }
        let historyObj = $quizHistory.find((x) => x.quiz_id == quiz.quiz_id);
        if (!historyObj) {
            return newQuiz;
        } else if (!historyObj.submitted) {
            return draftQuiz;
        }
        return submittedQuiz;
    }

    const fetchHistory = async () => {
        fetching = true;
        let message_body = JSON.stringify({
            senderEmail: $xUser,
            receiverEmail: $selectedUser.email,
        });

        console.log("gethistory req body", message_body);
        const response = await fetch(chatHisotyUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"X-USER": $xUser,
            },
            body: message_body,
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                messages = data;
            }
            console.log("messages", messages);
            fetching = false;
        } else {
            const text = await response.text();
            if (text.includes("Forbidden")) {
                user.set(undefined);
                location.replace(routeLogout);
            }
            throw new Error(text);
            fetching = false;
        }
    };

    function getAvatar(message) {
        if (message.userEmail === $xUser) {
            return $user.avatar;
        }
        return message.userInfo.avatar;
    }

    function formatUnixTime(unixTime) {
        console.log("unix", unixTime);
        const milliseconds = unixTime;

        const date = new Date(milliseconds);

        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours() % 12 || 12);
        const minute = String(date.getMinutes()).padStart(2, "0");
        const ampm = date.getHours() >= 12 ? "pm" : "am";

        const formattedTime = `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;

        return formattedTime;
    }
</script>

<div class="msg-head">
    <div class="d-flex align-items-center">
        {#if $selectedUser}
            <div class="flex-shrink-0">
                <img
                    class="rounded-circle"
                    src={$selectedUser.avatar
                        ? $selectedUser.avatar
                        : "./icons8-user-96.png"}
                    alt="avatar"
                    width="60px"
                />
            </div>
            <div class="flex-grow-1 ms-3">
                <h3>{$selectedUser.name}</h3>
                <!-- <p>{$selectedUser.status}</p> -->
            </div>
        {:else}
            <div style="height: 1rem;" />
        {/if}
    </div>
</div>

{#if $quizAnswering}
    <QuizDetail {targetQuiz} quizDetailMode={enterQuizMode} />
{:else if fetching}
    <Spinner />
{:else if $selectedUser}
    <div class="modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-body">
                <div class="msg-body">
                    {#if messages && messages.length > 0}
                        {#each messages as message}
                            <span class="time"
                                >{formatUnixTime(message.timestamp)}</span
                            >
                            <ul>
                                <li
                                    class={message.userEmail !== $xUser
                                        ? "sender"
                                        : "reply"}
                                >
                                    <img
                                        class="rounded-circle"
                                        src={getAvatar(message)
                                            ? getAvatar(message)
                                            : "./icons8-user-96.png"}
                                        alt="avatar"
                                        width="50px"
                                    />
                                    <div class="msg-content">
                                        {#if message.userEmail !== $xUser}
                                            <small>
                                                {message.user?.name}
                                            </small>
                                        {/if}
                                        {#if checkQuizMsg(message.message)}
                                            <div class="card text-center">
                                                <div class="card-header">
                                                    {#if message.userEmail === $xUser}
                                                        You've shared below quiz
                                                    {:else if checkQuizSubmitStatus(message.message) == submittedQuiz}
                                                        You've finished quiz
                                                    {:else if checkQuizSubmitStatus(message.message) == draftQuiz}
                                                        Click to continue the
                                                        quiz
                                                    {:else}
                                                        {message.userInfo?.name}
                                                        invite you join the quiz
                                                    {/if}
                                                </div>
                                                <div class="card-body">
                                                    {getQuizObj(message.message)
                                                        ?.title}
                                                </div>
                                                {#if message.userEmail !== $xUser}
                                                    <div
                                                        class="card-footer text-body-secondary"
                                                        style="align-content: center;"
                                                    >
                                                        {#if checkQuizSubmitStatus(message.message) == submittedQuiz}
                                                            <button
                                                                class="btn btn-outline-primary"
                                                                on:click={() =>
                                                                    handleQuizClick(
                                                                        message.message,
                                                                        reviewMode
                                                                    )}
                                                                >Review Result</button
                                                            >
                                                        {:else if checkQuizSubmitStatus(message.message) == draftQuiz}
                                                            <button
                                                                class="btn btn-outline-success"
                                                                on:click={() =>
                                                                    handleQuizClick(
                                                                        message.message,
                                                                        quizMode
                                                                    )}
                                                                >Continue</button
                                                            >
                                                        {:else}
                                                            <button
                                                                class="btn btn-outline-info"
                                                                on:click={() =>
                                                                    handleQuizClick(
                                                                        message.message,
                                                                        quizMode
                                                                    )}
                                                                >Start Quiz</button
                                                            >
                                                        {/if}
                                                    </div>
                                                {/if}
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
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <Sendbox on:messageSent={sendMessage} on:selectedQuiz={sendQuiz} />
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
