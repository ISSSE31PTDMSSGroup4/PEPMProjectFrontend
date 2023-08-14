<!--- User Profile Picture & options -->
<script>
  import Account from "svelte-material-icons/Account.svelte";
  export let size = "2em"; // string | number
  export let width = size; // string | number
  export let height = size; // string | number
  export let color= "black";
  export let user;
</script>
{#if user}
  <!---User logged in, show options -->
  <ul class = "navbar-nav ml-auto">
  <li class = "nav-item my-auto"><a href='/logout'><button class = "btn btn-primary btn-sm" on:click={ () => user=!user}>Signout</button></a></li>
  <li class = "nav-item mr-md-2 dropdown-center">
    <div class="nav-item ">
      <a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><Account {size} {width} {height} {color}/></a>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" >
        <a class = "dropdown-item" href='/profile'>Profile</a>
        <a class = "dropdown-item" href='/account'>Account</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href='/about'>About MSE Teams</a>
      </div>
    </div>
  </li>
</ul>

{:else}
  <!---User not logged in, show login button, should probably put this in userOptions -->
  <a href='/'><button class="btn btn-primary" on:click={ () => user=!user}>
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