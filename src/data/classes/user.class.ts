import { SERVICE, SHIFT_TYPES } from "../types/enums";
import type { SHIFT } from "../types/types";
import type { DayModel } from "./day.class";
import _ from "lodash";
export class User {
  constructor(public userID, public service: SERVICE, public stelle = 1) {}

  rules = () => {
    let maxWeekShifts = 4;
    let maxWeekEndShifts = 2;
    if (this.stelle < 1) {
      maxWeekShifts = 2;
      maxWeekEndShifts = 1;
    }
    if (this.stelle == 0) {
      maxWeekShifts = 0;
      maxWeekEndShifts = 0;
    }
    return {
      maxWeekShifts,
      maxWeekEndShifts,
    };
  };

  validateShiftCounts = (
    service: SERVICE,
    _: SHIFT_TYPES,
    isWeekDay: boolean
  ): boolean | string => {
    const x = this.shifts.filter(
      (f) => service == f.service && f.isWeekDay == isWeekDay
    ).length;
    const validate = isWeekDay
      ? x < this.rules().maxWeekShifts
      : x < this.rules().maxWeekEndShifts;
    return validate
      ? validate
      : `The user ${this.userID} has maxed out his shift days`;
  };

  validateService = (service: SERVICE): boolean | string => {
    const validate = service === this.service;
    return validate
      ? validate
      : `You are trying to assing a ${service} to ${this.userID} who only works at ${this.service}`;
  };

  validateShiftType = (
    service: SERVICE,
    shiftType: SHIFT_TYPES,
    _: boolean
  ): boolean | string => {
    const validate =
      service === SERVICE.IMC ? shiftType === SHIFT_TYPES.NightShift : true;
    return validate
      ? validate
      : `Users who works at ${service} can only have Full shifts`;
  };

  middleWares = [
    this.validateService,
    this.validateShiftType,
    this.validateShiftCounts,
  ];

  validateShift = (
    service: SERVICE,
    shiftType: SHIFT_TYPES,
    isWeekDay: boolean
  ): boolean | string => {
    const results = _.map(this.middleWares, (middle) =>
      middle(service, shiftType, isWeekDay)
    );
    const isValid = _.every(results, (result) => result === true);

    return isValid ? true : results.filter((f) => f !== true)[0];
  };

  addShift = (shift: SHIFT): void => {
    this.shifts.push(shift);
  };

  get shiftCounts(): { week: string; weekEnd: string } {
    const rule = this.rules();
    return {
      week: `${this.getShiftsCounts(true)}/${rule.maxWeekShifts}`,
      weekEnd: `${this.getShiftsCounts(false)}/${rule.maxWeekEndShifts}`,
    };
  }

  hasFullShifts(isWeekDay: boolean): boolean {
    const max = isWeekDay
      ? this.rules().maxWeekShifts
      : this.rules().maxWeekEndShifts;
    return this.getShiftsCounts(isWeekDay) >= max;
  }

  hasShiftInRow(day: DayModel, shiftCount = 4): boolean {
    // Check if 4 in a rows;
    const prevDateIDS = _.range(1, shiftCount + 3).map((f) =>
      day.getPreviousDateIDS(f)
    );

    const shiftIDS = this.shifts.map((f) => f.dateId);
    const hasFourInARow = _.every(prevDateIDS, (prevId) =>
      shiftIDS.includes(prevId)
    );

    return hasFourInARow;

    // Check if previous day is weekend and has a shift there
    // const isPrevDayWeekDay = day.isPreviousDayWeekDay();
    // const prevDayId = day.getPreviousDateIDS(1);

    // // If he has a shift in the prev day and the prev is a weekend return true
    // return isPrevDayWeekDay
    //   ? false
    //   : shiftIDS.filter((f) => f === prevDayId).length > 0 &&
    //       this.service === SERVICE.IMC;
  }

  private getShiftsCounts = (isWeekDay = true) => {
    return this.getShifts(isWeekDay).length;
  };

  private getShifts = (isWeekDay = true): SHIFT[] => {
    return this.shifts.filter((f) => f.isWeekDay === isWeekDay);
  };

  shifts: SHIFT[] = [];
}
