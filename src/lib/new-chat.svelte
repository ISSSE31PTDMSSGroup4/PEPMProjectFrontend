<script>  
    import Sendbox from "./sendbox.svelte";   
    import { createEventDispatcher } from "svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { userProfilesUrl, addChannelUrl, chatMessageUrl, quizMsgPrefix, quizMsgSpliter, routeLogout } from "../routes/constants";
    import { user, xUser,userList } from "../routes/store";

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
                id: $user._id,
                email: $user.email,  
                name: $user.name,
                avatar: $user.avatar,
                unread: 0,
                lastReadTime: 0,
            },
            friendData:{
                    avatar: selectedUser.avatar, 
                    name: selectedUser.name,
                    userId: selectedUser._id,
                    email: selectedUser.email,
                    unread: 0,
                    lastReadTime: 0,
            },
        });

        await fetch(addChannelUrl, {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json', 
                //'X-USER': $xUser
            },
            body: message_body
        });
    }

    const pushMessage = async (msg) => {
        const message_body = JSON.stringify({
            userInfo: {
                userId: $user._id,
                name: $user.name,
                avatar: $user.avatar,
            },
            receiverInfo: {
                userId: selectedUser._id,
                avatar: selectedUser.avatar,
                name: selectedUser.name,
            },
            message: msg,
            userEmail: $xUser,
            receiverEmail: selectedUser.email,
        });
        await fetch(chatMessageUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"X-USER": $xUser,
            },
            body: message_body,
        });
    };

    const sendQuiz = async (e) => {
        if(!newUserName){ alert("Please input user name"); return; }
        let newUser = searchUserByName(newUserName);
        if(!newUser){ alert("Invalid user"); return; }   

        let content = e.detail;
        console.log("send quiz", JSON.stringify(content));
    
        let encodeContent =
            quizMsgPrefix + quizMsgSpliter + JSON.stringify(content);
        await submit(newUser, encodeContent);
    };

    const sendMessage = async (e) => {
        if(!newUserName){ alert("Please input user name"); return; }
        let newUser = searchUserByName(newUserName);
        if(!newUser){ alert("Invalid user"); return; }       
        let msg = e.detail;
        await submit(newUser, msg);
    }

    async function submit(newUser, msg){
        selectedUser = newUser;    
        if(!isChannelExist(newUser)){
            await addNewFriend();
        }            
        await pushMessage(msg);
        console.log("newChatCreated", selectedUser);
        dispatch("newChatCreated", selectedUser);
    }

    function searchUserByName(name){
        let targetUser = liveSearchUsers.find((x) => x.name == name);
        return targetUser;
    }

    function isChannelExist(user){
        let targetUser = $userList.find((x) => x.email == user.email);
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
        {#each liveSearchUsers as user}
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

<Sendbox on:messageSent={sendMessage} on:selectedQuiz={sendQuiz}/>

<style>
    .new-conversation {
        height: 40rem;
        text-align: center;
        justify-content: center;
    }
</style>