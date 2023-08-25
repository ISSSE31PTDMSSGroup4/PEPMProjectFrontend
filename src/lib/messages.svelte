<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let newMessage = "";
    let targetUser = {
        userId: 1,
        name: "Allen Panda",
        avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
        status: "Online",
    };
    let messages = [
        {
            id: 1,
            time: "19-08-23 7:32 pm",
            messages: [
                {
                    id: 111312,
                    user: {
                        userId: 0,
                        name: "Me",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                    },
                    message: "Test message from me",
                },
                {
                    id: 111232,
                    user: {
                        userId: 1,
                        name: "Allen Panda",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                    },
                    message: "Good evening",
                },
            ],
        },
        {
            id: 2,
            time: "Monday 12:32 pm",
            messages: [
                {
                    id: 114152,
                    user: {
                        userId: 0,
                        name: "Me",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                    },
                    message: "How is it going?",
                },
                {
                    id: 156654,
                    user: {
                        userId: 1,
                        name: "Allen Panda",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                    },
                    message: "Great!",
                },
            ],
        },
        {
            id: 3,
            time: "Yesterday 15:11 pm",
            messages: [
                {
                    id: 125676,
                    user: {
                        userId: 1,
                        name: "Allen Panda",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                    },
                    message: "See u tmr",
                },
                {
                    id: 215315,
                    user: {
                        userId: 0,
                        name: "Me",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                    },
                    message: "See u",
                },
            ],
        },
        {
            id: 4,
            time: "09:00 pm",
            messages: [
                {
                    id: 125326,
                    user: {
                        userId: 1,
                        name: "Allen Panda",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                    },
                    message: "where are u?",
                },
                {
                    id: 154314,
                    user: {
                        userId: 1,
                        name: "Allen Panda",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                    },
                    message: "I just arrived",
                },
                {
                    id: 765365,
                    user: {
                        userId: 0,
                        name: "Me",
                        avartar:
                            "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                    },
                    message: "On the bus, coming",
                },
            ],
        },
    ];

    onMount(async () => {});

    // Unsubscribe from realtime messages
    onDestroy(() => {});

    function sendMessage() {
        //   const data = {
        //     text: newMessage,
        //     user: $currentUser.id,
        //   };
        //   const createdMessage = await pb.collection('messages').create(data);
        //   newMessage = '';
    }
</script>

<div class="chatbox">
    <div class="modal-dialog-scrollable">
        <div class="modal-content">
            <div class="msg-head">
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <img
                                    class="rounded-circle"
                                    src={targetUser.avartar}
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
                </div>
            </div>

            <div class="modal-body">
                <div class="msg-body">
                    {#each messages as messageGroup (messageGroup.id)}
                        <span class="time">{messageGroup.time}</span>
                        {#each messageGroup.messages as message (message.id)}
                            <ul>
                                <li
                                    class={message.user.userId ===
                                    targetUser.userId
                                        ? "sender"
                                        : "reply"}
                                >
                                    <img
                                        class="rounded-circle"
                                        src={message.user?.avartar}
                                        alt="avatar"
                                        width="50px"
                                    />
                                    <div class="msg-content">
                                        {#if message.user.userId ===
                                            targetUser.userId}
                                            <small>
                                                {message.user?.name}
                                            </small>
                                        {/if}
                                        
                                        <p class="msg-text">
                                            {message.message}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        {/each}
                    {/each}
                </div>
            </div>

            <div class="send-box">
                <form action="">
                    <input
                        type="text"
                        class="form-control"
                        aria-label="message…"
                        placeholder="Write message…"
                    />

                    <button type="button"
                        ><i class="fa fa-paper-plane" aria-hidden="true" /> Send</button
                    >
                </form>
            </div>
        </div>
    </div>
</div>

<style>
ul,
li
{
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

    .chatbox {
        width: auto;
        overflow: hidden;
        height: 100%;
        border-left: 1px solid #ccc;
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
        display:inline-block;
        position: relative;
    }

    .msg-body ul li.sender div.msg-content {
        display:inline-block;
        position: relative;
        margin-left: 5px;
    }

    .msg-body ul li.sender small {
        display:flex;
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
        background: #f5f5f5;
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

    .send-box {
        padding: 15px;
        border-top: 1px solid #ccc;
    }

    .send-box form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    .send-box .form-control {
        display: block;
        width: 85%;
        padding: 0.375rem 0.75rem;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        color: #222;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ccc;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .send-box button {
        border: none;
        background: #3867d6;
        padding: 0.375rem 5px;
        color: #fff;
        border-radius: 0.25rem;
        font-size: 14px;
        font-weight: 400;
        width: 24%;
        margin-left: 1%;
    }

    .send-box button i {
        margin-right: 5px;
    }

    .send-btns .button-wrapper {
        position: relative;
        width: 125px;
        height: auto;
        text-align: left;
        margin: 0 auto;
        display: block;
        background: #f6f7fa;
        border-radius: 3px;
        padding: 5px 15px;
        float: left;
        margin-right: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }

    .send-btns .button-wrapper span.label {
        position: relative;
        z-index: 1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 100%;
        cursor: pointer;
        color: #343945;
        font-weight: 400;
        text-transform: capitalize;
        font-size: 13px;
    }

    button:focus {
        outline: 0;
    }

    @media (max-width: 767px) {
        .chatbox {
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
        .send-box button {
            width: 28%;
        }
        .send-box .form-control {
            width: 70%;
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
