<script>
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { user, xUser } from "./../../routes/store.js";
    import Modal from "./base-modal.svelte";
    import {
        userProfileUrl,
        updateUserProfileUrl,
        uploadAvatar,
        routeLogin,
    } from "../../routes/constants";
    import Spinner from "../spinner.svelte";
    export let mode = "edit";
    export let profileData = {
        name: "",
        avatar: "",
        email: "",
        about: "",
    };

    let formTitle = mode === "edit" ? "Edit" : "Create";
    let showModal = false;
    let modalObj;
    let processing = false;
    let avatarUploading = false;
    let buttoneText = mode === "edit" ? "Save Changes" : "Submit";
    let fileinput;
    onMount(() => {});
    const onFileSelected = async (e) => {
        let image = e.target.files[0];
        //console.log(image.type);
        //console.log('image size', image.size);
        if (!image) {
            alert("Invalid file");
            return;
        } else if (image.size > 10 * 1024 * 1024) {
            alert("Image size is too large");
            return;
        } else if (
            image.type !== "image/jpg" &&
            image.type !== "image/jpeg" &&
            image.type !== "image/png"
        ) {
            alert("Only support jpg and png file");
            return;
        }

        await postUploadAvatar(image);
        //let reader = new FileReader();
        //reader.readAsDataURL(image);
        //reader.onload = (e) => {
        //profileData.avatar = e.target.result;
        //$user.avatar =  e.target.result;
        //TODO: Call API to upload the avatar file
        //};
    };

    export const showHandler = () => {
        showModal = true;
    };

    export const closeHandler = () => {
        showModal = false;
        modalObj.closeModal();
    };

    const submitHandler = async () => {
        //Temp Hardcode
        profileData.avatar = "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp";
        if (!validateBfSubmit()) {
            return;
        }
        await triggerUserProfile();
    };

    const validateBfSubmit = () => {
        console.log(profileData);
        if (profileData.email === "") {
            alert("Please input valid email.");
            return false;
        }
        if (profileData.name === "") {
            alert("Please input valid name.");
            return false;
        }
        if (profileData.avatar === "") {
            alert("Please upload avatar before submit.");
            return false;
        }
        return true;
    };

    async function triggerUserProfile() {
        processing = true;

        let url = updateUserProfileUrl;
        let method = "PUT";
        let reqBody = {
            id: profileData.id,
            name: profileData.name,
            avatar: profileData.avatar,
            email: profileData.email,
            about: profileData.about,
        };
        if (mode === "create") {
            url = userProfileUrl;
            method = "POST";
            reqBody = {
                name: profileData.name,
                avatar: profileData.avatar,
                email: profileData.email,
                about: profileData.about,
            };
        }
        console.log("reqbody", JSON.stringify(reqBody));
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-USER": $xUser,
            },
            body: JSON.stringify(reqBody),
        });
        if (response.ok) {
            const data = await response.json();
            console.log("submitted data", data);
            user.set(data);
            processing = false;
            closeHandler();
            return;
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

    async function postUploadAvatar(image) {
        if (!image) {
            return;
        }
        avatarUploading = true;
        let url = uploadAvatar;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "Content-Type": image.type,
                "X-USER": $xUser,
            },
            body: image,
        });
        if (response.ok) {
            const data = await response.json();
            console.log("respose", data);
            let res = JSON.parse(data);
            profileData.avatar = res.avatar;
            if (mode === "edit") {
                $user.avatar = res.avatar;
            }
        } else {
            const text = await response.text();
            processing = false;
            if (text.includes("403")) {
                user.set(undefined);
                location.replace(routeLogout);
            }
            alert(text);
        }
        avatarUploading = false;
    }
</script>

<Modal bind:showModal bind:this={modalObj} width="60rem">
    <div slot="header" class="d-flex flex-row justify-content-between">
        <h5>{formTitle} Profile</h5>
        {#if mode === "edit"}
            <button type="button" class="btn-close" on:click={closeHandler} />
        {/if}
    </div>
    <div slot="content">
        <div class="container rounded bg-white mt-5 mb-5">
            <div class="row">
                <div class="col-md-3 border-right">
                    {#if avatarUploading}
                        <div
                            class="d-flex flex-row align-items-center justify-content-center"
                            style="height: 50%;"
                        >
                            <Spinner />
                        </div>
                    {:else}
                        <div
                            class="d-flex flex-column align-items-center text-center p-3 py-5"
                        >
                            <img
                                class="rounded-circle mt-5"
                                width="150px"
                                src={profileData.avatar &&
                                profileData.avatar != ""
                                    ? profileData.avatar
                                    : "./icons8-user-96.png"}
                                alt=""
                            />

                            <div class="mt-5 text-center">
                                <button
                                    class="btn btn-outline-primary profile-button"
                                    type="button"
                                    on:click={() => {
                                        fileinput.click();
                                    }}
                                >
                                    Upload Avatar
                                </button>
                                <input
                                    style="display:none"
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    on:change={(e) => onFileSelected(e)}
                                    bind:this={fileinput}
                                />
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="col-md-9 border-right">
                    <div class="p-3 py-5">
                        <div
                            class="d-flex justify-content-between align-items-center mb-3"
                        >
                            <h4 class="text-right">Profile Information</h4>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="labels">Email</label><input
                                    type="text"
                                    class="form-control"
                                    placeholder="enter email"
                                    bind:value={profileData.email}
                                    disabled
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="labels">Nickname</label><input
                                    type="text"
                                    class="form-control"
                                    placeholder="Your name"
                                    bind:value={profileData.name}
                                />
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="labels">About Me</label><textarea
                                    type="text"
                                    class="form-control"
                                    placeholder="Say something about yourself"
                                    rows="8"
                                    bind:value={profileData.about}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer" class="d-flex flex-row justify-content-end">
        {#if mode === "edit"}
            <button
                type="button"
                class="btn btn-secondary"
                on:click={closeHandler}>Close</button
            >
        {/if}
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
                {buttoneText}
            {/if}
        </button>
    </div>
</Modal>

<style>
    .btn {
        margin: 0.2rem;
    }
</style>
