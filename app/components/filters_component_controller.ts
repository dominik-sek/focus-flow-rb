import { Controller } from "@hotwired/stimulus";
import dayjs from "dayjs";
export default class extends Controller {
  static targets = ["filterButton", "fromDateInput", "toDateInput", "exportLink"];
  declare readonly filterButtonTarget: HTMLButtonElement
  declare readonly fromDateInputTarget: HTMLButtonElement
  declare readonly toDateInputTarget: HTMLButtonElement
  declare readonly exportLinkTarget: HTMLLinkElement

  DATE_FORMAT_API = "YYYY-MM-DD HH:MM:SS"
  DATE_FORMAT_INPUT = "YYYY-MM-DD"
  fromDate = "";
  toDate = "";

  updateExportLink(){
    const pageUrl = new URL(window.location.href)
    const exportUrl = new URL(this.exportLinkTarget.href, window.location.origin)
    exportUrl.search = pageUrl.search
    this.exportLinkTarget.href = exportUrl.toString()
  }
  connect() {
    const url = new URL(window.location.href);
    const hasAny =
      url.searchParams.get("date_from") || url.searchParams.get("date_to");
    if (!hasAny) {
      url.searchParams.set("date_from", dayjs().startOf("day").format(this.DATE_FORMAT_API));
      url.searchParams.set("date_to", dayjs().endOf("day").format(this.DATE_FORMAT_API));

      window.history.replaceState({}, "", url);
    }
    this.setActiveByName(url.searchParams.get("range") || "today");
    this.emitRange(url.searchParams.get("range") || "today");
    this.fromDateInputTarget.value = dayjs().startOf("day").format('YYYY-MM-DD')
    this.toDateInputTarget.value = dayjs().endOf("day").format('YYYY-MM-DD')
  }

  setFromDate(event:Event & { target: HTMLInputElement}) {
    this.fromDate = event.target.value;
    if (!this.toDate) this.toDate = new Date().toISOString().split("T")[0];
    this.writeCustomRange();
  }

  setToDate(event:Event & { target: HTMLInputElement}) {
    this.toDate = event.target.value;
    if (!this.fromDate) this.fromDate = new Date().toISOString().split("T")[0];
    this.writeCustomRange();
  }
  rangeToUrlMapper(){

  }

  parseRangeToDate(range: string) {
    const url = new URL(window.location.href);
    switch (range) {
      case "today":
        url.searchParams.set("date_from", dayjs().startOf("day").format('YYYY-MM-DD HH:mm:ss'));
        url.searchParams.set("date_to", dayjs().endOf("day").format('YYYY-MM-DD HH:mm:ss'));
        this.fromDateInputTarget.value = dayjs().startOf("day").format('YYYY-MM-DD')
        this.toDateInputTarget.value = dayjs().endOf("day").format('YYYY-MM-DD')
        window.history.replaceState({}, "", url);
        this.updateExportLink()

        break;
      case "this_week":
        url.searchParams.set("date_from", dayjs().startOf("week").format('YYYY-MM-DD HH:mm:ss'));
        url.searchParams.set("date_to", dayjs().endOf("week").format('YYYY-MM-DD HH:mm:ss'));
        this.fromDateInputTarget.value = dayjs().startOf("week").format('YYYY-MM-DD')
        this.toDateInputTarget.value = dayjs().endOf("week").format('YYYY-MM-DD')
        window.history.replaceState({}, "", url);
        this.updateExportLink()

        break;
      case "this_month":
        url.searchParams.set("date_from", dayjs().startOf("month").format('YYYY-MM-DD HH:mm:ss'));
        url.searchParams.set("date_to", dayjs().endOf("month").format('YYYY-MM-DD HH:mm:ss'));
        this.fromDateInputTarget.value = dayjs().startOf("month").format('YYYY-MM-DD')
        this.toDateInputTarget.value = dayjs().endOf("month").format('YYYY-MM-DD')
        window.history.replaceState({}, "", url);
        this.updateExportLink()

        break;
      default:
        console.error("wtf?");
    }
  }
  changeFilter(event: Event & {target: HTMLButtonElement}) {
    const btn = event.currentTarget || event.target.closest("button");
    if (!btn) return;
    const range = btn.dataset.filter;
    console.log(range)
    this.parseRangeToDate(range);

    this.setActiveByName(range);
    this.emitRange(range);
  }

  setActiveByName(name) {
    const btn = this.filterButtonTargets.find(
      (el) => el.dataset.filter === name
    );
    if (btn) {
      this.setActive(btn);
    }
  }

  writeCustomRange() {
    const url = new URL(window.location.href);
    url.searchParams.set("date_from", this.fromDate);
    url.searchParams.set("date_to", this.toDate);
    window.history.replaceState({}, "", url);
    this.emitRange("custom");
    this.updateExportLink()
  }

  emitRange(range) {
    window.dispatchEvent(
      new CustomEvent("reportFilter:change", {
        detail: { filter: range },
        bubbles: false,
      })
    );
  }

  setActive(buttonEl) {
    this.filterButtonTargets.forEach((el) => {
      el.dataset.active = "false";
      el.setAttribute("aria-pressed", "false");
    });
    buttonEl.dataset.active = "true";
    buttonEl.setAttribute("aria-pressed", "true");
  }
}
