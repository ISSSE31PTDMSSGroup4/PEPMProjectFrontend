<script>  
    import Sendbox from "./sendbox.svelte";   
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { userProfilesUrl } from "../routes/constants";

    const dispatch = createEventDispatcher();

    let newUserEmail = '';
    let liveSearchUsers = [];
    onMount(async () => {
        await fetchAllUserData();
    });

    async function fetchAllUserData() {
        const response = await fetch(userProfilesUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("liveSearchUsers", data);
            liveSearchUsers = data;
            return data;
        } else {
            const text = await response.text();
            throw new Error(text);
        }
    }

    const sendMessage = (e) => {
        if(!newUserEmail){ return; }
        var msg = e.detail;
        var newUser = {
            id: Math.random(100,1000),
            name: newUserEmail,
            avatar: undefined,
            unread: 0,
            status: "Offline",
            messageGroup: [
                {
                    id: Math.random(100,1000),
                    time: "Just now",
                    messages: [
                        {
                            id: Math.random(100,1000),
                            user: {
                                userId: 0,
                                name: "Me",
                                avatar:
                                    "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp",
                            },
                            message: msg,
                        }
                    ],
                },
            ],
        }
        console.log("newChatCreated", newUser);
        dispatch("newChatCreated", newUser);
    }
</script>

<div class="input-group mb-3">
    <span class="input-group-text">To:</span>
    <input
        class="form-control"
        list="datalistOptions"
        placeholder="Type to search..."
        bind:value={newUserEmail}
    />

    <datalist id="datalistOptions">
        {#each liveSearchUsers as user (user._id.$oid)}
            <option value={user.name} />
        {/each}
    </datalist>
</div>

<div class="new-conversation">
    <div style="height: 20rem;" />
    <div class="row">
        <h4>You're starting new conversation</h4>
    </div>
    <div class="row">
        <p>Type your first message below</p>
    </div>
</div>

<Sendbox on:messageSent={sendMessage}/>

<style>
    .new-conversation {
        height: 40rem;
        text-align: center;
        justify-content: center;
    }
</style>