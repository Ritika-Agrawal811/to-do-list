import ListItem from "./ListItem";
import moment from "moment";

interface List {
  list: ListItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: ListItem): void;
  removeItem(id: string): void;
  sort(): void;
}

type Task = {
  _id: string;
  _title: string;
  _checked: boolean;
  _priority: string;
  _date: Date;
};

enum Priority {
  high,
  mid,
  normal,
}

export default class FullList implements List {
  static instance: FullList = new FullList();
  private constructor(private _list: ListItem[] = []) {}

  get list(): ListItem[] {
    return this._list;
  }

  load(): void {
    const storedList: string | null = localStorage.getItem("myList");
    if (typeof storedList !== "string") return;

    const parsedList: Task[] = JSON.parse(storedList);

    parsedList.forEach((item) => {
      const newListItem = new ListItem(
        item._id,
        item._title,
        item._priority,
        item._date,
        item._checked
      );
      FullList.instance.addItem(newListItem);
    });

    this.updatePreviousDayTasks();
  }

  save(): void {
    localStorage.setItem("myList", JSON.stringify(this._list));
  }

  clearList(): void {
    this._list = [];
    this.save();
  }

  addItem(itemObj: ListItem): void {
    this._list.push(itemObj);
    this.save();
    this.sort();
  }

  removeItem(id: string): void {
    this._list = this._list.filter((item) => item.id !== id);
    this.save();
  }

  updatePreviousDayTasks(): void {
    this._list.map((task) => {
      const taskDate = moment(task.date).format("MMM D");
      if (taskDate < moment().format("MMM D")) {
        if (task.checked) this.removeItem(task.id);
        task.date = new Date();
        return task;
      }
    });
  }

  sort(): void {
    this._list.sort((item1, item2): number => {
      return (
        Priority[item1.priority as keyof typeof Priority] -
        Priority[item2.priority as keyof typeof Priority]
      );
    });
  }
}
