require 'json'
require 'time'

class SessionsController < ApplicationController

	def create
		user = User.from_omniauth(env["omniauth.auth"])
		session[:user_id] = user.id

		fbPermissions = user.get_fb_permissions()

		if fbPermissions['publish_actions']
			redirect_to root_url
		else
			redirect_to url_for "/guest"
		end
	end
	
	def destroy
		session[:user_id] = nil
		redirect_to url_for "/logon"
	end
	
end
