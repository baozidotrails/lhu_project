Cloudspace::Application.routes.draw do

  resources :blocks do
    member do
      get 'blockinfo'
      get 'blockview'
    end
  end
  resources :searches


  devise_for :users

  resources :spaces, path_names: { edit: 'drawing' } do
    member do
      get 'detailize'
    end
  end

  get 'pages/decision'

  get 'pages/sandbox'

  root "pages#home"
end
