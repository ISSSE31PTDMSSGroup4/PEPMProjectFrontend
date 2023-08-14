<script>
  import UserOptions from './navbar-components/userOptions.svelte'
  //user logged in TODO
  let user=false;
  
</script>
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand md-2" href="/">MSE Teams</a>
    <!-- search function, move to component when ready -->
    <form class="form-inline mx-auto">
        <input class="form-control" type="text" placeholder="Search">
    </form>
    <div class="justify-content-md-right">
      <UserOptions {user}/>
    </div>
    
  </nav>
</div>

<style>
  .navbar{
    padding: .5rem 1rem;
  }
</style>