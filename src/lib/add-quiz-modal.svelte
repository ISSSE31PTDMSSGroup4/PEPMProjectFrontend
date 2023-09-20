<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "./add-question.svelte";
    import Spinner from "./spinner.svelte";
    import { baseApiUrl } from "../routes/constants.js";
    export let modalId = "";
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
                <button type="button" class="btn btn-primary">Create</button>
            </div>
        </div>
    </div>
</div>
