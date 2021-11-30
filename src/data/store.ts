import { writable } from "svelte/store";
import { DayModel } from "./classes/day.class";
import { User } from "./classes/user.class";
import { SERVICE, SHIFT_TYPES } from "./types/enums";

const USERS = [
  new User("Bruns", SERVICE.IMC),
  new User("Alsaleh", SERVICE.ER),
  new User("Hussein", SERVICE.ER),
  new User("Jarosch", SERVICE.ER),
  new User("Hindawi", SERVICE.ER),
  new User("Zoaa", SERVICE.IMC),
  new User("Sulaiman", SERVICE.ER, 0.5),
  new User("Abbas ", SERVICE.ER, 0.8),
  new User("Kulik", SERVICE.ER),
  new User("Bomba", SERVICE.ER),
  new User("Clüver", SERVICE.IMC),
  new User("Elkhateeb", SERVICE.ER),
  new User("Hashim", SERVICE.ER),
  new User("Scheikh Ali", SERVICE.ER, 0.8),
  new User("Sawalha", SERVICE.ER),
  new User("Jahn", SERVICE.ER, 0.5),
  new User("Arslan", SERVICE.ER),
  new User("Berkane", SERVICE.ER, 0),
  new User("Jain", SERVICE.ER, 0),
  new User("Alnashawati", SERVICE.IMC),
  new User("Abbas Ahmad", SERVICE.IMC),
  new User("Alsulaiman", SERVICE.IMC),
  new User("Emmermann", SERVICE.ER),
  new User("Yahia", SERVICE.ER),
  new User("Simic", SERVICE.IMC),
  new User("Swistowski", SERVICE.IMC),
  new User("Obeidat", SERVICE.IMC),
];
export const getStore = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const caculateDays = (month): DayModel[] => {
    const days = [];
    for (let i = 1; i < 31; i++) {
      if (new Date(year, month, i).getMonth() === month) {
        days.push(new DayModel(i, month, year));
      }
    }
    return days;
  };

  const { set, update, subscribe } = writable({
    days: caculateDays(month),
    month,
    year,
    users: USERS,
  });
  const sortedUpdate = (state) => {
    const users = state.users.sort((a, b) => a.userID.localeCompare(b.userID));
    const days = state.days.sort((a, b) => a.day - b.day);
    return {
      ...state,
      days,
      users,
    };
  };

  update((f) => sortedUpdate(f));
  return {
    addNewUser: (user: User): void => {
      update((state) => {
        const users = [...state.users, user];
        return {
          ...state,
          users,
        };
      });
    },
    addShiftToADay: (
      dayId: string,
      service: SERVICE,
      shiftType: SHIFT_TYPES,
      user: User
    ) => {
      update((state) => {
        const [day] = state.days.filter((f) => f.id === dayId);
        try {
          if (day) {
            const newUser = day.assignShiftToUser(user, service, shiftType);
            const users = [
              ...state.users.filter((f) => f.userID !== user.userID),
              newUser,
            ];
            const days = [...state.days.filter((f) => f.id != dayId), day];

            return sortedUpdate({
              ...state,
              users,
              days,
            });
          }
        } catch (error) {
          console.log(error);

          return sortedUpdate({
            ...state,
            error,
          });
        }
      });
    },
    set,
    update,
    subscribe,
  };
};
