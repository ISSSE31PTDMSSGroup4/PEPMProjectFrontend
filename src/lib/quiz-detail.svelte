<script>
    import {
        reloadQuiz,
        xUser,
        quizHistory,
        quizAnswering,
        reloadQuizList,
    } from "./../routes/store.js";
    import NodePlus from "svelte-bootstrap-icons/lib/NodePlus.svelte";
    import Trash from "svelte-bootstrap-icons/lib/Trash.svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import Spinner from "./spinner.svelte";
    import PopupModal from "./popup-modals/popup-modal.svelte";
    import AddQuestionModal from "./popup-modals/add-question-modal.svelte";
    import {
        getQuizDetailUrl,
        quizUrl,
        questionUrl,
        viewMode,
        editMode,
        quizMode,
        reviewMode,
        routeLogout,
    } from "../routes/constants.js";
    import { CheckLg, Key, XLg } from "svelte-bootstrap-icons";

    export let targetQuiz = undefined;
    export let quizDetailMode = viewMode;
    export let reloadTrigger = {};

    const size = "2em"; // string | number
    const width = size; // string | number
    const height = size; // string | number
    const color = "primary";
    const url = getQuizDetailUrl;
    const quizReqUrl = quizUrl;
    const questionReqUrl = questionUrl;

    let createQuestionObj;
    let quizDetail = undefined;
    let quizSnapShot = undefined;
    let currIndex = 1;
    let questionSnapshot = undefined;
    let question = undefined;
    let selectedOption = "";
    let removeQuizModal;
    let removeQuestionModal;
    let removeQuizProcessing = false;
    let removeQuestionProcessing = false;
    let editPromise;
    let editQuizProcessing = false;
    let submitQuizModal;
    let submitQuizProcessing = false;
    let editQuestionProcessing = false;
    async function fetchData() {
        if (!targetQuiz) {
            return;
        }
        console.log(targetQuiz.quiz_id);
        const response = await fetch(url + "?quiz_id=" + targetQuiz.quiz_id, {
            method: "GET",
            headers: {
                "X-USER": $xUser,
            },
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code === 400){
                throw new Error(data.message);
            }
            data.questions?.sort((a, b) => {
                return parseInt(a.index) - parseInt(b.index);
            });
            console.log("quiz detail", data);
            quizDetail = data;
            updateQuizSnapshot();
            getQuestion();
            getLastAnswer();
            return data;
        } else {
            const text = await response.text();
            if (unauthorizeHandler(text)) {
                return;
            }
            throw new Error(text);
        }
    }

    function unauthorizeHandler(text) {
        if (text.includes("Forbidden")) {
            user.set(undefined);
            location.replace(routeLogout);
            return true;
        }
        return false;
    }

    const handleNextClick = (e) => {
        if (currIndex >= quizDetail?.questions.length) {
            return;
        }
        resetQuestion();
        currIndex++;
        getQuestion();
        getLastAnswer();
    };

    const handlePreviousClick = (e) => {
        if (currIndex <= 1) {
            return;
        }
        resetQuestion();
        currIndex--;
        getQuestion();
        getLastAnswer();
    };

    const handleSaveQuestionClick = async (e) => {
        await editQuestion();
    };

    const handleCancelEditQuestionClick = (e) => {
        resetQuestion();
        getQuestion();
    };

    const handleCancelEditQuizClick = (e) => {
        resetQuizBaseInfo();
        updateQuizSnapshot();
    };

    function resetQuizBaseInfo() {
        if (quizDetailMode != editMode) {
            return;
        }
        quizDetail.title = quizSnapShot.title;
        quizDetail.remark = quizSnapShot.remark;
    }

    function updateQuizSnapshot() {
        quizSnapShot = {
            title: quizDetail.title,
            remark: quizDetail.remark,
        };
    }

    function checkQuizEdited(quizDetail, quizSnapShot) {
        if (!quizDetail || !quizSnapShot || quizDetailMode != editMode) {
            return false;
        }

        return (
            quizSnapShot.title !== quizDetail.title ||
            quizSnapShot.remark !== quizDetail.remark
        );
    }

    $: quizEdited = checkQuizEdited(quizDetail, quizSnapShot);

    function resetQuestion() {
        if (quizDetailMode != editMode) {
            return;
        }
        quizDetail.questions[currIndex - 1] = JSON.parse(
            JSON.stringify(questionSnapshot)
        );
    }

    function getQuestion() {
        question = quizDetail?.questions?.at(currIndex - 1);
        questionSnapshot = JSON.parse(JSON.stringify(question));
    }

    $: questionEdited = questionEditted(question, questionSnapshot);

    function questionEditted(question, questionSnapshot) {
        if (!question || !questionSnapshot || quizDetailMode != editMode) {
            return false;
        }
        return JSON.stringify(question) !== JSON.stringify(questionSnapshot);
    }

    function getLastAnswer() {
        if (quizDetailMode != quizMode && quizDetailMode != reviewMode) {
            selectedOption = "";
            return;
        }

        let historyObj = $quizHistory.find(
            (x) => x.quiz_id == quizDetail.quiz_id
        );
        if (!historyObj) {
            selectedOption = "";
            return;
        }
        let historyQuestionObj = historyObj.questions.find(
            (x) =>
                x.question_id ==
                quizDetail?.questions?.at(currIndex - 1).question_id
        );
        if (!historyQuestionObj) {
            selectedOption = "";
            return;
        }
        selectedOption = historyQuestionObj.answer;
    }

    const handleBackToChat = (e) => {
        quizAnswering.set(false);
    };

    const handleApplyChangesClick = (e) => {
        editPromise = editQuiz();
    };

    const removeQuizClick = (e) => {
        removeQuizModal.showHandler();
    };

    const removeQuestionClick = (e) => {
        if (quizDetail.questions.length <= 1) {
            alert("Can't remove last question");
            return;
        }
        removeQuestionModal.showHandler();
    };

    const createQuestionClick = (e) => {
        createQuestionObj.showHandler();
    };
    const handleQuestionCreated = () => {
        reloadTrigger = {};
    };

    function getMaxIndexNumber() {
        let maxIndex = Math.max.apply(
            Math,
            quizDetail?.questions.map((x) => {
                return x.index;
            })
        );
        //console.log('maxIndex', maxIndex);
        if (!maxIndex) {
            return quizDetail.questions.length;
        }
        return maxIndex;
    }

    async function editQuiz() {
        console.log("request body", quizDetail);
        editQuizProcessing = true;
        const response = await fetch(quizReqUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-USER": $xUser,
            },
            body: JSON.stringify(quizDetail),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code !== 200){
                alert(data.message);
                return;
            }
            console.log("request success", data);
            updateQuizSnapshot();
            $reloadQuizList = {};
        } else {
            const text = await response.text();
            if (unauthorizeHandler(text)) {
                return;
            }
            alert(text);
        }
        editQuizProcessing = false;
    }
    const submitQuizClick = (e) => {
        submitQuizModal.showHandler();
    };

    async function submitQuiz() {
        let historyObj = $quizHistory.find(
            (x) => x.quiz_id == quizDetail.quiz_id
        );

        if (!historyObj) {
            alert("Error submit quiz result");
        }
        historyObj.submitted = true;
        $quizHistory[$quizHistory.indexOf(historyObj)] = historyObj;

        quizAnswering.set(false);
    }

    async function removeQuiz() {
        removeQuizProcessing = true;
        const response = await fetch(quizReqUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-USER": $xUser,
            },
            body: JSON.stringify({
                quiz_id: quizDetail.quiz_id,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code !== 200){
                alert(data.message);
                return;
            }
            console.log("request success", data);
            removeQuizModal.closeHandler();
            removeQuizProcessing = false;
            currIndex = 1;
            reloadQuiz.set({});
        } else {
            const text = await response.text();
            removeQuizProcessing = false;
            if (unauthorizeHandler(text)) {
                return;
            }
            alert(text);
        }
    }

    async function editQuestion() {
        let reqBody = JSON.parse(JSON.stringify(question));
        reqBody.quiz_id = quizDetail.quiz_id;
        console.log("request body edit question", JSON.stringify(reqBody));
        editQuestionProcessing = true;
        const response = await fetch(questionUrl, {
            method: "PUT",
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
                return;
            }
            console.log("request success", data);
            reloadTrigger = {};
        } else {
            const text = await response.text();
            if (unauthorizeHandler(text)) {
                return;
            }
            alert(text);
        }
        editQuestionProcessing = false;
    }

    async function removeQuestion() {
        removeQuestionProcessing = true;
        const response = await fetch(questionReqUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-USER": $xUser,
            },
            body: JSON.stringify({
                quiz_id: quizDetail.quiz_id,
                question_id: question.question_id,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code !== 200){
                alert(data.message);
                return;
            }
            console.log("request success", data);
            if(currIndex > 1){ currIndex--};
            removeQuizModal.closeHandler();
            removeQuestionProcessing = false;
            reloadTrigger = {};
        } else {
            const text = await response.text();
            removeQuestionProcessing = false;
            if (unauthorizeHandler(text)) {
                return;
            }
            alert(text);
        }
    }

    function getCorrectQuestionQty() {
        let historyObj = $quizHistory.find(
            (x) => x.quiz_id == quizDetail.quiz_id
        );
        if (!historyObj) {
            return 0;
        }
        let correctQty = 0;
        for (let i = 0; i < historyObj.questions.length; i++) {
            if (
                historyObj.questions[i].answer == quizDetail.questions[i].answer
            ) {
                correctQty++;
            }
        }
        return correctQty;
    }

    function checkAnswer() {
        let historyObj = $quizHistory.find(
            (x) => x.quiz_id == quizDetail.quiz_id
        );
        if (!historyObj) {
            return false;
        }
        let question_id = quizDetail?.questions?.at(currIndex - 1)?.question_id;
        let questionHistoryObj = historyObj.questions.find(
            (x) => (x.question_id == question_id)
        );

        if (!questionHistoryObj) {
            return false;
        }
        return questionHistoryObj.answer == question.answer;
    }

    $: {
        if (quizDetailMode == quizMode && quizDetail) {
            console.log("selectOption ->", selectedOption);
            if (selectedOption && selectedOption != "") {
                let newRecord = false;
                let historyObj = $quizHistory.find(
                    (x) => x.quiz_id == quizDetail.quiz_id
                );
                if (!historyObj) {
                    newRecord = true;
                    historyObj = {
                        quiz_id: quizDetail.quiz_id,
                        submitted: false,
                        questions: [],
                    };
                }

                if (!historyObj.submitted) {
                    let question_id = quizDetail?.questions?.at(
                        currIndex - 1
                    ).question_id;
                    let questionHistoryObj = historyObj.questions.find(
                        (x) => (x.question_id == question_id)
                    );
                    if (questionHistoryObj) {
                        questionHistoryObj.answer = selectedOption;
                        console.log("update answer", questionHistoryObj);
                        historyObj.questions[
                            historyObj.questions.indexOf(questionHistoryObj)
                        ] = questionHistoryObj;
                    } else {
                        questionHistoryObj = {
                            question_id: question_id,
                            answer: selectedOption,
                        };
                        console.log("add answer", questionHistoryObj);
                        historyObj.questions = [
                            ...historyObj.questions,
                            questionHistoryObj,
                        ];
                    }

                    if (newRecord) {
                        $quizHistory = [$quizHistory, historyObj];
                    }
                }
            }
        }
    }
