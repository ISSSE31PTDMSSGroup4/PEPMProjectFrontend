<script>
	import { routeRoot } from './../routes/constants.js';
  import UserOptions from './navbar-components/userOptions.svelte'
  //user logged in TODO
  let user=true;
  let rootUrl = routeRoot;
</script>
<div>
  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand md-2" href={rootUrl}>Team 8 PM Project</a>
    <!-- search function, move to component when ready -->
    <!-- <form class="form-inline mx-auto">
        <input class="form-control" type="text" placeholder="Search">
    </form> -->
    <div class="nav justify-content-end">
      <UserOptions {user}/>
    </div>
    
  </nav>
</div>

<style>
  .navbar{
    padding: .5rem 1rem;
  }
</style>