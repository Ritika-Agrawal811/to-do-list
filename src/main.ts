import "./css/style.css";
import FullList from "./model/FullList";
import ListItem from "./model/ListItem";
import ListTemplate from "./templates/ListTemplate";
import AnalyticsTemplate from "./templates/AnalyticsTemplate";
import DateTemplate from "./templates/DateTemplate";
import moment from "moment";

const displayFormModalHandler = (formModal: HTMLDivElement): void => {
  formModal.classList.add("show");
};

const hideFormModalHandler = (formModal: HTMLDivElement): void => {
  formModal.classList.remove("show");
};

// Loading App Function
const loadAppHandler = (
  fullList: FullList,
  dateTemplate: DateTemplate,
  template: ListTemplate,
  analytics: AnalyticsTemplate
): void => {
  fullList.load();
  dateTemplate.setDate();
  template.render(fullList, analytics, moment().format("MMM D"));
  analytics.render(fullList);
};

const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;
  const analytics = AnalyticsTemplate.instance;
  const dateTemplate = DateTemplate.instance;

  // Initial Loading and Rendering of Data
  loadAppHandler(fullList, dateTemplate, template, analytics);

  const addTaskButton = document.getElementById(
    "addTaskButton"
  ) as HTMLButtonElement;

  const formModal = document.getElementById(
    "addTaskFormModal"
  ) as HTMLDivElement;

  // Handle light-dark mode
  const themeContainer = document.getElementById(
    "themeContainer"
  ) as HTMLDivElement;

  let isThemeSelected = false;
  themeContainer.addEventListener("click", () => {
    const sunIcon = themeContainer.querySelector(".fa-sun") as HTMLElement;
    const moonIcon = themeContainer.querySelector(".fa-moon") as HTMLElement;

    if (!isThemeSelected) {
      document.body.setAttribute("theme", "dark");
      sunIcon.classList.add("hide");
      moonIcon.classList.remove("hide");
      isThemeSelected = true;
    } else {
      document.body.setAttribute("theme", "light");
      sunIcon.classList.remove("hide");
      moonIcon.classList.add("hide");
      isThemeSelected = false;
    }
  });

  // Set Click Event Listener on Date Cards
  const dateCardsArray = Array.from(
    document.getElementsByClassName("calendar__date-card")
  );

  let previousDateCard = document.querySelector(".active") as HTMLDivElement;
  let currentDateCard: HTMLDivElement;

  dateCardsArray.forEach((dateCard) => {
    dateCard.addEventListener("click", (event): void => {
      currentDateCard = event.currentTarget as HTMLDivElement;
      let dateValue = currentDateCard.getAttribute("data-value") as string;

      previousDateCard.classList.remove("active");
      currentDateCard.classList.add("active");
      previousDateCard = currentDateCard;

      template.render(fullList, analytics, dateValue);
    });
  });

  // Displaying Add Task Form
  addTaskButton.addEventListener("click", (): void => {
    displayFormModalHandler(formModal);

    // Set focus on title textbox
    const titleInput = formModal.querySelector(
      "#taskTitle"
    ) as HTMLInputElement;
    titleInput.focus();

    // Set Date Range
    const dateInput = formModal.querySelector("#taskDate") as HTMLInputElement;
    dateTemplate.setDateRange(dateInput);

    // Adding click event on Form Cancel Button
    const cancelBtn = formModal.querySelector(
      "#cancelBtn"
    ) as HTMLButtonElement;

    cancelBtn.addEventListener("click", (): void => {
      hideFormModalHandler(formModal);
    });
  });

  const addTaskForm = document.getElementById("addTaskForm") as HTMLFormElement;

  // Add New Task
  addTaskForm.addEventListener("submit", (event: SubmitEvent): void => {
    event.preventDefault();

    // Get date of New Task
    const dateInput = formModal.querySelector("#taskDate") as HTMLInputElement;
    const taskDate = dateInput.valueAsDate || new Date();

    // Getting title of New Task
    const titleInput = formModal.querySelector(
      "#taskTitle"
    ) as HTMLInputElement;
    const taskTitle = titleInput.value.trim();
    titleInput.value = "";
    if (!taskTitle) return;

    // Calculating ID for New Task
    const arrayID: number[] = fullList.list.map((task) => parseInt(task.id));
    const taskID: number = fullList.list.length ? Math.max(...arrayID) + 1 : 1;

    // Getting priority of New Task
    const priorityRadio = formModal.querySelector(
      "input[name='priority']:checked"
    ) as HTMLInputElement;
    const taskPriority: string = priorityRadio.value;

    // Creating the new Task Object
    const newTask = new ListItem(
      taskID.toString(),
      taskTitle,
      taskPriority,
      taskDate
    );

    // Highlight Selected Date
    const selectedDate = moment(taskDate).format("MMM D");
    currentDateCard = document.querySelector(
      `.calendar__date-card[data-value="${selectedDate}"]`
    ) as HTMLDivElement;
    previousDateCard.classList.remove("active");
    currentDateCard.classList.add("active");
    previousDateCard = currentDateCard;

    fullList.addItem(newTask);
    template.render(fullList, analytics, moment(taskDate).format("MMM D"));
    analytics.render(fullList);
    hideFormModalHandler(formModal);
  });
};

document.addEventListener("DOMContentLoaded", initApp);
