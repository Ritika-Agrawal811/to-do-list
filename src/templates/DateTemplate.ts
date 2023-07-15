import moment from "moment";

interface DOMDate {
  currentDate: string;
  setCurrentDate(): void;
  setWeekDate(): void;
  renderDateCards(): void;
  setDateRange(dateInput: HTMLInputElement): void;
}

export default class DateTemplate implements DOMDate {
  currentDate: string;

  static instance: DateTemplate = new DateTemplate();

  private constructor() {
    this.currentDate = moment().format("Do MMMM, dddd");
  }

  setDate(): void {
    this.setCurrentDate();
    this.setWeekDate();
    this.renderDateCards();
  }

  setDateRange(dateInput: HTMLInputElement): void {
    dateInput.setAttribute("min", moment().format("YYYY-MM-D"));
    dateInput.setAttribute("max", moment().add(6, "days").format("YYYY-MM-D"));
  }

  setCurrentDate(): void {
    const currentDateTag = document.getElementById(
      "currentDate"
    ) as HTMLTimeElement;

    currentDateTag.innerHTML = this.currentDate;
  }

  setWeekDate(): void {
    const weekDateTag = document.getElementById("weekDate") as HTMLTimeElement;
    const startDate = moment().format("Do MMMM, YYYY");
    const endDate = moment().add(6, "days").format("Do MMMM, YYYY");

    weekDateTag.innerHTML = `${startDate} - ${endDate}`;
  }

  renderDateCards(): void {
    const calendar = document.getElementById("calendar") as HTMLElement;

    for (let i = 0; i < 7; i++) {
      let dateCard = document.createElement("div") as HTMLDivElement;
      dateCard.className =
        i === 0 ? "calendar__date-card active" : "calendar__date-card";
      let current = moment().add(i, "days");

      dateCard.setAttribute("data-value", current.format("MMM D"));

      dateCard.innerHTML = `
        <h4>${current.format("ddd")}</h4>
        <span>${current.format("D")}</span>
        `;

      calendar.append(dateCard);
    }
  }
}
