<script>
    import QuizList from "../../lib/quiz-list.svelte";
    import QuizDetail from "../../lib/quiz-detail.svelte";
    let quizListChild;
    let selectedQuiz = undefined;

    const handleSelectedQuizChanged = (e) => {
        console.log("selectedQuiz", e.detail);
        selectedQuiz = e.detail;
    };
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-3 col-sm-5 d-flex flex-column flex-shrink-0 bg-light">
            <QuizList bind:this={quizListChild} on:selectedQuiz={handleSelectedQuizChanged} />
        </div>
        <div class="col-lg-9 col-sm-7 d-flex flex-column flex-shrink-0 bg-light">
            {#if !selectedQuiz}
                <h1>No Quiz selected</h1>
            {:else if selectedQuiz.id < 0}
                <!-- <NewChat on:newChatCreated={handleNewChatCreated}/> -->
            {:else}
                <QuizDetail targetQuiz={selectedQuiz}/>
            {/if}
        </div>
    </div>
</div>