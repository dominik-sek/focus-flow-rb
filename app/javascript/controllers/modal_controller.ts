import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="modal"
export default class extends Controller {

  //todo: temporary impl - implement so that modal works with custom events, listetning to modal:open and modal:close
  // right now its haard wired to projects
  static targets = ["modalParent", "projectName"];
  declare readonly projectNameTarget: HTMLInputElement;


  connect() {
    //document.addEventListener("pointerdown", this.checkIfOutsideClick.bind(this));
  }
  disconnect(): void {
  }
  open(event: CustomEvent) {
    const { name } = event.detail;
    this.projectNameTarget.value = name || "";
    this.element.classList.remove('hidden')
    this.element.classList.add('flex')
    this.projectNameTarget!.select();
  }
  close() {
    this.projectNameTarget.value = ""
    this.element.classList.add('hidden')
    this.element.classList.remove('flex')

  }
  projectNameChanged() {
  }
  checkIfOutsideClick(e: Event) {
    const target = e.target as Node;
    if (!this.element.contains(target)) {
      this.close();
    }
  }
  addNewProject() {
    let data = {
      name: this.projectNameTarget.value
    };
    fetch('/api/project', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) {
          window.dispatchEvent(new CustomEvent("toast:show", {
            detail: {
              message: "Error adding project!",
              type: "error",
              duration: 3000
            }
          }));
          this.projectNameTarget!.focus();
          throw new Error('Error adding project');
          

        }
        return res.json();
      }).then(data => {
        window.dispatchEvent(new CustomEvent("toast:show", {
          detail: {
            message: "New project added!",
            type: "success",
            duration: 3000
          }
        }));
        this.close()
      });
  }
}
