<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { createEventDispatcher } from "svelte";
    import AddQuestion from "../add-question.svelte";
    import Spinner from "../spinner.svelte";
    import { quizUrl } from "../../routes/constants.js";
    import { xUser } from "../../routes/store";
    import Modal from "./base-modal.svelte";

    const dispatch = createEventDispatcher();
    const quizReqUrl = quizUrl;
    let showModal = false;
    let modalObj;
    let processing = false;
    let promise;
    let quiz = {
        title: "",
        questions: [
            {
                title: "",
                options: ["", "", "", ""],
                answer: "",
                explanation: "",
            },
        ],
        remark: "",
    };
    export const showHandler = () => {
        showModal = true;
    };

    export const closeHandler = () => {
        showModal = false;
        modalObj.closeModal();
    };

    const submitHandler = async () => {
        await addQuiz();
    };

    async function addQuiz() {
        processing = true;
        const response = await fetch(quizReqUrl, {
            method: "POST",
            headers: {
                "X-USER": $xUser,
            },
            body: JSON.stringify(quiz),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("request success", data);
            processing = false;
            dispatch("quizCreated");
            closeHandler();
        } else {
            const text = await response.text();
            alert(text);
            processing = false;
        }
    }
</script>

<Modal bind:showModal bind:this={modalObj} width="60rem">
    <div slot="header" class="d-flex flex-row justify-content-between">
        <h5>Create Quiz</h5>
        <button type="button" class="btn-close" on:click={closeHandler} />
    </div>
    <div slot="content">
        <div class="question bg-white p-3 border-bottom">
            <div class="row">
                <div class="col-sm-3 col-lg-2">
                    <h3>Title:</h3>
                </div>
                <div class="col-sm-9 col-lg-10">
                    <input
                        type="text"
                        class="form-control"
                        style="margin-bottom: 1rem;"
                        bind:value={quiz.title}
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3 col-lg-2">
                    <h5>Subtitle:</h5>
                </div>
                <div class="col-sm-9 col-lg-10">
                    <input
                        type="text"
                        class="form-control"
                        bind:value={quiz.remark}
                    />
                </div>
            </div>
        </div>
        <AddQuestion question={quiz.questions[0]} />
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
