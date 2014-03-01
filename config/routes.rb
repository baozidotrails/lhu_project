Cloudspace::Application.routes.draw do
  resources :blocks

  devise_for :users

  resources :spaces

  get 'pages/decision'
  get 'pages/sandbox'
  root "pages#home"
end
