class ReportSaver
	
	def process_report(report)
		# latitude:float longitude:float altitude:float time:datetime address:string photodesc:string photodata:binary
		reportData = ReportData.new
		reporter = report[:reporter]
		reporterId = reporter.provider + "/" + reporter.uid + "/" + reporter.name
		reportData.reporter = reporterId
		reportData.latitude = report[:latitude]
		reportData.longitude = report[:longitude]
		reportData.altitude = report[:altitude]
		reportData.time = report[:time]
		reportData.address = report[:address]
		reportData.country = report[:country]
		reportData.city = report[:city]
		reportData.photodesc = report[:photodesc]
		reportData.photodata = report[:photofile].read
		reportData.save!
	end
	
end