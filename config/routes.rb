Cloudspace::Application.routes.draw do

  resources :blocks do
    member do
      get 'blockinfo'
      get 'blockview'
      get 'apply'
    end
  end
  resources :searches

  resources :spaces, path_names: { edit: 'drawing' } do
    member do
      get 'detailize'
      get 'spaceinfo'
      get 'preview'
      get 'place'
      get 'remove'
    end
  end

  resources :users

  resources :sessions, only: [:new, :create, :destroy]

  resources :registrations, only: [:new, :create, :destroy]

  get 'pages/decision'

  get 'pages/sandbox'

  get 'account/spaces'
  get 'account/rents'

  get '/signup', to: 'users#new'
  get '/login', to: 'sessions#new'
  delete '/logout', to: 'sessions#destroy'

  root "pages#home"
end
