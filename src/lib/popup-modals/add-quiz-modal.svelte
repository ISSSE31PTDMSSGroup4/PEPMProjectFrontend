<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { createEventDispatcher } from "svelte";
    import AddQuestion from "../add-question.svelte";
    import Spinner from "../spinner.svelte";
    import { quizUrl, routeLogout } from "../../routes/constants.js";
    import { xUser } from "../../routes/store";
    import Modal from "./base-modal.svelte";

    const dispatch = createEventDispatcher();
    const quizReqUrl = quizUrl;
    let showModal = false;
    let modalObj;
    let processing = false;
    let promise;
    let quiz = {
        title: "",
        questions: [
            {
                index: 1,
                question: "",
                options: ["", "", "", ""],
                answer: "",
                explanation: "",
            },
        ],
        remark: "",
    };
    export const showHandler = () => {
        showModal = true;
    };

    export const closeHandler = () => {
        showModal = false;
        modalObj.closeModal();
    };

    const submitHandler = async () => {
        if (!validateBfSubmit()) {
            return;
        }
        await addQuiz();
    };

    const validateBfSubmit = () => {
        if (quiz.title === "") {
            alert("Please input valid quiz title.");
            return false;
        }
        if (quiz.remark === "") {
            alert("Please input valid quiz subtitle.");
            return false;
        }
        if (!quiz.questions) {
            alert("Please input valid init question.");
            return false;
        }
        
        let validQuestions =  false;
        quiz.questions.forEach((question) => {
            if (question.question === "") {
                alert("Please input valid question title.");
                return false;
            }
            if (new Set(question.options).size !== question.options.length){
                alert("Duplicate options, please make sure the option contents are difference.");
                return false;
            }
            if (question.answer === "" || !question.options.includes(question.answer)) {
                alert(
                    "Please input valid anwser and the anwser must from the options"
                );
                return false;
            }
            if (question.explanation === "") {
                alert("Please input valid explanation");
                return false;
            }
            validQuestions = true;
            return true;
        });
        console.log(validQuestions);
        if(!validQuestions){
            return false;
        }
        return true;
    };

    async function addQuiz() {
        processing = true;
        console.log(JSON.stringify(quiz));
        const response = await fetch(quizReqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"X-USER": $xUser,
            },
            body: JSON.stringify(quiz),
        });
        if (response.ok) {
            const data = await response.json();
            if(data.code && data.code !== 200){
                alert(data.message);
                processing = false;
                return;
            }
            console.log("request success", data);
            processing = false;
            dispatch("quizCreated");
            closeHandler();
        } else {
            const text = await response.text();            
            processing = false;
            if (text.includes("403")) {
                user.set(undefined);
                location.replace(routeLogout);
            }
            alert(text);
        }
    }
</script>

<Modal bind:showModal bind:this={modalObj} width="60rem">
    <div slot="header" class="d-flex flex-row justify-content-between">
        <h5>Create Quiz</h5>
        <button type="button" class="btn-close" on:click={closeHandler} />
    </div>
    <div slot="content">
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
    </div>
    <div slot="footer" class="d-flex flex-row justify-content-end">
        <button type="button" class="btn btn-secondary" on:click={closeHandler}
            >Close</button
        >
        <button
            type="button"
            class="btn btn-primary"
            disabled={processing}
            on:click={submitHandler}
        >
            {#if processing}
                <span class="spinner-border spinner-border-sm" />
                Processing...
            {:else}
                Create
            {/if}
        </button>
    </div>
</Modal>

<style>
    .btn {
        margin: 0.2rem;
    }
</style>
