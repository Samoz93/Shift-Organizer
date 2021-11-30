import moment, { Moment } from "moment";
import * as _ from "lodash";
import type { SHIFT } from "../types/types";
import type { User } from "./user.class";
import { SERVICE, SHIFT_TYPES } from "../types/enums";

export class DayModel {
  private date: Moment;
  isWeekDay = true;
  dayName = "";
  id = "";
  constructor(public day: number, public month: number, public year = 2021) {
    this.date = moment(new Date(this.year, this.month, this.day));
    this.isWeekDay = this.isDateAWeekDay(this.date);
    this.dayName = this.date.format("dddd DD-MM");
    this.id = this.getID(this.date);
  }

  private isDateAWeekDay = (date: Moment): boolean => {
    return !(date.isoWeekday() === 6 || date.isoWeekday() === 7);
  };

  private imc: SHIFT[] = [];
  private er: SHIFT[] = [];

  get imcShifts(): SHIFT[] {
    return this.imc;
  }
  get erShifts(): SHIFT[] {
    return this.er;
  }

  isOccupied = (): boolean => {
    if (this.isWeekDay) {
      return this.isFull(SERVICE.ER) && this.isFull(SERVICE.IMC);
    } else {
      return (
        this.isFull(SERVICE.ER, SHIFT_TYPES.EarlyShift) &&
        this.isFull(SERVICE.ER, SHIFT_TYPES.LateShift) &&
        this.isFull(SERVICE.IMC)
      );
    }
  };

  private isFull = (service: SERVICE, shiftType = SHIFT_TYPES.NightShift) => {
    return service === SERVICE.IMC
      ? this.imc.length > 0
      : this.er.filter((f) => f.shiftType === shiftType).length > 0;
  };

  assignShiftToUser = (
    user: User,
    service: SERVICE,
    shiftType: SHIFT_TYPES = SHIFT_TYPES.NightShift
  ): User => {
    // check that we passed an accepted shiftType if it is the weekend
    if (
      !this.isWeekDay &&
      service === SERVICE.ER &&
      shiftType === SHIFT_TYPES.NightShift
    )
      throw Error(`its weekend we can only accept znf or zns`);

    // if it the weekday accept only the fullshift
    if (this.isWeekDay && shiftType !== SHIFT_TYPES.NightShift) {
      shiftType = SHIFT_TYPES.NightShift;
    }

    const shift: SHIFT = {
      user,
      shiftType,
      service,
      isWeekDay: this.isWeekDay,
      dateId: this.id,
    };
    const validateUser = user.validateShift(service, shiftType, this.isWeekDay);
    if (validateUser !== true) throw Error(`${validateUser}`);
    // did we assign someone here ?
    if (this.isFull(service, shiftType))
      throw Error(`This place is full for this day ${shift.shiftType}`);

    if (service === SERVICE.IMC) {
      this.imc.push(shift);
    } else {
      this.er.push(shift);
    }

    user.addShift(shift);
    return user;
  };

  toString = (): string => this.date.toString();

  isPreviousDayWeekDay = (minus = 1): boolean => {
    const newDate = this.date.clone();
    newDate.subtract(minus, "day");
    return this.isDateAWeekDay(newDate);
  };

  getPreviousDateIDS = (minus = 1): string => {
    const newDate = this.date.clone();
    newDate.subtract(minus, "days");
    return this.getID(newDate);
  };

  getID = (date: Moment): string => date.format("DD-MM-YYYY");
}
