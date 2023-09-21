<script>
	import Spinner from './../../lib/spinner.svelte';
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { baseApiUrl, getUserProfileUrl } from '../constants';

    const url = baseApiUrl + getUserProfileUrl;
    let promise = fetchData();

    let profileData = {};

    onMount(async () => {
        //await fetchData();
    });

    onDestroy(() => {});

    async function fetchData() {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("userProfileData", data);
            profileData = data;
            return data;
        } else {
            const text = await response.text();
            throw new Error(text);
        }
    }
</script>

<section class="h-100 gradient-custom-2">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-lg-9 col-xl-7">
                {#await fetchData()}
                    <Spinner/>
                {:then data}
                    <div class="card">
                        <div
                            class="rounded-top text-white d-flex flex-row"
                            style="background-color: #000; height:200px;"
                        >
                            <div
                                class="ms-4 mt-5 d-flex flex-column"
                                style="width: 150px;"
                            >
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img
                                    src={data.avartar}
                                    alt="Generic placeholder image"
                                    class="img-fluid img-thumbnail mt-4 mb-2"
                                    style="width: 150px; z-index: 1"
                                />
                                <button
                                    type="button"
                                    class="btn btn-outline-primary"
                                    data-mdb-ripple-color="dark"
                                    style="z-index: 1;"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editProfileModal"
                                >
                                    Edit profile
                                </button>
                            </div>
                            <div class="ms-3" style="margin-top: 130px;">
                                <h5>{data.name}</h5>
                                <p>{data.email}</p>
                            </div>
                        </div>
                        <div
                            class="p-4 text-black"
                            style="background-color: #f8f9fa;"
                        >
                            <div
                                class="d-flex justify-content-end text-center py-1"
                            >
                                <div>
                                    <!-- <p class="mb-1 h5">253</p>
                                <p class="small text-muted mb-0">Photos</p> -->
                                </div>
                                <div class="px-3">
                                    <!-- <p class="mb-1 h5">1026</p>
                                <p class="small text-muted mb-0">Followers</p> -->
                                </div>
                                <div>
                                    <!-- <p class="mb-1 h5">478</p>
                                <p class="small text-muted mb-0">Following</p> -->
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-4 text-black">
                            <div class="mb-5">
                                <p class="lead fw-normal mb-1">About</p>
                                <div
                                    class="p-4"
                                    style="background-color: #f8f9fa;"
                                >
                                    <p class="font-italic mb-1">{data.about}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {:catch error}
                    <p style="color: red">{error.message}</p>
                {/await}
            </div>
        </div>
    </div>
</section>

<!-- Modal -->
<div
    class="modal fade"
    id="editProfileModal"
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">Edit Profile</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <div class="container rounded bg-white mt-5 mb-5">
                <div class="row">
                    <div class="col-md-3 border-right">
                        <div
                            class="d-flex flex-column align-items-center text-center p-3 py-5"
                        >
                            <img
                                class="rounded-circle mt-5"
                                width="150px"
                                src={profileData.avartar}
                            />
                            
                            <div class="mt-5 text-center">
                                <button
                                    class="btn btn-outline-primary profile-button"
                                    type="button">Upload Avartar</button
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9 border-right">
                        <div class="p-3 py-5">
                            <div
                                class="d-flex justify-content-between align-items-center mb-3"
                            >
                                <h4 class="text-right">Profile Settings</h4>
                            </div>
                            <div class="row mt-2">
                                <div class="col-md-12">
                                    <label class="labels">Nickname</label><input
                                        type="text"
                                        class="form-control"
                                        placeholder="nick name"
                                        bind:value={profileData.name}
                                    />
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <label class="labels">Email</label
                                    ><input
                                        type="text"
                                        class="form-control"
                                        placeholder="enter email"
                                        bind:value={profileData.email}
                                    />
                                </div>                                                             
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <label class="labels">About Me</label
                                    ><textarea
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
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
                <button type="button" class="btn btn-primary"
                    >Save changes</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .gradient-custom-2 {
        /* fallback for old browsers */
        background: rgb(255, 255, 255);

        /* Chrome 10-25, Safari 5.1-6 */
        background: -webkit-linear-gradient(
            to right,
            rgb(194, 221, 251),
            rgba(166, 193, 238, 1)
        );

        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        background: linear-gradient(
            to right,
            rgb(255, 255, 255),
            rgba(166, 193, 238, 1)
        );
    }

    textarea { resize:none; }

    p { word-wrap:break-word; white-space: pre-line;}
</style>
