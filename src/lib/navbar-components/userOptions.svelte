<!--- User Profile Picture & options -->
<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
	import { routeRoot, routeProfile, routeAbout, routeLogout, routeLogin } from './../../routes/constants.js';
  import { user } from '../../routes/store.js';
  export let size = "2.4em"; // string | number
  export let width = size; // string | number
  export let height = size; // string | number
  //export let color= "black";
  const logoutHandle = () => {
        user.set(undefined);
        location.replace(routeLogin);
    };
</script>
{#if $user}
<!---User logged in, show options -->
<ul class="nav justify-content-end">
  <li class="nav-item">
    <div class="row">
      <div class="col">
        <button class = "btn btn-primary btn-md" on:click={logoutHandle}>
          Signout
        </button>
      </div>
      <div class="col">
        <a class="dropdown-toggle" href={routeRoot} data-toggle="dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src={$user.avartar} class="rounded-circle" style="width: {width}; size:{size}; width:{width};height:{height};" alt="Avartar" />
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" >
          <a class = "dropdown-item" href={routeProfile}>Profile</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href={routeAbout}>About MSE Teams</a>
        </div>
      </div>
    </div>
  </li>
</ul>

{:else}
  <!---User not logged in, show login button, should probably put this in userOptions -->
  <a href={routeLogin}><button class="btn btn-primary">
    login
  </button>
  </a>
{/if}

<style>
  .dropdown-menu {
  left:inherit !important;
  right:0px;
}
</style>