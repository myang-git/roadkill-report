class ReportPipeline
	require 'fb_uploader'
	require 'report_saver'
	
	def initialize
		@processorQueue = [
			FacebookUploader.new,
			ReportSaver.new
		]
	end
	
	def process_report(report)
		@processorQueue.each do |processor|
			processor.process_report report
		end
	end
	
end