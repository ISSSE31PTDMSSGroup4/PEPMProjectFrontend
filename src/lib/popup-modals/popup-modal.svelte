<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { createEventDispatcher } from "svelte";
  export let id = "";
  export let title = "";
  export let content = "";
  export let buttonText = "Confirm";  
  export let processing = false;
  export let closeAftSubmit = false;

  let buttonType = "btn-primary";

  const dispatch = createEventDispatcher();

  onMount(() => {
      if(buttonText == "Remove"){
        buttonType = "btn-danger";
      }
  });

  const buttonHandler = () => {
    if (!content) {
      return;
    }

    if(!closeAftSubmit){
      processing = true;
    }
    console.log("buttonHandler triggered");
    dispatch("buttonHandler");
  };
</script>

<div
  class="modal fade"
  id={id}
  tabindex="-1"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  aria-labelledby="remove-modal-label"
  aria-hidden='true'
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="remove-modal-label">{title}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        <p>{content}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
        <button type="button" class="btn {buttonType}" disabled={processing} on:click={buttonHandler} data-bs-dismiss={closeAftSubmit?"modal": ""}>
          {#if processing}
            <span class="spinner-border spinner-border-sm" />
            Processing...
          {:else}
            {buttonText}
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
