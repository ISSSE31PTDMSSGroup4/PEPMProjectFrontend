<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "./add-question.svelte";
    import Spinner from "./spinner.svelte";
    import {
        baseApiUrl,
        questionUrl,
    } from "../routes/constants.js";
    export let modalId = "";
    export let quizId = "";
    export let index = "";
    const questionReqUrl = baseApiUrl + questionUrl;
    let processing = false;
    let promise;

    let question = {
        title: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
    };

    export const handleQuestionSubmit = () => {
        processing = true;
        promise = addQuestion();
    };

    async function addQuestion() {
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(reqBody),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("request success", data);
            location.reload();
        } else {
            const text = await response.text();
            alert(text);
        }
    }
</script>

<!-- Modal -->
<div
    class="modal fade"
    id={modalId}
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">Create Question</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <AddQuestion {question} />
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
                <button type="button" class="btn btn-primary" disabled={processing} on:click={handleQuestionSubmit}>
                    {#if processing}
                        <span class="spinner-border spinner-border-sm" />
                        Processing...
                    {:else}
                        Create
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
