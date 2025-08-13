import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="project-select"
export default class extends Controller {
  static targets = ["projectSelect"]

  connect() {
    this.get()
    this.projectSelectTarget.addEventListener("change", (event) => this.handleChange(event))
  }

  async get() {

    await fetch('/api/projects')
      .then(async (res) => {
        if (res.ok) {
          const projects = await res.json()

          if (projects.length === 0) {
            const noProjectOption = document.createElement("option");
            noProjectOption.value = "";
            noProjectOption.defaultSelected = true
            noProjectOption.textContent = "No project";
            this.projectSelectTarget.appendChild(noProjectOption);
            return;
          }

          this.projectSelectTarget.innerHTML += projects.map((project) => this.optionsBuilder(project));
        }
      })
      .catch(err => {
        console.error("error: ", err)
        return null
      })
  }

  optionsBuilder(project) {
    return `
      <option value=${project.id}>${project.name}</option>
      `
  }

  handleChange(event) {
    const selected = event.target.value
    if (selected === "new") {
      const name = prompt("Enter the name of your new project:")
      if (name) {
        this.createProject(name)
      } else {
        this.projectSelectTarget.value = ""
      }
    } else {
      const projectName = event.target.options[event.target.selectedIndex].textContent;
      const projectId = selected;
      window.dispatchEvent(new CustomEvent("project:selected", {
        detail: {
          id: projectId,
          name: projectName
        }
      }));
    }
  }

  async createProject(name) {
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ project: { name } })
      })

      if (!res.ok) throw new Error("Failed to create project")
      const project = await res.json()

      const option = document.createElement("option")
      option.value = project.id
      option.textContent = project.name
      this.projectSelectTarget.appendChild(option)
      this.projectSelectTarget.value = project.id
      window.dispatchEvent(new CustomEvent("toast:show", {
        detail: {
          message: "Project created!",
          type: "success",
          duration: 3000
        }
      }))
      window.dispatchEvent(new CustomEvent("project:selected", {
        detail: {
          id: project.id,
          name: project.name
        }
      }));

    } catch (err) {
      alert("Error creating project.")
      console.error(err)
    }
  }

}
