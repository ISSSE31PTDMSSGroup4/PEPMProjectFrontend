<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "../add-question.svelte";
    import Modal from "./base-modal.svelte";
    import Spinner from "../spinner.svelte";
    import { createEventDispatcher } from "svelte";
    import { questionUrl,routeLogout } from "../../routes/constants.js";
    import { xUser } from "../../routes/store";

    export let quizId = "";
    export let index = undefined;
    const dispatch = createEventDispatcher();
    const questionReqUrl = questionUrl;
    let processing = false;
    let showModal;
    let modalObj;
    let question = {
        quiz_id : quizId,
        index: index,
        question: "",
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
        if (!validateBfSubmit()) {
            return;
        }
        await addQuestion();
    };

    const validateBfSubmit = () => {
        console.log('valid question', question);
        if (question.question === "") {
            alert("Please input valid question title.");
            return false;
        }
        if (!question.options) {
            alert("Please input valid options.");
            return false;
        }
        if (!question.index) {
            alert("Invalid index.");
            return false;
        }
        let validOptions = false;
        question.options.forEach((opition) => {
            if (opition === "") {
                alert("Please input valid options.");
                validOptions = false;
            }            
            validOptions = true;
        });
        if(!validOptions){return false;}

        if (new Set(question.options).size !== question.options.length){
            alert("Duplicate options, please make sure the option contents are difference.");
            return false;
        }

        if (question.answer === "" || !question.options.includes(question.answer)) {
            alert(
                "Please input valid anwser and the anwser must from the options"
            );
            return false;
        }
        if (question.explanation === "") {
            alert(
                "Please input valid explanation"
            );
            return false;
        }
        return true;
    };

    async function addQuestion() {
        processing = true;
        let reqBody = {
            quiz_id: question.quiz_id,
            index: question.index,
            question: question.question,
            options: question.options,
            answer: question.answer,
            explanation: question.explanation,
        };
        console.log("add question req body", reqBody);
        const response = await fetch(questionReqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-USER": $xUser,
            },
            body: JSON.stringify(reqBody),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code !== 200){
                alert(data.message);
                processing = false;
                return;
            }
            console.log("request success", data);
            processing = false;
            dispatch("questionCreated");
            closeHandler();
        } else {
            const text = await response.text();
            processing = false;
            closeHandler();
            if (text.includes("Forbidden")) {
                user.set(undefined);
                location.replace(routeLogout);
                return;
            }
                        
            alert(text);
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
        <button type="button" class="btn btn-secondary" on:click={closeHandler}
            >Close</button
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
