<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { createEventDispatcher } from "svelte";
    import Spinner from "./spinner.svelte";
    import PencilSquare from "svelte-bootstrap-icons/lib/PencilSquare.svelte";
    import CheckSquare from "svelte-bootstrap-icons/lib/CheckSquare.svelte";
    import XSquare from "svelte-bootstrap-icons/lib/XSquare.svelte";
    import PlusSquare from "svelte-bootstrap-icons/lib/PlusSquare.svelte";
    import {
        getUserQuizListUrl,
        viewMode,
        editMode,
    } from "../routes/constants.js";
    import AddQuizModal from "./popup-modals/add-quiz-modal.svelte";
    import { reloadQuiz } from "../routes/store";
    export let quizDetailMode = viewMode;

    const url = getUserQuizListUrl;
    const dispatch = createEventDispatcher();

    let size = "2em"; // string | number
    let width = size; // string | number
    let height = size; // string | number
    let color = "primary";
    let createQuizModalObj;
    let quizzes = undefined;
    let selectedId = -1;

    onMount(async () => {});

    onDestroy(() => {});

    export const handleQuizSelect = (item) => {
        if (selectedId == item.id) {
            return;
        }
        selectedId = item.id;
        dispatch("selectedQuiz", item);
    };

    export const handleQuizDetailMode = (mode) => {
        dispatch("quizDetailMode", mode);
    };

    export const handleCreateQuiz = () => {
        createQuizModalObj.showHandler();
    };

    export const handleQuizCreated = () => {
        reloadQuiz.set({});
    };

    const updateQuizDetailType = () => {
        let mode = quizDetailMode;
        if (selectedId < 0) {
            return;
        } else if (quizDetailMode == viewMode) {
            mode = editMode;
        } else if (quizDetailMode == editMode) {
            mode = viewMode;
        }
        quizDetailMode = mode;
        handleQuizDetailMode(mode);
    };

    async function fetchData() {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            //console.log("quizListData", data);
            quizzes = data;
            return data;
        } else {
            const text = await response.text();
            throw new Error(text);
        }
    }
</script>

<div class="row">
    <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand">Quizzes</span>
        <div class="nav justify-content-end">
            <button
                class="nav-link py-3 border-bottom"
                title=""
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-original-title="EditQuiz"
                on:click={updateQuizDetailType}
            >
                {#if quizDetailMode == viewMode && selectedId > 0}
                    <PencilSquare {size} {width} {height} {color} />
                {:else if quizDetailMode == editMode}
                    <XSquare {size} {width} {height} color="red" />
                    <!-- <CheckSquare {size} {width} {height} color = "green" /> -->
                {/if}
            </button>
            <button
                class="nav-link py-3 border-bottom"
                data-mdb-ripple-color="dark"
                style="z-index: 1;"
                on:click={handleCreateQuiz}
            >
                {#if selectedId <= 0 || quizDetailMode == viewMode}
                    <PlusSquare {size} {width} {height} color="green" />
                {/if}
            </button>
        </div>
    </nav>
</div>
<div class="row">
    <div class="quiz-list-block">
        <div class="list-group">
            {#await fetchData()}
                <Spinner size="spinner-grow-sm" />
            {:then data}
                {#each quizzes as quiz}
                    <button
                        disabled={quizDetailMode == editMode}
                        class="list-group-item list-group-item-action {quiz.id ===
                        selectedId
                            ? 'active'
                            : ''} d-flex justify-content-start align-items-center"
                        on:click={handleQuizSelect(quiz)}
                    >
                        <div class="col-12">
                            <h5>{quiz.title}</h5>
                            <p>{quiz.remark}</p>
                        </div>
                    </button>
                {/each}
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>

<AddQuizModal
    bind:this={createQuizModalObj}
    on:quizCreated={handleQuizCreated}
/>

<style>
    .navbar {
        padding: 0.5rem 1rem;
    }
    .quiz-list-block {
        height: 43rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
