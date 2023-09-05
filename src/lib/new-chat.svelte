<script>  
    import Sendbox from "./sendbox.svelte";   

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
        
    }
</script>

<div class="input-group mb-3">
    <span class="input-group-text">To:</span>
    <input
        class="form-control"
        list="datalistOptions"
        placeholder="Type to search..."
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