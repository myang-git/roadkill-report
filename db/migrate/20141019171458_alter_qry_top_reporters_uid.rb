class AlterQryTopReportersUid < ActiveRecord::Migration
  def up
		execute "drop view qry_top_reporters_uid;
		         create view qry_top_reporters_uid
		         as
		         SELECT t.name,
		         t.count,
		         (100 * count / (select count(1) from report_data)) as countpercent,
		         u.uid
		         FROM qry_top_reporters t
		         JOIN users u ON t.name::text = u.name::text
		         WHERE u.created_at > '2014-09-01 00:00:00'::timestamp without time zone
		         ORDER BY t.count DESC;"	  	
  end
  
  def down
		execute "drop view qry_top_reporters_uid;
		         create view qry_top_reporters_uid
		         as
		         SELECT t.name,
		         t.count,
		         u.uid
		         FROM qry_top_reporters t
		         JOIN users u ON t.name::text = u.name::text
		         WHERE u.created_at > '2014-09-01 00:00:00'::timestamp without time zone
		         ORDER BY t.count DESC;"	  	
  end
  
end
