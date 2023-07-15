export interface Item {
  id: string;
  title: string;
  checked: boolean;
  priority: string;
  date: Date;
}

export default class ListItem implements Item {
  constructor(
    private _id: string = "",
    private _title: string = "",
    private _priority: string = "normal",
    private _date: Date = new Date(),
    private _checked: boolean = false
  ) {}

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get checked(): boolean {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
  }

  get priority(): string {
    return this._priority;
  }

  set priority(priority: string) {
    this._priority = priority;
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date) {
    this._date = date;
  }
}
