import FullList from "../model/FullList";

interface AnalyticsBoard {
  totalCountSpan: HTMLSpanElement;
  completedBar: HTMLProgressElement;
  pendingBar: HTMLProgressElement;
  barHigh: HTMLDivElement;
  barMid: HTMLDivElement;
  barNormal: HTMLDivElement;
  renderCount(fullList: FullList): void;
  renderProgressBar(fullList: FullList): void;
  renderGraphBars(fullList: FullList): void;
}

export default class AnalyticsTemplate implements AnalyticsBoard {
  totalCountSpan: HTMLSpanElement;
  completedBar: HTMLProgressElement;
  pendingBar: HTMLProgressElement;
  barHigh: HTMLDivElement;
  barMid: HTMLDivElement;
  barNormal: HTMLDivElement;

  static instance = new AnalyticsTemplate();

  private constructor() {
    this.totalCountSpan = document.getElementById(
      "totalTasksCount"
    ) as HTMLSpanElement;

    this.completedBar = document.getElementById(
      "completedBar"
    ) as HTMLProgressElement;

    this.pendingBar = document.getElementById(
      "pendingBar"
    ) as HTMLProgressElement;

    this.barHigh = document.getElementById("barHigh") as HTMLDivElement;
    this.barMid = document.getElementById("barMid") as HTMLDivElement;
    this.barNormal = document.getElementById("barNormal") as HTMLDivElement;
  }

  renderCount(fullList: FullList): void {
    this.totalCountSpan.innerHTML = `
    ${fullList.list.length} 
    <i class="fa-solid fa-cubes-stacked"></i>`;
  }

  renderProgressBar(fullList: FullList): void {
    const totalTasks = fullList.list.length;
    const completedTasks = fullList.list.filter((task) => task.checked).length;
    const pendingTasks = totalTasks - completedTasks;

    let completedPercentage = (completedTasks / totalTasks) * 100;
    let pendingPercentage = 100 - completedPercentage;

    if (completedPercentage === 100) {
      completedPercentage = 80;
      pendingPercentage = 0;
    } else if (pendingPercentage === 100) {
      pendingPercentage = 80;
      completedPercentage = 0;
    } else {
      completedPercentage -= 10;
      pendingPercentage -= 10;
    }

    if (totalTasks === 0) {
      this.completedBar.classList.add("list__empty");
      this.pendingBar.classList.add("list__empty");
    } else {
      this.completedBar.classList.remove("list__empty");
      this.pendingBar.classList.remove("list__empty");
    }

    // Set Completed Progress Bar
    this.completedBar.setAttribute("max", totalTasks.toString());
    this.completedBar.setAttribute("value", completedTasks.toString());
    this.completedBar.setAttribute("data-count", completedTasks.toString());
    this.completedBar.style.setProperty(
      "--progress-bar",
      completedPercentage + "%"
    );

    // Set Pending Progress Bar
    this.pendingBar.setAttribute("max", totalTasks.toString());
    this.pendingBar.setAttribute("value", pendingTasks.toString());
    this.pendingBar.setAttribute("data-count", pendingTasks.toString());
    this.pendingBar.style.setProperty(
      "--progress-bar",
      pendingPercentage + "%"
    );
  }

  renderGraphBars(fullList: FullList): void {
    const totalTasks = fullList.list.length;

    // Getting tasks count based on priority
    const highTasksCount = fullList.list.filter(
      (task) => task.priority === "high"
    ).length;

    const midTasksCount = fullList.list.filter(
      (task) => task.priority === "mid"
    ).length;

    const normalTasksCount = fullList.list.filter(
      (task) => task.priority === "normal"
    ).length;

    // Setting Height of respective Bars
    if (totalTasks === 0) {
      this.barHigh.style.height = "0px";
      this.barMid.style.height = "0px";
      this.barNormal.style.height = "0px";
    } else {
      this.barHigh.style.height = (highTasksCount / totalTasks) * 50 + "px";
      this.barMid.style.height = (midTasksCount / totalTasks) * 50 + "px";
      this.barNormal.style.height = (normalTasksCount / totalTasks) * 50 + "px";
    }

    this.barHigh.setAttribute("data-value", highTasksCount.toString());
    this.barMid.setAttribute("data-value", midTasksCount.toString());
    this.barNormal.setAttribute("data-value", normalTasksCount.toString());
  }

  render(fullList: FullList): void {
    this.renderCount(fullList);
    this.renderProgressBar(fullList);
    this.renderGraphBars(fullList);
  }
}
