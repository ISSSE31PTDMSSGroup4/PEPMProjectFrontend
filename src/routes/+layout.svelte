<script>
  import Navbar from "../lib/navbar.svelte";
  import Sidebar from "../lib/sidebar.svelte";
</script>

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
