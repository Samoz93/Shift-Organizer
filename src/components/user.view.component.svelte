<script lang="ts">
  import { User } from "../data/classes/user.class";

  export let user: User;

  const test = () => {
    console.log(user);
  };
</script>

<div class="main" on:click={test}>
  <h1>{user.userID}</h1>
  <h1>{user.service}</h1>
  <h1>week shifts: {user.shiftCounts.week}</h1>
  <h1>weekend shifts: {user.shiftCounts.weekEnd}</h1>
</div>

<style>
  .main {
    display: grid;
    background-color: rgba(255, 17, 0, 0.199);
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }
</style>
