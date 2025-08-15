import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="project-searchbar"
export default class extends Controller {
    static targets = ["projectSearchbarInput", "projectList"]
    declare readonly projectSearchbarInputTarget: HTMLInputElement
    declare readonly projectListTarget: HTMLDivElement
    declare readonly projectListTargets: HTMLDivElement[]
    projectList: unknown[] = []
    filteredProjects: unknown[] = []

    connect(): void {
        document.addEventListener("click", this.checkIfOutsideClick.bind(this))
        this.getUserProjects()
    }
    search(event: Event & { target: HTMLInputElement }) {

        this.filterProjectList(event.target.value)
        this.projectListTarget.classList.remove("hidden")

        if (this.filteredProjects.length === 0) {
            this.projectListTarget.replaceChildren(this.makeInfo('No projects matching this name'))
            return;
        }

        const nodes = this.filteredProjects.map((project) => {
            const div = document.createElement('div')
            div.className = "p-1"
            div.textContent = project.name
            div.addEventListener("click", () => {
                this.close()
                this.projectSearchbarInputTarget.value = project.name
                window.dispatchEvent(new CustomEvent("project:selected", {
                    detail: {
                        project_id: project.id,
                        project_name: project.name
                    }
                }))

            })
            return div
        })
        this.projectListTarget.replaceChildren(...nodes)
    }

    makeInfo(text: string) {
        const div = document.createElement("div")
        div.className = "p-2 text-sm text-muted-foreground"
        div.textContent = text
        return div
    }

    filterProjectList(phrase: string) {
        this.filteredProjects = this.projectList.filter((project) => (project.name.toLowerCase().includes(phrase.toLowerCase())))
    }

    async getUserProjects() {
        const res = await fetch('api/projects')
        const data = await res.json()
        this.projectList = data
        this.filteredProjects = data
    }
    checkIfOutsideClick(e: Event) {
        const target = e.target as Node
        if (!this.element.contains(target)) {
            this.close()
        }

    }
    close() {
        this.filteredProjects = []
        this.projectListTarget.classList.add("hidden")
        // console.log('closing')
    }



}