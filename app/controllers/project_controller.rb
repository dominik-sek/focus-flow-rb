class ProjectController < ApplicationController
  def all_users_projects
    @projects = Project.where(user_id: session[:current_user_id])
      render json: @projects, status: :ok
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
