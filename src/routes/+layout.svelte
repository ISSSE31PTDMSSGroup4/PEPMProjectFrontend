<script>
	import { routeLogin } from './constants.js';
  import { onMount, onDestroy, afterUpdate } from "svelte";
	import Spinner from './../lib/spinner.svelte';
  import Navbar from "../lib/navbar.svelte";
  import Sidebar from "../lib/sidebar.svelte";
  import { user } from './store';
  import { baseApiUrl, userProfileUrl } from './constants.js';
  import ProfileModal from '../lib/popup-modals/profile-modal.svelte';
  const url = baseApiUrl + userProfileUrl;
  
  let profileModalObj;
  let creatingProfile = false;

  onMount(async () => {    
    if(!$user){
      let result = await fetchData();
      if(!result){
        location.replace(routeLogin);
      }
    }
  });

  const creatProfileHandler = ()=>{
     profileModalObj.showHandler();
     creatingProfile = true;
  }

  async function fetchData() {
        const response = await fetch(url,{
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
            }});
        if (response.ok) {
            const data = await response.json();
            console.log("userProfileData", data);
            if(data.name === ""){
              creatProfileHandler();
            }
            else{
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
  <div class="d-flex flex-row justify-content-between align-items-center text-center">
     <h1 style="text-align: center;">Creating New User Profile</h1>
  </div>
{:else}
  <Spinner/>
{/if}

<ProfileModal mode="create" bind:this={profileModalObj} />
