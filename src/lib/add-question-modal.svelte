<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import AddQuestion from "./add-question.svelte";
    import Spinner from "./spinner.svelte";
    import {
        baseApiUrl,
    } from "../routes/constants.js";
    export let modalId = "";
    let question = {
        title: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
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
                <h5 class="modal-title" id="modalLabel">Create Question</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <AddQuestion {question}/>
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
