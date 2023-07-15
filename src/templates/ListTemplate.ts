import FullList from "../model/FullList";
import AnalyticsTemplate from "./AnalyticsTemplate";
import moment from "moment";

interface DOMList {
  pendingList: HTMLUListElement;
  completedList: HTMLUListElement;
  clear(): void;
  render(
    fullList: FullList,
    analytics: AnalyticsTemplate,
    dateValue: string
  ): void;
  isEmpty(list: HTMLUListElement, message: string): void;
}

export default class ListTemplate implements DOMList {
  pendingList: HTMLUListElement;
  completedList: HTMLUListElement;

  static instance: ListTemplate = new ListTemplate();

  private constructor() {
    this.pendingList = document.getElementById(
      "pendingList"
    ) as HTMLUListElement;
    this.completedList = document.getElementById(
      "completedList"
    ) as HTMLUListElement;
  }

  isEmpty(list: HTMLUListElement, message: string): void {
    if (list.innerHTML === "") {
      list.innerHTML = `<li class="empty-list__message">${message}</li>`;
    }
  }

  clear(): void {
    this.pendingList.innerHTML = "";
    this.completedList.innerHTML = "";
  }

  render(
    fullList: FullList,
    analytics: AnalyticsTemplate,
    dateValue: string
  ): void {
    this.clear();

    fullList.list.forEach((item) => {
      const itemDate = moment(item.date).format("MMM D");

      if (dateValue === itemDate) {
        const li = document.createElement("li") as HTMLLIElement;
        li.className = `list-item ${item.checked ? "done" : item.priority}`;

        //   Adding checkbox
        const check = document.createElement("input") as HTMLInputElement;
        check.className = "list-item__check";
        check.type = "checkbox";
        check.id = item.id;
        check.tabIndex = 0;
        check.checked = item.checked;
        li.append(check);

        check.addEventListener("change", () => {
          item.checked = !item.checked;
          fullList.save();
          analytics.renderProgressBar(fullList);
          this.render(fullList, analytics, moment(item.date).format("MMM D"));
          this.isEmpty(this.completedList, "0 Completed Tasks");
          this.isEmpty(this.pendingList, "0 Pending Tasks");
        });

        //   Adding Title
        const label = document.createElement("label") as HTMLLabelElement;
        label.className = "list-item__title";
        label.textContent = item.title;
        label.htmlFor = item.id;
        li.append(label);

        //   Adding delete Button
        const button = document.createElement("button") as HTMLButtonElement;
        button.className = "list-item__delete-btn";
        button.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`;
        li.append(button);

        button.addEventListener("click", () => {
          fullList.removeItem(item.id);
          analytics.render(fullList);
          this.render(fullList, analytics, moment(item.date).format("MMM D"));
          this.isEmpty(this.completedList, "0 Completed Tasks");
          this.isEmpty(this.pendingList, "0 Pending Tasks");
        });

        if (!item.checked) {
          this.pendingList.append(li);
        } else {
          this.completedList.append(li);
        }
      }
    });

    this.isEmpty(this.completedList, "0 Completed Tasks");
    this.isEmpty(this.pendingList, "0 Pending Tasks");
  }
}
