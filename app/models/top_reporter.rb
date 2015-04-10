class TopReporter < ActiveRecord::Base
	
	self.table_name = "qry_top_reporters_uid"
	self.primary_key = "name"
	
end
