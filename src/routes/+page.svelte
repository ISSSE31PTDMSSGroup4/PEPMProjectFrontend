<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Messages from "../lib/messages.svelte";
    import UserList from "../lib/user-list.svelte";
    import NewChat from "../lib/new-chat.svelte";
    import { quizMsgPrefix, quizMsgSpliter } from "./constants";

    let userListChild;

    let userList = [
        {
            id: 1,
            name: "Allen Panda",
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
            unread: 0,
            status: "Online",
            messageGroup: [
                {
                    id: 1,
                    time: "19-08-23 7:32 pm",
                    messages: [
                        {
                            id: 111312,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "Test message from me",
                        },
                        {
                            id: 111232,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "How is it going?",
                        },
                        {
                            id: 156654,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: "See u tmr",
                        },
                        {
                            id: 215315,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: "where are u?",
                        },
                        {
                            id: 154314,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: quizMsgPrefix+quizMsgSpliter+'{"quiz_id": 1, "title":"Quiz - Test Title"}',
                        },
                        {
                            id: 765365,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "On the bus, coming",
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            name: "CC",
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/3.webp",
            unread: 1,
            status: "Online",
            messageGroup: [
                {
                    id: 1,
                    time: "Just now",
                    messages: [
                        {
                            id: 111312,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "Test Test",
                        },
                        {
                            id: 111232,
                            user: {
                                userId: 2,
                                name: "CC",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/3.webp",
                            },
                            message: "Test message from user CC",
                        },
                    ],
                },
            ],
        },
        {
            id: 3,
            name: "SSSr",
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/4.webp",
            unread: 0,
            status: "Online",
        },
        {
            id: 4,
            name: "Test Account",
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/5.webp",
            unread: 0,
            status: "Offline",
        },
        {
            id: 5,
            name: "QWERT",
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/6.webp",
            unread: 0,
            status: "Offline",
        },
    ];

    let selectedUser = {
        id: 1,
        name: "Allen Panda",
        avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
        status: "Online",
        messageGroup: [
                {
                    id: 1,
                    time: "19-08-23 7:32 pm",
                    messages: [
                        {
                            id: 111312,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "Test message from me",
                        },
                        {
                            id: 111232,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "How is it going?",
                        },
                        {
                            id: 156654,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: "See u tmr",
                        },
                        {
                            id: 215315,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
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
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: "where are u?",
                        },
                        {
                            id: 154314,
                            user: {
                                userId: 1,
                                name: "Allen Panda",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                            },
                            message: quizMsgPrefix+quizMsgSpliter+'{"quiz_id": 1, "title":"Quiz - Test Title"}',
                        },
                        {
                            id: 765365,
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "On the bus, coming",
                        },
                    ],
                },
            ],
    };
    let newUser = undefined;
    //let promise = fetchData();
    onMount(async () => {
        //await fetchData();
    });

    async function fetchData() {
        const response = await fetch(url);
        // if (response.ok) {
        //     const data = await response.json();
        //     console.log("userProfileData", data);
        //     profileData = data;
        //     return data;
        // } else {
        //     const text = await response.text();
        // if (text.includes("403")) {
        //         user.set(undefined);
        //         location.replace(routeLogout);
        //     }
        //     throw new Error(text);
        // }
    }

    const handleSelectedUserChanged = (e) => {
        console.log("selectedUser", e.detail);
        selectedUser = e.detail;
    };

    const handleNewChatCreated = (e) => {
        newUser = e.detail;
        userList = userList.filter(x=>x.id > 0); 
        userList = [newUser, ...userList];
        userListChild.handleUserSelect(userList[0]);
    };
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-3 col-sm-5 d-flex flex-column flex-shrink-0 bg-light">
            <UserList bind:this={userListChild} users={userList} on:selectedUser={handleSelectedUserChanged} />
        </div>
        <div class="col-lg-9 col-sm-7 d-flex flex-column flex-shrink-0 bg-light">
            {#if selectedUser.id < 0}
                <NewChat on:newChatCreated={handleNewChatCreated}/>
            {:else}
                <Messages targetUser={selectedUser}/>
            {/if}
        </div>
    </div>
</div>
