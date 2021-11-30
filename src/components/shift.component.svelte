<script lang="ts">
  import type { SHIFT } from "../data/types/types";

  export let arr: SHIFT[] = [];
</script>

<div class="main">
  {#each arr as shift}
    <h1>{shift.shiftType}:{shift.user.userID}</h1>
  {/each}
</div>

<style>
  .main {
    height: 100%;
    width: 80%;
    border: 1px black solid;
  }
</style>
