<script>
    import { user } from "./../store.js";
    import Spinner from "./../../lib/spinner.svelte";
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import ProfileModal from "../../lib/popup-modals/profile-modal.svelte";

    let profileModalObj;
    let profileData = $user;
    onMount(async () => {});

    onDestroy(() => {});

    user.subscribe((value) => {
        profileData = value;
    });
</script>

<section class="h-100 gradient-custom-2">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-lg-9 col-xl-7">
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
                                src={profileData.avatar}
                                alt="Generic placeholder image"
                                class="img-fluid img-thumbnail mt-4 mb-2"
                                style="width: 150px; z-index: 1"
                            />
                            <button
                                type="button"
                                class="btn btn-outline-primary"
                                style="z-index: 1;"
                                on:click={() => {
                                    profileModalObj.showHandler();
                                }}
                            >
                                Edit profile
                            </button>
                        </div>
                        <div class="ms-3" style="margin-top: 130px;">
                            <h5>{profileData.name}</h5>
                            <p>{profileData.email}</p>
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
                            <div class="p-4" style="background-color: #f8f9fa;">
                                <p class="font-italic mb-1">
                                    {profileData.about}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<ProfileModal mode="edit" bind:this={profileModalObj} {profileData} />

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

    p {
        word-wrap: break-word;
        white-space: pre-line;
    }
</style>
