import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="project-searchbar"
export default class extends Controller {
    static targets = ["projectSearchbarInput", "projectList"];
    declare readonly projectSearchbarInputTarget: HTMLInputElement;
    declare readonly projectListTarget: HTMLDivElement;
    declare readonly projectListTargets: HTMLDivElement[];
    projectList: unknown[] = [];
    filteredProjects: unknown[] = [];
    isOpen: boolean = false;
    isClosed: boolean = true;

    connect(): void {
        document.addEventListener("pointerdown", this.checkIfOutsideClick.bind(this));
        this.projectSearchbarInputTarget.addEventListener("focus", () => this.projectSearchbarInputTarget.select());
        this.getUserProjects();
    }
    open() {
        if(this.isOpen) return
        this.projectListTarget.classList.remove("hidden");
        this.projectSearchbarInputTarget.classList.remove("rounded-lg");
        this.projectSearchbarInputTarget.classList.add("rounded-t-lg", "border-b-0");
        this.projectListTarget.classList.add("dropdown-expanded");
        this.projectListTarget.classList.remove("dropdown-hidden");
        this.isOpen = true;
        this.isClosed = false;
    }

    search(event: Event & { target: HTMLInputElement; }) {

        this.filter(event.target.value);
        this.open();

        if (this.filteredProjects.length === 0) {
            this.projectListTarget.replaceChildren(this.makeInfo('No projects matching this name'));
            return;
        }

        const nodes = this.filteredProjects.map((project) => {
            const div = document.createElement('div');
            div.className = "w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer";
            div.textContent = project.name;
            div.addEventListener("pointerdown", () => {
                this.close();
                this.projectSearchbarInputTarget.value = project.name;
                window.dispatchEvent(new CustomEvent("project:selected", {
                    detail: {
                        project_id: project.id,
                        project_name: project.name
                    }
                }));

            });
            return div;
        });
        this.projectListTarget.replaceChildren(...nodes);
    }

    makeInfo(text: string) {
        const div = document.createElement("div");
        const divInfo = document.createElement("p")
        const newProjectButton = document.createElement('button');

        divInfo.className = "p-2"
        divInfo.textContent = text

        newProjectButton.className = "w-full text-left p-2  dark:bg-gray-600 cursor-pointer";
        newProjectButton.textContent = "➕ Add new project"
        newProjectButton.setAttribute("data-modal-target", "newProject")
        newProjectButton.setAttribute("data-action", "click->modal#open")

        div.className = "text-sm text-muted-foreground divide-y-1 flex flex-col p-2 justify-around";
        div.appendChild(divInfo)
        div.appendChild(newProjectButton)
        return div;
    }

    somethingDynamic() {
        console.log('dynamic')
    }
    filter(phrase: string) {
        const phraseLower = phrase.toLowerCase();
        this.filteredProjects = this.projectList.filter((project) => (project.name.toLowerCase().includes(phraseLower)));
    }

    async getUserProjects() {
        const res = await fetch('api/projects');
        const data = await res.json();
        this.projectList = data;
        this.filteredProjects = data;
    }

    checkIfOutsideClick(e: Event) {
        const target = e.target as Node;
        if (!this.element.contains(target)) {
            this.close();
        }

    }
    close() {
        if (this.isClosed) return;
        this.filteredProjects = [];
        this.projectSearchbarInputTarget.classList.remove("rounded-t-lg", "border-b-0");
        this.projectSearchbarInputTarget.classList.add('rounded-lg');
        this.projectListTarget.classList.remove("dropdown-expanded");
        this.projectListTarget.classList.add("dropdown-hidden");
        this.isClosed = true;
        this.isOpen = false;
    }
}
