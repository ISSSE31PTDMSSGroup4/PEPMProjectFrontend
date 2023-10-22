<script>
    import { createEventDispatcher } from "svelte";
    import { Share } from "svelte-bootstrap-icons";
    import Spinner from "./spinner.svelte";
    import { getUserQuizListUrl } from "../routes/constants";
    import { quizzes, xUser } from "../routes/store";

    const dispatch = createEventDispatcher();
    const sendMessage = (content) => {
        if (!content || content === "") {
            return;
        }
        console.log("messageSent", content);
        dispatch("messageSent", content);

        message = "";
    };

    let message = "";

    let drawer;

    const openDrawer = () => {
        drawer.addEventListener("sl-hide", (event) => console.log("hide"));
        drawer.show();
    };

    const handleQuizSelected = (item) => {

        if (!item) {
            return;
        }
        //console.log(item);
        dispatch("selectedQuiz", item);
        drawer.hide();
    };
    async function fetchData() {
        const response = await fetch(getUserQuizListUrl, {
            method: "GET",
            headers: {
                "X-USER": $xUser,
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.code && data.code === 400) {
                $quizzes = [];
                return;
            }
            console.log("quizListData", data);
            $quizzes = data;
            return data;
        } else {
            const text = await response.text();
            if (text.includes("Forbidden")) {
                user.set(undefined);
                location.replace(routeLogout);
            }
            throw new Error(text);
        }
    }
</script>

<div class="send-box">
    <form action="">
        <input
            type="text"
            class="form-control"
            aria-label="message…"
            placeholder="Write message…"
            bind:value={message}
        />
        <button
            class="share-quiz nav-link py-3 border-bottom"
            on:click={openDrawer}
        >
            <Share height="24px" width="24px" color="primary" />
        </button>
        <button
            class="send-button"
            type="button"
            on:click={sendMessage(message)}
            ><i class="fa fa-paper-plane" aria-hidden="true" /> Send</button
        >
    </form>
</div>
<sl-drawer
    placement="bottom"
    label="Select quiz you want to share with others"
    contained
    class="drawer-contained"
    bind:this={drawer}
>
    {#await fetchData()}
        <Spinner />
    {:then data}
        <div class="quiz-list-block">
            <div class="list-group">
                {#if $quizzes && $quizzes.length > 0}
                    {#each $quizzes as quiz}
                        <button
                            class="list-group-item list-group-item-action d-flex justify-content-start align-items-center"
                            on:click={() => handleQuizSelected(quiz)}
                        >
                            <div class="col-12">
                                <h5>{quiz.title}</h5>
                                <p>{quiz.remark}</p>
                            </div>
                        </button>
                    {/each}
                {:else}
                    <h6>
                        You don't have any quizzes right now, Please create a
                        new quiz before sharing to other
                    </h6>
                {/if}
            </div>
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</sl-drawer>
<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.34/dist/themes/base.css"
    />
    <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.34/dist/shoelace.js"
    ></script>
</svelte:head>

<style>
    .send-box {
        padding: 15px;
        border-top: 1px solid #ccc;
        position: relative;
    }

    .send-box form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    .send-box .form-control {
        display: block;
        width: 85%;
        padding: 0.375rem 0.75rem;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        color: #222;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ccc;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .send-box .send-button {
        border: none;
        background: #3867d6;
        padding: 0.375rem 5px;
        color: #fff;
        border-radius: 0.25rem;
        font-size: 14px;
        font-weight: 400;
        width: 15%;
        margin-left: 1%;
    }

    .share-quiz {
        width: 5%;
        -ms-flex-align: center;
        margin-left: 1rem;
    }

    .send-box .send-button i {
        margin-right: 5px;
    }

    button:focus {
        outline: 0;
    }

    .send-box .send-button {
        width: 28%;
    }
    .send-box .form-control {
        width: 70%;
    }
</style>
