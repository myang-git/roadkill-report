class User < ActiveRecord::Base

	@fbPermissions

	def self.from_omniauth(auth)
		
		access_token = auth.credentials.token
		puts 'omniauth: access_token = ' + access_token
		access_token_expires_at = Time.at(auth.credentials.expires_at)
		begin
			access_token, access_token_expires_at = extendToken auth.credentials.token
		rescue => exception
			puts "unable to exchange for long lived token"
			puts exception.backtrace
		end

		where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
			user.provider = auth.provider
			user.uid = auth.uid
			user.name = auth.info.name
			user.oauth_token = access_token
			user.oauth_expires_at = access_token_expires_at
			user.save!
		end
	end

	def self.extendToken(token)
		oauth = Koala::Facebook::OAuth.new(ENV["FACEBOOK_APP_ID"], ENV["FACEBOOK_SECRET"])
		new_access_info = oauth.exchange_access_token_info token
		new_access_token = new_access_info["access_token"]
		new_access_token_expires_at = DateTime.now + new_access_info["expires"].to_i.seconds
		return new_access_token, new_access_token_expires_at
	end

	def get_fb_permissions
		if @fbPermissions
			return @fbPermissions
		end
		access_token = self.oauth_token
		graph = Koala::Facebook::API.new(access_token)
		response = graph.get_connections('me', 'permissions')
		canPublishActions = false
		permissions = {}
		for entry in response
			puts 'permission: ' + entry.to_s
			permissionName = entry['permission']
			permissionStatus = entry['status']=='granted'
			permissions[permissionName] = permissionStatus
		end
		@fbPermissions = permissions
		return @fbPermissions
	end
	
end
