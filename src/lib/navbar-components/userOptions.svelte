<!--- User Profile Picture & options -->
<script>
  import { base } from '$app/paths'; // for github pages
  export let size = "2.4em"; // string | number
  export let width = size; // string | number
  export let height = size; // string | number
  export let color= "black";
  export let user;
  export let avartar ="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp";
</script>
{#if user}
<!---User logged in, show options -->
<ul class="nav justify-content-end">
  <li class="nav-item">
    <div class="row">
      <div class="col">
        <a href='{base}/logout'>
          <button class = "btn btn-primary btn-md" on:click={ () => user=!user}>
            Signout
          </button>
        </a>
      </div>
      <div class="col">
        <a class="dropdown-toggle" href="{base}/" data-toggle="dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src={avartar} class="rounded-circle" style="width: {width}; size:{size}; width:{width};height:{height};" alt="Avatar" />
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" >
          <a class = "dropdown-item" href='{base}/profile'>Profile</a>
          <!-- <a class = "dropdown-item" href='{base}/account'>Account</a> -->
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href='{base}/about'>About MSE Teams</a>
        </div>
      </div>
    </div>
  </li>
</ul>

{:else}
  <!---User not logged in, show login button, should probably put this in userOptions -->
  <a href='{base}/'><button class="btn btn-primary" on:click={ () => user=!user}>
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
