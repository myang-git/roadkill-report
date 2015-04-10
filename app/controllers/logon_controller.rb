class LogonController < ApplicationController
	
	def index
		if is_logged_in?
			puts "oauth info: ", current_user.oauth_token, current_user.oauth_expires_at
			redirect_to url_for "/home"
		end
	end
	
end
