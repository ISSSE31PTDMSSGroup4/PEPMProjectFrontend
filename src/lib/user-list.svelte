<script>
    import { createEventDispatcher } from "svelte";
    import PersonAdd from "svelte-bootstrap-icons/lib/PersonFillAdd.svelte";
    import PersonRemove from "svelte-bootstrap-icons/lib/PersonFillDash.svelte";

    const dispatch = createEventDispatcher();
    export let size = "2em"; // string | number
    export let width = size; // string | number
    export let height = size; // string | number
    export let color = "primary";
    let users = [
        {
            id: 1,
            name: "Allen Panda",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
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
        },
        {
            id: 2,
            name: "CC",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/3.webp",
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
                                avartar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: "Test Test",
                        },
                        {
                            id: 111232,
                            user: {
                                userId: 2,
                                name: "CC",
                                avartar:
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
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/4.webp",
            unread: 0,
            status: "Online",
        },
        {
            id: 4,
            name: "Test Account",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/5.webp",
            unread: 0,
            status: "Offline",
        },
        {
            id: 5,
            name: "QWERT",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/6.webp",
            unread: 0,
            status: "Offline",
        },
    ];
    export let selectedUserId = 1;
    const handleUserSelect = (item) => {
        selectedUserId = item.id;
        item.unread = 0;
        dispatch("selectedUser", item);
    };

    const handleNewUserClick = () => {
        let newUser = {
            id: -999,
            name: "New chat",
            unread: 0,
        };

        if (users.findIndex((e) => e.id === -999) != -1) {
            users = users.filter(x=>x.id > 0);           
            handleUserSelect(users[0]);
            return;
        }

        users = [newUser, ...users];
        handleUserSelect(newUser);
    };
</script>

<div class="row">
    <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand">Chat</span>
        <div class="nav justify-content-end">
            <button
                on:click={handleNewUserClick}
                class="nav-link py-3 border-bottom"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="Chat"
            >
                {#if users.find(obj => obj.id < 0)}
                    <PersonRemove {size} {width} {height} {color} />
                {:else}                
                    <PersonAdd {size} {width} {height} {color} />
                {/if}
            </button>
        </div>
    </nav>
</div>
<div class="row">
    <div class="user-list-block">
        <div class="list-group">
            {#each users as user}
                <button
                    class="list-group-item list-group-item-action {user.id ===
                    selectedUserId
                        ? 'active'
                        : ''} d-flex justify-content-start align-items-center"
                    style="height:4em;"
                    on:click={handleUserSelect(user)}
                >
                    <div class="col-2">
                        <img
                            src={user.avartar
                                ? user.avartar
                                : "./icons8-user-96.png"}
                            class="rounded-circle"
                            style="width: {width}; size:{size}; width:{width};height:{height};"
                            alt="Avatar"
                        />
                    </div>
                    <div class="col-8">
                        {user.name}
                    </div>
                    <div class="col-2">
                        <span class="badge bg-danger rounded-pill">
                            {#if user.unread > 0}
                                {user.unread}
                            {/if}
                        </span>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .navbar {
        padding: 0.5rem 1rem;
    }
    .user-list-block {
        height: 43rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
