class HomeController < ApplicationController
	def index
		if !is_logged_in?
			redirect_to url_for "/logon"
			return
		end
		
		if !can_publish?
			redirect_to url_for "/guest"
		end
	end
end
