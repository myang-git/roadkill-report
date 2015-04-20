require 'json'
require 'time'

class SessionsController < ApplicationController
	def can_publish_actions?(user)
		access_token = user.oauth_token
		graph = Koala::Facebook::API.new(access_token)
		permissions = graph.get_connections('me', 'permissions')
		canPublishActions = false
		for permission in permissions
			puts 'permission: ' + permission.to_s
			if permission['permission']=='publish_actions'
				if permission['status']=='granted'
					canPublishActions = true
					break
				end
			end
		end
		return canPublishActions
	end

	def create
		user = User.from_omniauth(env["omniauth.auth"])
		session[:user_id] = user.id

		if can_publish_actions? user
			redirect_to root_url
		else
			redirect_to url_for "/readonly"
		end
	end
	
	def destroy
		session[:user_id] = nil
		redirect_to url_for "/logon"
	end
	
end
