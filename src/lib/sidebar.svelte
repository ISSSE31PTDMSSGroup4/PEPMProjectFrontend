<script>
  import { routeBase, routeRoot, routeQuiz } from './../routes/constants.js';
  import Bell from "svelte-bootstrap-icons/lib/Bell.svelte";
  import ChatDots from "svelte-bootstrap-icons/lib/ChatDots.svelte";

  //icon options
  export let size = "2em"; // string | number
  export let width = size; // string | number
  export let height = size; // string | number
  export let color = "primary";

  let rootUrl = routeRoot;
  let quizUrl = routeQuiz;
</script>

<div class="d-flex flex-column flex-shrink-0 bg-light" style="width: 4.5rem;">
  <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
    <li>
      <a
        href={rootUrl}
        class="nav-link py-3 border-bottom"
        title=""
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-original-title="Chat"
      >
        <ChatDots {size} {width} {height} {color} />
      </a>
    </li>
    <li>
      <a
        href={quizUrl}
        class="nav-link py-3 border-bottom"
        title=""
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-original-title="quiz"
      >
        <Bell {size} {width} {height} {color} />
      </a>
    </li>
  </ul>
</div>
