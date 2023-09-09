<script>  
    import Sendbox from "./sendbox.svelte";   
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let newUserEmail = '';
    let liveSearchUsers = [
        { id: 7, email: "te@wohkajok.nu" },
        { id: 10, email: "bedsehab@ponmad.gs" },
        { id: 6, email: "tavel@azumu.ws" },
        { id: 64, email: "cigjofhug@we.mx" },
        { id: 13, email: "pizhihgeg@cofigule.er" },
        { id: 68, email: "bipuc@siufo.ly" },
        { id: 58, email: "curzub@vatunil.mr" },
        { id: 9, email: "si@feovlin.uk" },
        { id: 88, email: "imiiko@gewat.uy" },
    ];

    const sendMessage = (e) => {
        if(!newUserEmail){ return; }
        var msg = e.detail;
        var newUser = {
            id: Math.random(100,1000),
            name: newUserEmail,
            avartar: undefined,
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
                                avartar:
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
        {#each liveSearchUsers as user (user.id)}
            <option value={user.email} />
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