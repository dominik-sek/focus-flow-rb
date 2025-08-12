class ProjectController < ApplicationController
  before_action :authenticate_user!

  def index
    @projects = Project.where(user_id: session[:current_user_id])
  end

  def all_users_projects
    @projects = Project.where(user_id: session[:current_user_id])
    render json: @projects, status: :ok
  end

  def hours_per_project
    today_range = Time.zone.now.beginning_of_day..Time.zone.now.end_of_day

    time_entries = TimeEntry
      .where(user_id: session[:current_user_id])
      .where(created_at: today_range)
      .left_joins(:project)
      .group("projects.id", "projects.name")
      .select("projects.name, COALESCE(SUM(time_entries.duration), 0) AS duration")

    result = time_entries.map do |entry|
      {
        name: entry.name || "No project",
        duration: entry.duration.to_i
      }
    end
    render json: result, status: :ok
  end

  def create
    attrs = project_params
    attrs[:user_id] = session[:current_user_id]
    @project = Project.create(attrs)
    if @project.save
      render json: @project, status: :created
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
  end

  def update
  end

  private
    def project_params
      params.require(:project).permit(:name)
    end
end
