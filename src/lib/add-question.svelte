<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Spinner from "./spinner.svelte";
    export let question = {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
    };
</script>

<div class="container rounded bg-white mt-5 mb-5">
    <div class="d-flex justify-content-center row">
        <div class="col-md-12 col-lg-12">
            <div class="border">
                <div class="question bg-white p-3 border-bottom">
                    <div class="ml-12">
                        <h3>Question:</h3>
                        <input
                            type="text"
                            class="form-control"
                            bind:value={question.question}
                        />
                    </div>
                </div>
                <div class="options bg-white p-3 border-bottom">
                    {#each question?.options as option, optionIndex}
                        <div class="row" style="margin: 1rem">
                            <div class="col-lg-2 col-sm-4">
                                <h5>Option {optionIndex + 1}:</h5>
                            </div>
                            <div class="col-lg-10 col-sm-8" >
                                <input
                                    type="text"
                                    class="form-control"
                                    bind:value={option}
                                />
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="p-3 bg-white">
                    <div class="d-flex flex-row align-items-center">
                        <h5 style="margin-right: 1rem;">Answer:</h5>
                        <input
                            type="text"
                            class="form-control"
                            bind:value={question.answer}
                            style="margin-bottom: 1rem;"
                        />
                    </div>
                    <div class="d-flex flex-row align-items-center">
                        <h5 style="margin-right: 1rem;">Expanation:</h5>
                        <input
                            type="text"
                            class="form-control"
                            bind:value={question.explanation}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
