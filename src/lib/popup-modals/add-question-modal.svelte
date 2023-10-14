<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "../add-question.svelte";
    import Modal from "./base-modal.svelte";
    import Spinner from "../spinner.svelte";
    import { createEventDispatcher } from "svelte";
    import {
        questionUrl,
    } from "../../routes/constants.js";
    import { xUser } from "../../routes/store";
    
    export let quizId = "";
    export let index = "";
    const dispatch = createEventDispatcher();
    const questionReqUrl = questionUrl;
    let processing = false;
    let showModal;
    let modalObj;
    let question = {
        title: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
    };

    export const showHandler = () => {
        showModal = true;
    };

    export const closeHandler = () => {
        showModal = false;
        modalObj.closeModal();
    };

    const submitHandler = async () => {
        await addQuestion();
    };

    async function addQuestion() {
        processing = true;
        let reqBody = {
        quiz_id: quizId,
        index: index,
        title: question.title,
        options: question.options,
        answer: question.answer,
        explanation: question.explanation,
    };
        console.log("request body", reqBody);
        const response = await fetch(questionReqUrl, {
            method: "POST",
            headers: {
                "X-USER": $xUser,
            },
            body: JSON.stringify(reqBody),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("request success", data);
            processing = false;
            dispatch("questionCreated");
            closeHandler();
        } else {
            const text = await response.text();
            alert(text);
            processing = false;
            closeHandler();
        }
    }
</script>

<Modal bind:showModal bind:this={modalObj} width="60rem">
    <div slot="header" class="d-flex flex-row justify-content-between">
        <h5>Create Question</h5>
        <button type="button" class="btn-close" on:click={closeHandler} />
    </div>
    <div slot="content">
        <AddQuestion {question} />
    </div>
    <div slot="footer" class="d-flex flex-row justify-content-end">
        <button
            type="button"
            class="btn btn-secondary"
            on:click={closeHandler}>Close</button
        >
        <button
            type="button"
            class="btn btn-primary"
            disabled={processing}
            on:click={submitHandler}
        >
            {#if processing}
                <span class="spinner-border spinner-border-sm" />
                Processing...
            {:else}
                Create
            {/if}
        </button>
    </div>
</Modal>

<style>
    .btn {
        margin: 0.2rem;
    }
</style>
