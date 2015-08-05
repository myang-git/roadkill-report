Testjquerymobile::Application.routes.draw do
  get "top_reporter/index"
  get "top_reporter/show"
	get 'auth/:provider/callback', to: 'sessions#create'
	get 'auth/failure', to: redirect('/')
	get '/signout', to: 'sessions#destroy', :as => :signout
	get '/signin' => 'sessions#new', :as => :signin
  get '/home', to: 'home#index'
  get '/logon', to: 'logon#index'
  get '/guest', to: 'guest#index'
  post '/reports', to: 'reports#create'
  get '/topreporters', to: 'top_reporters#index'
  get '/topreporters/:id', to: 'top_reporters#show'
  get '/stats', to:'stats#index'

  scope :api do
    scope :v1 do 
      scope '/stats' do
        scope '/submissions' do
          get '/minmax/:min/:max', to: 'api_stats#minmax'
          get '/yeartodate', to: 'api_stats#yeartodate'
          get '/monthtodate', to: 'api_stats#monthtodate'
        end
      end

    end
  end
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with 'rake routes'.

  # You can have the root of your site routed with 'root'
  root 'home#index'
  
	
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
