<script lang="ts">
  import _ from "lodash";
  import DayComponent from "./components/day.component.svelte";
  import UserComponent from "./components/user.view.component.svelte";
  import type { DayModel } from "./data/classes/day.class";
  import type { User } from "./data/classes/user.class";
  import { getStore } from "./data/store";
  import { SERVICE, SHIFT_TYPES } from "./data/types/enums";
  const { subscribe, addShiftToADay } = getStore();

  let state;
  let maxUsersShiftsWD = 0;
  let MaxUserShiftsWE = 0;
  let MaxWDShifts = 0;
  let MaxWEShifts = 0;
  subscribe((f) => {
    state = f;
    maxUsersShiftsWD = f.users.reduce((pr, cur) => {
      return pr + cur.rules().maxWeekShifts;
    }, 0);
    MaxUserShiftsWE = f.users.reduce((pr, cur) => {
      return pr + cur.rules().maxWeekEndShifts;
    }, 0);

    MaxWDShifts = f.days.filter((f) => f.isWeekDay).length * 2;
    MaxWEShifts = f.days.filter((f) => !f.isWeekDay).length * 3;
  });

  const test = () => {
    let currentUser: User = null;
    let currentErUser: User = null;
    let currentErUser2: User = null;
    state.days.forEach((day: DayModel) => {
      const imcUsers = state.users
        .filter((f) => f.service === SERVICE.IMC)
        .filter((f) => !f.hasFullShifts(day.isWeekDay));
      const erUsers = state.users
        .filter((f) => f.service === SERVICE.ER)
        .filter((f) => !f.hasFullShifts(day.isWeekDay));

      currentUser = getCurrentUser(imcUsers, currentUser, day);
      currentErUser = getCurrentUser(erUsers, currentErUser, day);
      currentErUser2 = getCurrentUser(erUsers, currentErUser2, day);

      if (imcUsers.length > 0) {
        addShiftToADay(
          day.id,
          SERVICE.IMC,
          SHIFT_TYPES.NightShift,
          currentUser
        );
      }

      //   if (erUsers.length > 0) {
      //     if (day.isWeekDay) {
      //       addShiftToADay(
      //         day.id,
      //         SERVICE.ER,
      //         SHIFT_TYPES.NightShift,
      //         currentErUser
      //       );
      //     } else {
      //       addShiftToADay(
      //         day.id,
      //         SERVICE.ER,
      //         SHIFT_TYPES.EarlyShift,
      //         currentErUser
      //       );
      //       addShiftToADay(
      //         day.id,
      //         SERVICE.ER,
      //         SHIFT_TYPES.LateShift,
      //         currentErUser2
      //       );
      //     }
      //   }
    });
  };

  const getCurrentUser = (lst: User[], currentUser: User, day: DayModel) => {
    return !currentUser ||
      currentUser.hasFullShifts(day.isWeekDay) ||
      currentUser.hasShiftInRow(day)
      ? lst[Math.floor(Math.random() * lst.length)]
      : currentUser;
  };
</script>

<section>
  <button on:click={test}>test</button>
  <br />
  How much our doctors can hold shifts : weekDays-WeekEnds : {maxUsersShiftsWD} -
  {MaxUserShiftsWE}
  <br />
  How many shifts need to be covered : weekDays-WeekEnds : {MaxWDShifts} - {MaxWEShifts}
  <br />
  Shifts per doctor ~ weekDay-weekEnd : {maxUsersShiftsWD / MaxWDShifts} - {MaxUserShiftsWE /
    MaxWEShifts}
  <div class="calendar">
    {#each state.days as day}
      <DayComponent {day} />
    {/each}
  </div>

  <div class="users">
    {#each state.users as user}
      <UserComponent {user} />
    {/each}
  </div>
</section>

<style>
  .calendar {
    display: grid;
    gap: 10px;
  }
  .users {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
</style>
