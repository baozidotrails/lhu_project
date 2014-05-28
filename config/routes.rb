Cloudspace::Application.routes.draw do


  resources :blocks do
    member do
      get 'blockinfo'
      get 'blockview'
      get 'block_preview'
      post 'rent'
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

  resources :registrations, only: [:create, :update, :destroy]
  resources :orders, only: [:create, :update, :destroy] do
    member do
      post 'pass'
    end
  end


  get 'pages/decision'
  get 'pages/sandbox'
  get 'pages/about'
  get 'pages/contact'

  get 'account/spaces'
  get 'account/rents'
  get 'account/orders'

  get '/signup', to: 'users#new'
  get '/login', to: 'sessions#new'
  delete '/logout', to: 'sessions#destroy'

  root "pages#home"
end
