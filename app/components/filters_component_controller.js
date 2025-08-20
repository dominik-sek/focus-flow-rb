import { Controller } from "@hotwired/stimulus";
import dayjs from "dayjs";
export default class extends Controller {
  static targets = ["filterButton", "fromDateInput", "toDateInput"];
  fromDate = null;
  toDate = null;

  connect() {
    const url = new URL(window.location.href);
    const hasAny =
      url.searchParams.get("date_from") || url.searchParams.get("date_to");
    if (!hasAny) {
      url.searchParams.set(
        "date_from",
        dayjs().startOf("day").format("YYYY-MM-DD HH:MM:SS")
      );
      url.searchParams.set(
        "date_to",
        dayjs().endOf("day").format("YYYY-MM-DD HH:MM:SS")
      );

      window.history.replaceState({}, "", url);
    }
    this.setActiveByName(url.searchParams.get("range") || "today");
    this.emitRange(url.searchParams.get("range") || "today");
    this.fromDateInputTarget.value = dayjs()
      .startOf("day")
      .format("YYYY-MM-DD");
    this.toDateInputTarget.value = dayjs().endOf("day").format("YYYY-MM-DD");
  }

  setFromDate(event) {
    this.fromDate = event.target.value;
    if (!this.toDate) this.toDate = new Date().toISOString().split("T")[0];
    this.writeCustomRange();
  }

  setToDate(event) {
    this.toDate = event.target.value;
    if (!this.fromDate) this.fromDate = new Date().toISOString().split("T")[0];
    this.writeCustomRange();
  }
  parseRangeToDate(range) {
    const url = new URL(window.location.href);
    switch (range) {
      case "today":
        url.searchParams.set(
          "date_from",
          dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss")
        );
        url.searchParams.set(
          "date_to",
          dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
        );
        this.fromDateInputTarget.value = dayjs()
          .startOf("day")
          .format("YYYY-MM-DD");
        this.toDateInputTarget.value = dayjs()
          .endOf("day")
          .format("YYYY-MM-DD");
        window.history.replaceState({}, "", url);

        break;
      case "this_week":
        url.searchParams.set(
          "date_from",
          dayjs().startOf("week").format("YYYY-MM-DD HH:mm:ss")
        );
        url.searchParams.set(
          "date_to",
          dayjs().endOf("week").format("YYYY-MM-DD HH:mm:ss")
        );
        this.fromDateInputTarget.value = dayjs()
          .startOf("week")
          .format("YYYY-MM-DD");
        this.toDateInputTarget.value = dayjs()
          .endOf("week")
          .format("YYYY-MM-DD");
        window.history.replaceState({}, "", url);

        break;
      case "this_month":
        url.searchParams.set(
          "date_from",
          dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss")
        );
        url.searchParams.set(
          "date_to",
          dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss")
        );
        this.fromDateInputTarget.value = dayjs()
          .startOf("month")
          .format("YYYY-MM-DD");
        this.toDateInputTarget.value = dayjs()
          .endOf("month")
          .format("YYYY-MM-DD");
        window.history.replaceState({}, "", url);

        break;
      default:
        console.error("wtf?");
    }
  }
  changeFilter(event) {
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

  writeCustomRange() {
    const url = new URL(window.location.href);
    url.searchParams.set("date_from", this.fromDate);
    url.searchParams.set("date_to", this.toDate);
    window.history.replaceState({}, "", url);
    this.emitRange("custom");
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
      //el.setAttribute("disabled", "false")
    });
    buttonEl.dataset.active = "true";
    buttonEl.setAttribute("aria-pressed", "true");
    //  buttonEl.setAttribute("disabled", "true")
  }
}
