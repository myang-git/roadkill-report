class CreateQryReportCountByCity < ActiveRecord::Migration
  def up
		execute "create view qry_report_count_by_city
		         as
		         SELECT report_data.city,
		         count(1) AS count
		         FROM report_data
		         WHERE report_data.city IS NOT NULL
		         GROUP BY report_data.city;"	  	
  end
  
  def down
  		execute "drop view qry_report_count_by_city;"
  end
  
end
