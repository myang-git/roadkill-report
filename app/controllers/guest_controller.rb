class GuestController < ApplicationController
	def index
		if !is_logged_in?
			redirect_to url_for "/logon"
			return
		end
	end
end
