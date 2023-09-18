<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Spinner from "./spinner.svelte";
    import {
        baseApiUrl,
        getQuizDetailUrl,
        viewMode,
        editMode,
    } from "../routes/constants.js";

    export let targetQuiz = undefined;
    export let quizDetailMode = viewMode;
    let quizDetail = undefined;
    let currIndex = 1;
    let question = undefined;
    let selectedOption = "";
    const url = baseApiUrl + getQuizDetailUrl;

    async function fetchData(targetQuiz) {
        if (!targetQuiz) {
            return;
        }
        const response = await fetch(url + "?quiz_id=" + targetQuiz.id);
        if (response.ok) {
            currIndex = 1;
            const data = await response.json();
            quizDetail = data;
            question = quizDetail?.questions?.find((x) => x.index == currIndex);
            return data;
        } else {
            const text = await response.text();
            throw new Error(text);
        }
    }

    const handleNextClick = (e) => {
        if (currIndex >= quizDetail?.questions.length) {
            return;
        }
        currIndex++;
        question = quizDetail?.questions?.find((x) => x.index == currIndex);
    };

    const handlePreviousClick = (e) => {
        if (currIndex <= 1) {
            return;
        }
        currIndex--;
        question = quizDetail?.questions?.find((x) => x.index == currIndex);
    };
</script>

{#await fetchData(targetQuiz)}
    <Spinner size="spinner-grow-lg" />
{:then data}
    <div class="container mt-5">
        <div class="d-flex justify-content-center row">
            <div class="col-md-12 col-lg-12">
                <div class="border">
                    <div class="question bg-white p-3 border-bottom">
                        <div
                            class="d-flex flex-row justify-content-between align-items-center mcq"
                        >
                            {#if quizDetailMode == editMode}
                                <div class="mb-10 lg-8">
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={quizDetail.title}
                                    />
                                </div>
                            {:else}
                                <h4>{quizDetail?.title}</h4>
                            {/if}

                            <span
                                >({currIndex} of {quizDetail?.questions
                                    .length})</span
                            >
                        </div>
                    </div>
                    <div class="question bg-white p-3 border-bottom">
                        <div
                            class="d-flex flex-row align-items-center question-title"
                        >
                            <h3 class="text-primary">Q{currIndex}.</h3>

                            {#if quizDetailMode == editMode}
                                <input
                                    type="text"
                                    class="form-control"
                                    bind:value={question.title}
                                />
                            {:else}
                                <h5 class="mt-1 ml-2">
                                    {question?.title}
                                </h5>
                            {/if}
                        </div>
                        <br />
                        {#each question?.options as option, optionIndex}
                            <div class="ml-12">
                                {#if quizDetailMode == editMode}
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={option}
                                        style="margin-bottom: 1rem;"
                                    />
                                {:else}
                                    <input
                                        type="radio"
                                        bind:group={selectedOption}
                                        value={option}
                                        id={optionIndex}
                                    />
                                    <label for={optionIndex}>{option}</label>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    <div class="p-3 bg-white">
                        <div class="d-flex flex-row align-items-center">
                            <h5 style="margin-right: 1rem;">Answer:</h5>
                            {#if quizDetailMode == editMode}
                                <input
                                    type="text"
                                    class="form-control"
                                    bind:value={question.answer}
                                    style="margin-bottom: 1rem;"
                                />
                            {:else}
                                <h5 class="text-secondary">
                                    {question?.answer}
                                </h5>
                            {/if}
                        </div>
                        <div class="d-flex flex-row align-items-center">
                            <h5 style="margin-right: 1rem;">Expanation:</h5>
                            {#if quizDetailMode == editMode}
                                <input
                                    type="text"
                                    class="form-control"
                                    bind:value={question.explanation}
                                />
                            {:else}
                                <span class="text-secondary">
                                    {question?.explanation}
                                </span>
                            {/if}
                        </div>
                    </div>
                    <div
                        class="d-flex flex-row justify-content-between align-items-center p-3 bg-white"
                    >
                        <button
                            class="btn btn-primary d-flex align-items-center btn-danger"
                            type="button"
                            on:click={handlePreviousClick}
                            ><i
                                class="fa fa-angle-left mt-1 mr-1"
                            />Previous</button
                        ><button
                            class="btn btn-primary border-success align-items-center btn-success"
                            type="button"
                            on:click={handleNextClick}
                            >Next<i class="fa fa-angle-right ml-2" /></button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
