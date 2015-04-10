class FacebookUploader 
	
	def process_report(report)
		lat = report[:latitude]
		lng = report[:longitude]
		altitude = report[:altitude]
		time = report[:time]
		time_string = time.strftime("%Y/%m/%d %H:%M")
		address = report[:address]
		photodesc = report[:photodesc]
		photofile = report[:photofile]
		reporter = report[:reporter]
				
		message =
			photodesc + "\n\n" +  
			"時間: " + time_string + "\n" + 
			("座標: %.6f, %.6f" % [lat, lng]) + "\n"
			
		if altitude!=nil
			message = message + ("高度: %.1fm" % [altitude.to_f]) + "\n"
		end
		
		message = message + "地點: " + address
		message = photodesc


		access_token = reporter.oauth_token
		graph = Koala::Facebook::API.new(access_token)

		groupId = ENV["FACEBOOK_GROUP_ID"]
		begin
			graph.put_picture(photofile, {message: message}, groupId)
		rescue Koala::Facebook::ServerError => e
			if e.fb_error_code == 200 && e.fb_error_subcode == 1376025
				raise ReportException.new(901, "請先加入社團")
			end
		end
	end
	
end
