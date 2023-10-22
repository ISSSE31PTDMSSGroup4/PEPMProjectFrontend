<script>  
    import Sendbox from "./sendbox.svelte";   
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { userProfilesUrl, addChannelUrl } from "../routes/constants";
    import { user } from "../routes/store";

    const dispatch = createEventDispatcher();

    let newUserName = '';
    let liveSearchUsers = [];
    let selectedUser = undefined;
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
            if(text.includes("Forbidden")){
                user.set(undefined);
                location.replace(routeLogout);
                return;
            }
            throw new Error(text);
        }
    }

    const addNewFriend = async () => {
        console.log("addNewFriend triggered");

        const message_body = JSON.stringify({
            userEmail : $user.email,
            userData: {
                email: $user.email,  
                name: $user.name,
                avatar: $user.avatar,
                unread: 0,
                lastReadTime: 0,
            },
            friendData:{
                    avatar: selectedUser.avatar, 
                    name: selectedUser.name,
                    userId: selectedUser.id,
                    email: selectedUser.email,
                    unread: 0,
                    lastReadTime: 0,
            },
        });

        await fetch(addChannelUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: message_body
        });
    }

    const sendMessage = (e) => {
        if(!newUserName){ return; }
        let newUser = searchUserByName(newUserName);
        if(!newUser){ return; }
        var msg = e.detail;
        console.log("newChatCreated", newUser);
        dispatch("newChatCreated", newUser, msg);
    }

    function searchUserByName(name){
        let targetUser = liveSearchUsers.find((x) => x.name == name);
        return targetUser;
    }
</script>

<div class="input-group mb-3">
    <span class="input-group-text">To:</span>
    <input
        class="form-control"
        list="datalistOptions"
        placeholder="Type to search..."
        bind:value={newUserName}
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