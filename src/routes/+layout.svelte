<script>
  import { routeLogin } from "./constants.js";
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import Spinner from "./../lib/spinner.svelte";
  import Navbar from "../lib/navbar.svelte";
  import Sidebar from "../lib/sidebar.svelte";
  import { user, xUser, pusher } from "./store";
  import { quizUrl, userProfileUrl, pusherCfgUrl } from "./constants.js";
  import Pusher from "pusher-js";
  import ProfileModal from "../lib/popup-modals/profile-modal.svelte";
  const url = userProfileUrl;

  // Create a function to monkey patch the fetch method
  function monkeyPatchFetch() {
    // Store the original fetch function
    const originalFetch = window.fetch;

    // Define a new fetch function with the desired behavior
    window.fetch = function (url, options) {
      // Check if the URL has a trailing slash and query parameters
      if (url.includes('quiz') && !url.includes("?") && !url.endsWith("/")) {
        url += "/";
      }

      // Call the original fetch function with the modified URL
      return originalFetch.call(window, url, options);
    };
  }

  async function initPusher() {
    Pusher.logToConsole = true;
    // Fetch Pusher configuration from the backend
    console.log(pusherCfgUrl);
    const response = await fetch(pusherCfgUrl, {
      method: "GET",
      // headers: {
      //   "X-USER": $xUser,
      // },
    });
    if (response.ok) {
      const config = await response.json();
      p = new Pusher(
        config.key,
        // pusher key
        {
          cluster: config.cluster,
          // authEndpoint: '/pusher/auth'
        }
      );
      pusher.set(p);
      console.log("Pusher init success");
    } else {
      pusher.set(undefined);
    }
  }
  // Call the monkeyPatchFetch function to apply the monkey patch

  onMount(() => {
    monkeyPatchFetch();
    initPusher();
  });

  let profileModalObj;
  let creatingProfile = false;
  let loginState = false;
  let mounting = true;
  let errorState = false;
  let profileData = {
    name: "",
    avatar: "",
    email: "",
    about: "",
  };

  onMount(async () => {
    //check login state first
    loginState = isLoggedIn();
    if (loginState) {
      xUser.set(getXUser());
      let result = await fetchData();
      if (!$user || !result) {
        errorState = true;
      }
    }
    mounting = false;
  });

  const creatProfileHandler = () => {
    profileData.email = $xUser;
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

  function getXUser() {
    if (!loginState) {
      return "";
    }
    let userStr = getCookie("debug_user");
    return userStr;
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
        "X-USER": $xUser,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("userProfileData");
      if (!data || data.email === "") {
        creatProfileHandler();
      } else {
        user.set(data);
      }
      return true;
    } else {
      const text = await response.text();
      console.log(text);
      //creatProfileHandler();
      return false;
    }
  }
</script>

{#if mounting === true}
  <Spinner />
{:else if $user}
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
    class="d-flex flex-column justify-content-between align-items-center text-center"
  >
    <h1 style="text-align: center;">Welcome</h1>
  </div>
{:else if loginState === false}
  <div
    class="d-flex flex-column justify-content-between align-items-center text-center"
  >
    <h1 style="text-align: center;">
      You are not logged in. Click <a href={routeLogin}>here</a> to login
    </h1>
  </div>
{:else if errorState === true}
  <h1>We are having some issues now. Sorry!</h1>
{:else}
  <Spinner />
{/if}

<ProfileModal mode="create" bind:this={profileModalObj} {profileData} />
