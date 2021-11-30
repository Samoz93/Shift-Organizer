import type { User } from "../classes/user.class";
import type { SERVICE, SHIFT_TYPES } from "./enums";

export interface SHIFT {
  shiftType: SHIFT_TYPES;
  service: SERVICE;
  user: User;
  isWeekDay: boolean;
  dateId: string;
}
