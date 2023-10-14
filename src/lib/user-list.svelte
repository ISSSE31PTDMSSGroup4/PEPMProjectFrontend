<script>
    import { createEventDispatcher } from "svelte";
    import PersonAdd from "svelte-bootstrap-icons/lib/PersonFillAdd.svelte";
    import PersonRemove from "svelte-bootstrap-icons/lib/PersonFillDash.svelte";
    import { quizAnswering } from "../routes/store";
    const dispatch = createEventDispatcher();
    export let size = "2em"; // string | number
    export let width = size; // string | number
    export let height = size; // string | number
    export let color = "primary";
    export let users = undefined;
    export let selectedUserId = 1;
    export const handleUserSelect = (item) => {
        selectedUserId = item.id;
        item.unread = 0;
        dispatch("selectedUser", item);
        quizAnswering.set(false);
    };

    export const handleNewUserClick = () => {
        let newUser = {
            id: -999,
            name: "New chat",
            unread: 0,
        };

        if (users.findIndex((e) => e.id === -999) != -1) {
            users = users.filter((x) => x.id > 0);
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
                {#if users.find((obj) => obj.id < 0)}
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
                            src={user.avatar
                                ? user.avatar
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
