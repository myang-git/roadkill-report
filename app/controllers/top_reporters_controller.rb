class TopReportersController < ApplicationController
	
	def index
		if !is_logged_in?
			redirect_to url_for "/logon"
		end
		
		reporters = TopReporter.find_by_sql("select name, count as reportcount, countpercent as reportcountpercent, uid as fbid from qry_top_reporters_uid")
		respond_to do |format|
			format.json {
				render json: reporters
			}
		end
  end

end
