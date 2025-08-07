# == Route Map
#
#                                   Prefix Verb   URI Pattern                                                                                       Controller#Action
#                                                 /assets                                                                                           Propshaft::Server
#                       rails_health_check GET    /up(.:format)                                                                                     rails/health#show
#                                  sign_up GET    /sign_up(.:format)                                                                                users#new
#                                          POST   /sign_up(.:format)                                                                                users#create
#                                    login GET    /login(.:format)                                                                                  sessions#new
#                                          POST   /login(.:format)                                                                                  sessions#create
#                                   logout DELETE /logout(.:format)                                                                                 sessions#destroy
#                 time_entry_current_month GET    /api/time_entry/current_month(.:format)                                                           time_entry#current_month
#                                 projects GET    /api/projects(.:format)                                                                           project#all_users_projects
#                         projects_summary GET    /api/projects/summary(.:format)                                                                   project#hours_per_project
#                         time_entry_index GET    /api/time_entry(.:format)                                                                         time_entry#index
#                                          POST   /api/time_entry(.:format)                                                                         time_entry#create
#                           new_time_entry GET    /api/time_entry/new(.:format)                                                                     time_entry#new
#                          edit_time_entry GET    /api/time_entry/:id/edit(.:format)                                                                time_entry#edit
#                               time_entry GET    /api/time_entry/:id(.:format)                                                                     time_entry#show
#                                          PATCH  /api/time_entry/:id(.:format)                                                                     time_entry#update
#                                          PUT    /api/time_entry/:id(.:format)                                                                     time_entry#update
#                                          DELETE /api/time_entry/:id(.:format)                                                                     time_entry#destroy
#                            project_index GET    /api/project(.:format)                                                                            project#index
#                                          POST   /api/project(.:format)                                                                            project#create
#                              new_project GET    /api/project/new(.:format)                                                                        project#new
#                             edit_project GET    /api/project/:id/edit(.:format)                                                                   project#edit
#                                  project GET    /api/project/:id(.:format)                                                                        project#show
#                                          PATCH  /api/project/:id(.:format)                                                                        project#update
#                                          PUT    /api/project/:id(.:format)                                                                        project#update
#                                          DELETE /api/project/:id(.:format)                                                                        project#destroy
#                                     root GET    /                                                                                                 dashboard#index
#         turbo_recede_historical_location GET    /recede_historical_location(.:format)                                                             turbo/native/navigation#recede
#         turbo_resume_historical_location GET    /resume_historical_location(.:format)                                                             turbo/native/navigation#resume
#        turbo_refresh_historical_location GET    /refresh_historical_location(.:format)                                                            turbo/native/navigation#refresh
#            rails_postmark_inbound_emails POST   /rails/action_mailbox/postmark/inbound_emails(.:format)                                           action_mailbox/ingresses/postmark/inbound_emails#create
#               rails_relay_inbound_emails POST   /rails/action_mailbox/relay/inbound_emails(.:format)                                              action_mailbox/ingresses/relay/inbound_emails#create
#            rails_sendgrid_inbound_emails POST   /rails/action_mailbox/sendgrid/inbound_emails(.:format)                                           action_mailbox/ingresses/sendgrid/inbound_emails#create
#      rails_mandrill_inbound_health_check GET    /rails/action_mailbox/mandrill/inbound_emails(.:format)                                           action_mailbox/ingresses/mandrill/inbound_emails#health_check
#            rails_mandrill_inbound_emails POST   /rails/action_mailbox/mandrill/inbound_emails(.:format)                                           action_mailbox/ingresses/mandrill/inbound_emails#create
#             rails_mailgun_inbound_emails POST   /rails/action_mailbox/mailgun/inbound_emails/mime(.:format)                                       action_mailbox/ingresses/mailgun/inbound_emails#create
#           rails_conductor_inbound_emails GET    /rails/conductor/action_mailbox/inbound_emails(.:format)                                          rails/conductor/action_mailbox/inbound_emails#index
#                                          POST   /rails/conductor/action_mailbox/inbound_emails(.:format)                                          rails/conductor/action_mailbox/inbound_emails#create
#        new_rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/new(.:format)                                      rails/conductor/action_mailbox/inbound_emails#new
#            rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                                      rails/conductor/action_mailbox/inbound_emails#show
# new_rails_conductor_inbound_email_source GET    /rails/conductor/action_mailbox/inbound_emails/sources/new(.:format)                              rails/conductor/action_mailbox/inbound_emails/sources#new
#    rails_conductor_inbound_email_sources POST   /rails/conductor/action_mailbox/inbound_emails/sources(.:format)                                  rails/conductor/action_mailbox/inbound_emails/sources#create
#    rails_conductor_inbound_email_reroute POST   /rails/conductor/action_mailbox/:inbound_email_id/reroute(.:format)                               rails/conductor/action_mailbox/reroutes#create
# rails_conductor_inbound_email_incinerate POST   /rails/conductor/action_mailbox/:inbound_email_id/incinerate(.:format)                            rails/conductor/action_mailbox/incinerates#create
#                       rails_service_blob GET    /rails/active_storage/blobs/redirect/:signed_id/*filename(.:format)                               active_storage/blobs/redirect#show
#                 rails_service_blob_proxy GET    /rails/active_storage/blobs/proxy/:signed_id/*filename(.:format)                                  active_storage/blobs/proxy#show
#                                          GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                                        active_storage/blobs/redirect#show
#                rails_blob_representation GET    /rails/active_storage/representations/redirect/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations/redirect#show
#          rails_blob_representation_proxy GET    /rails/active_storage/representations/proxy/:signed_blob_id/:variation_key/*filename(.:format)    active_storage/representations/proxy#show
#                                          GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format)          active_storage/representations/redirect#show
#                       rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                                       active_storage/disk#show
#                update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                               active_storage/disk#update
#                     rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)                                                    active_storage/direct_uploads#create

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.

  get "up" => "rails/health#show", as: :rails_health_check

  get "sign_up", to: "users#new", as: :sign_up
  post "sign_up", to: "users#create"

  get "login", to: "sessions#new", as: :login
  post "login", to: "sessions#create"

  delete "logout", to: "sessions#destroy", as: :logout


  scope "/api" do
    get "time_entry/current_month", to: "time_entry#current_month"
    get "time_entry/daily_hours", to: "time_entry#daily_hours"
    get "projects", to: "project#all_users_projects"
    get "projects/summary", to: "project#hours_per_project"
    resources :time_entry
    resources :project
    # resources :user
  end


  root "dashboard#index"
  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
