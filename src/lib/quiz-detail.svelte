<script>
    import NodePlus from "svelte-bootstrap-icons/lib/NodePlus.svelte";
    import Trash from "svelte-bootstrap-icons/lib/Trash.svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Spinner from "./spinner.svelte";
    import AddQuestionModal from "./add-question-modal.svelte";
    import PopupModal from "./popup-modals/popup-modal.svelte";
    import {
        baseApiUrl,
        getQuizDetailUrl,
        quizUrl,
        questionUrl,
        viewMode,
        editMode,
    } from "../routes/constants.js";

    export let targetQuiz = undefined;
    export let quizDetailMode = viewMode;

    const size = "2em"; // string | number
    const width = size; // string | number
    const height = size; // string | number
    const color = "primary";
    const modalId = "createQuestion";
    const url = baseApiUrl + getQuizDetailUrl;
    const quizReqUrl = baseApiUrl + quizUrl;
    const questionReqUrl = baseApiUrl + questionUrl;
    let reloadTrigger = {};
    let quizDetail = undefined;
    let currIndex = 1;
    let question = undefined;
    let selectedOption = "";
    let removeQuizModalId = "removeQuizModalId";
    let removeQuestionModalId = "removeQuestionModalId";
    let removeQuizProcessing = false;
    let removeQuestionProcessing = false;
    async function fetchData() {
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

    async function removeQuiz() {
        const response = await fetch(quizReqUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                quiz_id: quizDetail.id,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("request success", data);
            location.reload();
            removeQuizProcessing = false;
        } else {
            const text = await response.text();
            alert(text);
            removeQuizProcessing = false;
        }
    }

    async function removeQuestion() {
        const response = await fetch(questionReqUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                quiz_id: quizDetail.id,
                question_id: question.id,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("request success", data);
            removeQuestionProcessing = false;
            reloadTrigger = {};          
        } else {
            const text = await response.text();
            alert(text);
            removeQuestionProcessing = false;
        }
    }
</script>

{#key reloadTrigger}
    {#await fetchData()}
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
                                        <button
                                            class="nav-link py-3 border-bottom"
                                            data-mdb-ripple-color="dark"
                                            style="z-index: 1;"
                                            data-bs-toggle="modal"
                                            data-bs-target="#{removeQuizModalId}"
                                        >
                                            <Trash
                                                {size}
                                                {width}
                                                {height}
                                                color="red"
                                            />
                                        </button>
                                        <input
                                            type="text"
                                            class="form-control"
                                            style="margin-bottom: 1rem;"
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
                            <div class="flex-row">
                                {#if quizDetailMode == editMode}
                                    <div class="mb-12 lg-12">
                                        <input
                                            type="text"
                                            class="form-control"
                                            bind:value={quizDetail.remark}
                                        />
                                    </div>
                                {:else}
                                    <h5>{quizDetail?.remark}</h5>
                                {/if}
                            </div>
                        </div>
                        {#if quizDetailMode == editMode}
                            <div style="margin-left: 1rem; margin-top: 1rem;">
                                <button
                                    class="btn btn-primary border-primary align-items-center btn-primary"
                                    type="button"
                                    data-mdb-ripple-color="dark"
                                    style="z-index: 1;"
                                    data-bs-toggle="modal"
                                    data-bs-target="#{modalId}"
                                >
                                    Add Question
                                </button>
                                <button
                                    class="btn btn-danger border-danger align-items-center btn-danger"
                                    type="button"
                                    data-mdb-ripple-color="dark"
                                    style="z-index: 1;"
                                    data-bs-toggle="modal"
                                    data-bs-target="#{removeQuestionModalId}"
                                    >Remove Question</button
                                >
                            </div>
                        {/if}

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
                                        <label for={optionIndex}>{option}</label
                                        >
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
                                style="visibility: {currIndex <= 1
                                    ? 'hidden'
                                    : 'visible'};"
                                on:click={handlePreviousClick}
                                ><i
                                    class="fa fa-angle-left mt-1 mr-1"
                                />Previous</button
                            >
                            {#if currIndex >= quizDetail?.questions.length && quizDetailMode == editMode}
                                <button
                                    class="btn btn-primary border-primary align-items-center btn-primary"
                                    type="button"
                                    >Apply Change<i
                                        class="fa fa-angle-right ml-2"
                                    /></button
                                >
                            {:else}
                                <button
                                    class="btn btn-primary border-success align-items-center btn-success"
                                    type="button"
                                    style="visibility: {currIndex >=
                                    quizDetail?.questions.length
                                        ? 'collapse'
                                        : 'visible'};"
                                    on:click={handleNextClick}
                                    >Next<i
                                        class="fa fa-angle-right ml-2"
                                    /></button
                                >
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
{/key}

<AddQuestionModal {modalId} />
<PopupModal
    id={removeQuizModalId}
    title="Remove Quiz"
    content="Are you sure to remove this quiz?"
    buttonText="Remove"
    processing={removeQuizProcessing}
    on:buttonHandler={removeQuiz}
/>
<PopupModal
    id={removeQuestionModalId}
    title="Remove Question"
    content="Are you sure to remove this question?"
    buttonText="Remove"
    processing={removeQuestionProcessing}
    closeAftSubmit={true}
    on:buttonHandler={removeQuestion}
/>
