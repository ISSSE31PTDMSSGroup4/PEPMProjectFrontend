<script>
  import Modal from './base-modal.svelte';
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { createEventDispatcher } from "svelte";
  
  export let title = "";
  export let content = "";
  export let buttonText = "Confirm";  
  export let processing = false;
  let showModal = false;
  let buttonType = "btn-primary";
  let modalObj;
  const dispatch = createEventDispatcher();

  onMount(() => {
      if(buttonText == "Remove"){
        buttonType = "btn-danger";
      }
  });

  const buttonHandler = () => {
    dispatch("buttonHandler");
  };

  export const showHandler = () => {
    showModal = true;
  };

  export const closeHandler = () => {
    showModal = false;
    modalObj.closeModal();
  };
</script>

<Modal bind:showModal bind:this={modalObj} width="20rem">
  <div slot="header" class="d-flex flex-row justify-content-between">
    <h5>{title}</h5>
    <button
      type="button"
      class="btn-close"
      on:click={closeHandler}
    />
  </div>
  <div slot="content">
    <p>{content}</p>
  </div>
  <div slot="footer" class="d-flex flex-row justify-content-end">
    <button type="button" class="btn btn-secondary" on:click={closeHandler}
      >Close</button
    >
    <button type="button" class="btn {buttonType}" disabled={processing} on:click={buttonHandler}>
      {#if processing}
        <span class="spinner-border spinner-border-sm" />
        Processing...
      {:else}
        {buttonText}
      {/if}
    </button>
  </div>
</Modal>

<style>
  .btn{
    margin: 0.2rem;
  }
</style>