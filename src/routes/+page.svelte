<script>
    import Messages from "../lib/messages.svelte";
    import UserList from "../lib/user-list.svelte";
    import NewChat from "../lib/new-chat.svelte";
    let selectedUser = {
        id: 1,
        name: "Allen Panda",
        avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
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
            ],
    };
    const handleSelectedUserChanged = (e) => {
        console.log("selectedUser", e.detail);
        selectedUser = e.detail;
    };
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-3 d-flex flex-column flex-shrink-0 bg-light">
            <UserList on:selectedUser={handleSelectedUserChanged} />
        </div>
        <div class="col-9 d-flex flex-column flex-shrink-0 bg-light">
            {#if selectedUser.id < 0}
                <NewChat />
            {:else}
                <Messages targetUser={selectedUser}/>
            {/if}
        </div>
    </div>
</div>
