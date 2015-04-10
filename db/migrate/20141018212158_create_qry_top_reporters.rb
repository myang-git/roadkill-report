class CreateQryTopReporters < ActiveRecord::Migration
  def up
		execute "create view qry_top_reporters
             as
             SELECT get_fb_name(report_data.reporter) AS name,
             count(1) AS count
             FROM report_data
             GROUP BY get_fb_name(report_data.reporter)
             ORDER BY count(1) DESC
             LIMIT 10;"	  	
  end
  
  def down
  		execute "drop view qry_top_reporters;"
  end
  
end
