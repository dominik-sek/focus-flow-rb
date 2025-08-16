import { Controller } from "@hotwired/stimulus";
import dayjs, { OpUnitType } from "dayjs";
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

  connect() {
    const url = new URL(window.location.href);
    this.setUrlToMatchRange(false,"day")
    this.setActiveByName(url.searchParams.get("range") || "today");
    this.emitRange(url.searchParams.get("range") || "today")
    this.fromDateInputTarget.value = dayjs().startOf("day").format('YYYY-MM-DD')
    this.toDateInputTarget.value = dayjs().endOf("day").format('YYYY-MM-DD')
  }

  setFromDate(event: Event & { target: HTMLInputElement }) {
    this.fromDate = event.target.value;
    if (!this.toDate) this.toDate = new Date().toISOString().split("T")[0];
    this.setUrlToMatchRange(true)
  }

  setToDate(event: Event & { target: HTMLInputElement }) {
    this.toDate = event.target.value;
    if (!this.fromDate) this.fromDate = new Date().toISOString().split("T")[0];
    this.setUrlToMatchRange(true)
  }

  parseRangeToDate(range: string) {
    switch (range) {
      case "today":
        this.setUrlToMatchRange(false,"day")
        break;
      case "this_week":
        this.setUrlToMatchRange(false,"week")
        break;
      case "this_month":
        this.setUrlToMatchRange(false,"month")
        break;
      default:
        console.error("wtf?");
    }
  }
  setUrlToMatchRange(isCustom: boolean, range?: OpUnitType) {

    if (isCustom) {
      const url = new URL(window.location.href);
      url.searchParams.set("date_from", this.fromDate);
      url.searchParams.set("date_to", this.toDate);
      window.history.replaceState({}, "", url);
      this.emitRange("custom");
      this.updateExportLink()
      return;
    }

    if (!range) return;
    const url = new URL(window.location.href);
    url.searchParams.set("date_from", dayjs().startOf(range).format(this.DATE_FORMAT_API));
    url.searchParams.set("date_to", dayjs().endOf(range).format(this.DATE_FORMAT_API));
    this.fromDateInputTarget.value = dayjs().startOf(range).format(this.DATE_FORMAT_INPUT)
    this.toDateInputTarget.value = dayjs().endOf(range).format(this.DATE_FORMAT_INPUT)
    window.history.replaceState({}, "", url);


    this.updateExportLink()
  }

  changeFilter(event: Event & { target: HTMLButtonElement }) {
    const btn = event.currentTarget || event.target.closest("button");
    if (!btn) return;
    const range = btn.dataset.filter;
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

  emitRange(range) {
    window.dispatchEvent(
      new CustomEvent("reportFilter:change", {
        detail: { filter: range },
        bubbles: false,
      })
    );
  }

  setActive(buttonEl: HTMLButtonElement) {
    this.filterButtonTargets.forEach((el: HTMLButtonElement) => {
      el.dataset.active = "false";
      el.disabled = false
      el.setAttribute("aria-pressed", "false");
    });
    buttonEl.disabled = true
    buttonEl.dataset.active = "true";
    buttonEl.setAttribute("aria-pressed", "true");
  }

  updateExportLink() {
    const pageUrl = new URL(window.location.href)
    const exportUrl = new URL(this.exportLinkTarget.href, window.location.origin)
    exportUrl.search = pageUrl.search
    this.exportLinkTarget.href = exportUrl.toString()
  }
}
