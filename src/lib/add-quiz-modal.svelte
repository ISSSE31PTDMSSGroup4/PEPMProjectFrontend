<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "./add-question.svelte";
    import Spinner from "./spinner.svelte";
    import { baseApiUrl, quizUrl } from "../routes/constants.js";
    export let modalId = "";

    const quizReqUrl = baseApiUrl + quizUrl;
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
    export const handleQuizSubmit = () => {
        processing = true;
        promise = addQuiz();
    };

    async function addQuiz() {
        const response = await fetch(quizReqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(quiz),
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
                <h5 class="modal-title" id="modalLabel">Create Quiz</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
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
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    disabled={processing}
                    on:click={handleQuizSubmit}
                >
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
