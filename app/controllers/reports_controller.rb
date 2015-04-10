class ReportsController < ApplicationController
	
	def create
		puts params

		event_count = params[:event_count].to_i
		if event_count==0
			render :nothing
			return
		end
		
		error = nil
		
		for i in 0..event_count-1
			i_s = i.to_s
			lat_hash = ("lat_" + i_s).to_sym
			lng_hash = ("lng_" + i_s).to_sym
			altitude_hash = ("altitude_" + i_s).to_sym
			time_hash = ("time_" + i_s).to_sym
			address_hash = ("address_" + i_s).to_sym
			country_hash = ("country_" + i_s).to_sym
			city_hash = ("city_" + i_s).to_sym
			photo_hash = ("photo_" + i_s).to_sym
			photo_desc_hash = ("photo_desc_" + i_s).to_sym
			
			lat = params[lat_hash].to_f
			lng = params[lng_hash].to_f
			altitude = params[altitude_hash]
			if altitude=="null"
				altitude = nil
			end
			time = Time.at(params[time_hash].to_i / 1000.0).in_time_zone("Taipei")
			time_string = time.strftime("%Y/%m/%d %H:%M")
			address = params[address_hash]
			country = params[country_hash]
			city = params[city_hash]
			photo_file = params[photo_hash]
			photo_desc = params[photo_desc_hash]
			
			report = {
				:reporter => current_user,
				:latitude => lat,
				:longitude => lng,
				:altitude => altitude,
				:time => time,
				:address => address,
				:country => country,
				:city => city,
				:photodesc => photo_desc,
				:photofile => photo_file
			}
			
			report_pipeline = Testjquerymobile::Application.config.report_pipeline
			begin
				report_pipeline.process_report report
			rescue ReportException => e
				error = e
				break
			end

		end
		
		result = {}
		if error != nil
			result[:status] = error.code
			result[:message] = error.message
		else
			result[:status] = 0
			result[:message] = 'OK'
		end
		
		render json: result
		
	end
	
end
