<script>
  import { base } from '$app/paths'; // for github pages
  import Home from "svelte-material-icons/Home.svelte";
  import MessageText from "svelte-material-icons/MessageText.svelte";
  import CardsPlayingSpadeMultiple from "svelte-material-icons/CardsPlayingSpadeMultiple.svelte"
  //icon options
  export let size = "2em"; // string | number
  export let width = size; // string | number
  export let height = size; // string | number
  export let color= "black";
</script>



<div class="d-flex flex-column flex-shrink-0 bg-light" style="width: 4.5rem;">
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item">
    <a href="{base}/" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
      <Home  {size} {width} {height} {color}/>
    </a>
      </li>
      <li>
        <a href="{base}/chat" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Chat">
          <MessageText {size} {width} {height} {color}/>
        </a>
      </li>
      <li>
        <a href="{base}/quiz" class="nav-link py-3 border-bottom" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="quiz">
          <CardsPlayingSpadeMultiple  {size} {width} {height} {color}/>
        </a>
      </li>

    </ul>
  </div>