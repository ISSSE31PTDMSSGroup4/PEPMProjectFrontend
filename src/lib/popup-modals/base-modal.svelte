<script>
	export let showModal; // boolean
	export let width = '20rem';
	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) 
    {
        dialog.showModal();
    }
    
    export const closeModal = () => {
        showModal = false;
        dialog.close()
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	style="width: {width};"
	bind:this={dialog}
	on:close={() => (showModal = false)}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot name="content"/>
		<hr />
		<slot name="footer"/>
	</div>
</dialog>

<style>
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