</script>

{#key reloadTrigger}
    {#await fetchData()}
        <Spinner size="spinner-grow-lg" />
    {:then data}
        {#if quizDetailMode == reviewMode}
            <div class="container mt-5">
                <div class="d-flex justify-content-center row">
                    <div class="col-md-12 col-lg-12">
                        <div
                            class="d-flex border bg-white p-3 justify-content-between"
                        >
                            <h5>
                                Your result of the Quiz: Correct: {getCorrectQuestionQty()},
                                Total: {quizDetail?.questions.length}
                            </h5>
                            <button
                                class="btn btn-secondary d-flex align-items-center"
                                type="button"
                                on:click={handleBackToChat}
                                ><i class="fa fa-angle-left mt-1 mr-1" />Back to
                                Chat</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        {/if}
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
                                            on:click={removeQuizClick}
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
                            {#if quizDetailMode == editMode && quizEdited}
                                <div class="flex-row" style="margin-top: 1rem;">
                                    <button
                                        class="btn border-secondary align-items-center btn-secondary"
                                        type="button"
                                        on:click={handleCancelEditQuizClick}
                                        >Cancel<i
                                            class="fa fa-angle-right ml-2"
                                        /></button
                                    >
                                    <button
                                        class="btn border-success align-items-center btn-success"
                                        type="button"
                                        disabled={editQuizProcessing}
                                        style="margin-left: 0.1rem;"
                                        on:click={handleApplyChangesClick}
                                    >
                                        {#if editQuizProcessing}
                                            <span
                                                class="spinner-border spinner-border-sm"
                                            />
                                            Processing...
                                        {:else}
                                            Apply Changes
                                        {/if}
                                    </button>
                                </div>
                            {/if}
                        </div>
                        {#if quizDetailMode == editMode}
                            <div style="margin-left: 1rem; margin-top: 1rem;">
                                <button
                                    class="btn btn-primary border-primary align-items-center btn-primary"
                                    type="button"
                                    data-mdb-ripple-color="dark"
                                    style="z-index: 1;"
                                    on:click={createQuestionClick}
                                >
                                    Add Question
                                </button>
                                <button
                                    class="btn btn-danger border-danger align-items-center btn-danger"
                                    type="button"
                                    on:click={removeQuestionClick}
                                    >Remove Question</button
                                >
                            </div>
                        {/if}

                        <div class="question bg-white p-3 border-bottom">
                            <div
                                class="d-flex flex-row align-items-center question-title"
                            >
                                {#if quizDetailMode == reviewMode}
                                    {#key currIndex}
                                        {#if checkAnswer()}
                                            <CheckLg
                                                {size}
                                                {width}
                                                {height}
                                                color="green"
                                            />
                                        {:else}
                                            <XLg
                                                {size}
                                                {width}
                                                {height}
                                                color="red"
                                            />
                                        {/if}
                                    {/key}
                                {/if}
                                <h3 class="text-primary">Q{currIndex}.</h3>

                                {#if quizDetailMode == editMode}
                                    <input
                                        type="text"
                                        class="form-control"
                                        bind:value={question.question}
                                    />
                                {:else}
                                    <h5 class="mt-1 ml-2">
                                        {question?.question}
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
                                            disabled={quizDetailMode !=
                                                quizMode}
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
                        {#if quizDetailMode != quizMode}
                            <div class="p-3 bg-white">
                                <div class="d-flex flex-row">
                                    <h5 style="margin-right: 1rem;">Answer:</h5>
                                    {#if quizDetailMode == editMode}
                                        <input
                                            type="text"
                                            class="form-control"
                                            bind:value={question.answer}
                                            style="margin-bottom: 1rem;"
                                        />
                                    {:else if quizDetailMode == viewMode || quizDetailMode == reviewMode}
                                        <h5 class="text-secondary">
                                            {question?.answer}
                                        </h5>
                                    {/if}
                                </div>
                                <div class="d-flex flex-col">
                                    <h5 style="margin-right: 1rem;">
                                        Explanation:
                                    </h5>
                                </div>
                                <div class="d-flex flex-col">
                                    {#if quizDetailMode == editMode}
                                        <input
                                            type="text"
                                            class="form-control"
                                            bind:value={question.explanation}
                                        />
                                    {:else if quizDetailMode == viewMode || quizDetailMode == reviewMode}
                                        <span class="text-secondary">
                                            {question?.explanation}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                        <div
                            class="d-flex flex-row justify-content-between align-items-center p-3 bg-white"
                        >
                            {#if currIndex <= 1 && quizDetailMode == quizMode}
                                <button
                                    class="btn btn-secondary d-flex align-items-center"
                                    type="button"
                                    on:click={handleBackToChat}
                                    ><i
                                        class="fa fa-angle-left mt-1 mr-1"
                                    />Back to Chat</button
                                >
                            {:else}
                                <button
                                    class="btn d-flex align-items-center btn-danger"
                                    type="button"
                                    style="visibility: {currIndex <= 1 ||
                                    questionEdited
                                        ? 'collapse'
                                        : 'visible'};"
                                    on:click={handlePreviousClick}
                                    ><i
                                        class="fa fa-angle-left mt-1 mr-1"
                                    />Previous</button
                                >
                            {/if}
                            {#if currIndex >= quizDetail?.questions.length && quizDetailMode == quizMode}
                                <button
                                    class="btn btn-primary border-primary align-items-center"
                                    type="button"
                                    on:click={submitQuizClick}
                                >
                                    Submit Quiz
                                </button>
                            {:else if questionEdited}
                                <div class="d-flex flex-row">
                                    <button
                                        class="btn border-secondary align-items-center btn-secondary"
                                        type="button"
                                        on:click={handleCancelEditQuestionClick}
                                        >Cancel<i
                                            class="fa fa-angle-right ml-2"
                                        /></button
                                    >
                                    <button
                                        class="btn border-success align-items-center btn-success"
                                        type="button"
                                        style="margin-left: 0.5rem;"
                                        on:click={handleSaveQuestionClick}
                                    >
                                        {#if editQuestionProcessing}
                                            <span
                                                class="spinner-border spinner-border-sm"
                                            />
                                            Processing...
                                        {:else}
                                            Save Changes
                                        {/if}</button
                                    >
                                </div>
                            {:else}
                                <button
                                    class="btn border-primary align-items-center btn-primary"
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

        <AddQuestionModal
            quizId={quizDetail.quiz_id}
            index={getMaxIndexNumber() + 1}
            bind:this={createQuestionObj}
            on:questionCreated={handleQuestionCreated}
        />
        <PopupModal
            title="Remove Quiz"
            content="Are you sure to remove this quiz?"
            buttonText="Remove"
            processing={removeQuizProcessing}
            bind:this={removeQuizModal}
            on:buttonHandler={removeQuiz}
        />
        <PopupModal
            title="Remove Question"
            content="Are you sure to remove this question?"
            buttonText="Remove"
            processing={removeQuestionProcessing}
            bind:this={removeQuestionModal}
            on:buttonHandler={removeQuestion}
        />
        <PopupModal
            title="Submit Quiz"
            content="Are you sure to submit?"
            processing={submitQuizProcessing}
            bind:this={submitQuizModal}
            on:buttonHandler={submitQuiz}
        />
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
{/key}
