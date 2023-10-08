<script>
  import { routeLogin } from "./constants.js";
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import Spinner from "./../lib/spinner.svelte";
  import Navbar from "../lib/navbar.svelte";
  import Sidebar from "../lib/sidebar.svelte";
  import { user } from "./store";
  import { userProfileUrl, userProfilesUrl } from "./constants.js";
  import ProfileModal from "../lib/popup-modals/profile-modal.svelte";
  const url = userProfileUrl;

  let profileModalObj;
  let creatingProfile = false;
  let loginState = false;

  const hardcodeEmail = "zengxianhan@gmail.com";

  onMount(async () => {
    //check login state first
    loginState = isLoggedIn();
    if (loginState) {
      if (!$user) {
        let result = await fetchData();
        if (!result) {
          location.replace(routeLogin);
        }
      }
    }
  });

  const creatProfileHandler = () => {
    profileModalObj.showHandler();
    creatingProfile = true;
  };

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function isLoggedIn() {
    let loginState = getCookie("logged_in");
    if (loginState != "true") {
      return false;
    } else return true;
  }
  async function fetchData() {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-USER": hardcodeEmail,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("userProfileData");
      if (data.name === "") {
        creatProfileHandler();
      } else {
        user.set(data);
      }
      return true;
    } else {
      const text = await response.text();
      alert(text);
      return false;
    }
  }
</script>

{#if $user}
  <div class="d-flex flex-column vh-100 m-0">
    <Navbar />
    <div class="bootstrap d-flex flex-row flex-grow-1">
      <Sidebar />
      <div
        class="d-flex flex-column flex-shrink-0 p-9 bg-body-secondary flex-grow-1"
      >
        <slot />
      </div>
    </div>
  </div>
{:else if creatingProfile === true}
  <div
    class="d-flex flex-row justify-content-between align-items-center text-center"
  >
    <h1 style="text-align: center;">Welcome</h1>
  </div>
{:else if loginState === false}
  <div
    class="d-flex flex-row justify-content-between align-items-center text-center"
  >
    <h1 style="text-align: center;">
      You are not logged in. Click <a href={routeLogin}>here</a> to login
    </h1>
  </div>
{:else}
  <Spinner />
{/if}

<ProfileModal mode="create" bind:this={profileModalObj} />
