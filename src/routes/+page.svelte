<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Messages from "../lib/messages.svelte";
    import UserList from "../lib/user-list.svelte";
    import NewChat from "../lib/new-chat.svelte";
    import { quizMsgPrefix, quizMsgSpliter, chatChannelUrl } from "./constants";
    import { userList, user, xUser, selectedUser, pusher } from "./store";

    let userListChannel;
    let userListChild;
    let bindName = 'newfriend';

    let newUser = undefined;
    onMount(async () => {
        await fetchChannelList();
        subscribeUserList();
    });

    onDestroy(async () => {
        unsubscribeUserList();
    });

    const subscribeUserList = ()=>{
        userListChannel = $pusher.subscribe($xUser);
        userListChannel.bind(bindName, data => receiveNewChat(data));
    }

    const unsubscribeUserList = ()=>{
        if(!userListChannel){return;}
        userListChannel.unbind(bindName);
        $pusher.unsubscribe($xUser); 
    }

    const receiveNewChat = async(data) => {
        console.log("receiveNewChat triggered");
        console.log(data);
        $userList = [...$userList, data];
    }

    async function fetchChannelList(){
        const response = await fetch(chatChannelUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "X-USER": $xUser 
            },
            body: JSON.stringify({
                $xUser,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data) {
                $userList = data;
            }
            console.log("userList", $userList);
        } else {
            const text = await response.text();
            if (text.includes("Forbidden")) {
                user.set(undefined);
                location.replace(routeLogout);
            }
            throw new Error(text);
        }
    };

    const handleSelectedUserChanged = (e) => {
        console.log("selectedUser", e.detail);
        $selectedUser = e.detail;
    };

    const handleNewChatCreated = (e) => {
        handleSelectedUserChanged(e);
    };
</script>

<div class="container-fluid">
    <div class="row">
        <div
            class="col-lg-3 col-sm-5 d-flex flex-column flex-shrink-0 bg-light"
        >
            <UserList
                bind:this={userListChild}
                on:selectedUser={handleSelectedUserChanged}
            />
        </div>
        <div
            class="col-lg-9 col-sm-7 d-flex flex-column flex-shrink-0 bg-light"
        >
            {#if !$selectedUser || $selectedUser.id === -999}
                <NewChat on:newChatCreated={handleNewChatCreated} />
            {:else}
                <Messages />
            {/if}
        </div>
    </div>
</div>
