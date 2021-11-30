<script lang="ts">
  import type { DayModel } from "../data/classes/day.class";

  import ShiftComponent from "./shift.component.svelte";

  export let day: DayModel;
  const test = () => {
    console.log(day, day.isOccupied());
  };
</script>

<div class="main {day.isOccupied() ? 'isFull' : 'isEmpty'}" on:click={test}>
  <h1 class={["day", day.isWeekDay ? "weekDay" : "weekend"].join(" ")}>.</h1>
  <p>{day.dayName}</p>
  <p>IMC <ShiftComponent arr={day.imcShifts} /></p>
  <p>ER <ShiftComponent arr={day.erShifts} /></p>
</div>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 3fr;
  }

  .day {
    font-size: 50px;
  }
  .weekDay {
    color: green;
  }
  .weekend {
    color: red;
  }

  .isFull {
    background-color: rgba(0, 255, 21, 0.199);
  }

  .isEmpty {
    background-color: rgba(255, 17, 0, 0.199);
  }
</style>
