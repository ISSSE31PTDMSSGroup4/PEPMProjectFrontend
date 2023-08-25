<script>
    import PersonAdd from "svelte-bootstrap-icons/lib/PersonAdd.svelte";
    import Messages from '../lib/messages.svelte'
    export let size = "2em"; // string | number
    export let width = size; // string | number
    export let height = size; // string | number
    export let color = "primary";
    export let users = [
        {
            id: 1,
            name: "Allen Panda",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
            unread: 3,
        },
        {
            id: 2,
            name: "CC",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/3.webp",
            unread: 1,
        },
        {
            id: 3,
            name: "SSSr",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/4.webp",
            unread: 0,
        },
        {
            id: 4,
            name: "Test Account",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/5.webp",
            unread: 0,
        },
        {
            id: 5,
            name: "QWERT",
            avartar: "https://mdbcdn.b-cdn.net/img/new/avatars/6.webp",
            unread: 0,
        },
    ];
    export let selectedUserId = 1;
    export function handleUserSelect(item) {
        console.log(item);
		selectedUserId = item.id;
        item.unread = 0;
	}

    export function handleNewUserClick() {
        
        let newUser = {
            id: -999,
            name: "New chat",
            avartar: "",
            unread: 0,
        }
        
        if(users.findIndex((e)=>e.id === -999) != -1){
            return;
        }
		users.concat(newUser);
        users = users;
        handleUserSelect(newUser);
	}
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-3 d-flex flex-column flex-shrink-0 bg-light">
            <div class="row">
                <nav class="navbar navbar-light bg-light">
                    <span class="navbar-brand">Chat</span>
                    <div class="nav justify-content-end">
                        <button on:click={handleNewUserClick} class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Chat">
                            <PersonAdd {size} {width} {height} {color} />
                          </button>
                    </div>
                </nav>
            </div>
            <div class="row">
                <div class="list-group">
                    {#each users as user}
                        <button
                            class="list-group-item list-group-item-action {user.id === selectedUserId ? "active" : ""} d-flex justify-content-start align-items-center"
                            style="height:4em;"
                            on:click={handleUserSelect(user)}
                        >
                            <div class="col-2">
                                <img
                                    src={user.avartar}
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
        <div class="col-9">
            <Messages/>
        </div>
    </div>
</div>

<style>
    .navbar {
        padding: 0.5rem 1rem;
    }
</style>
