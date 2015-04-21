class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  
  private
	def current_user
		if session[:user_id]
			@current_user = nil
			begin
				@current_user = User.find(session[:user_id])
			rescue
				puts "unable to find User with id=" + session[:user_id].to_s
			end
		end
		@current_user
	end
	
	def is_logged_in?
		logged_in_user = current_user
		logged_in_user_exists = logged_in_user!=nil
		session_valid = logged_in_user.oauth_expires_at >= Time.now if logged_in_user_exists
		logged_in = logged_in_user_exists && session_valid  
		logged_in
	end

	def can_publish?
		if current_user == nil
			return false
		end
		fbPermissions = current_user.get_fb_permissions()
		return fbPermissions['publish_actions']
	end

	helper_method :current_user, :is_logged_in?, :can_publish?

end
