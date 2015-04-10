class StatsController < ApplicationController

  def index
    if !is_logged_in?
      redirect_to url_for "/logon"
      return
    end
  
    stats = Stats.new
    load_total_report_count(stats)
    load_report_count_by_city(stats)
    load_top_reporters(stats)

    respond_to do |format|
      format.json {
        render json: stats
      }
      format.html
    end
    
  end
  
  def load_total_report_count(stats)
    r = ActiveRecord::Base.connection.execute('select count(1) as count from report_data')
    count = r[0]['count'].to_i
    stats.report_count = count
  end

  def load_report_count_by_city(stats)
    r = ActiveRecord::Base.connection.execute('select * from qry_report_count_by_city order by count desc')
    r.each do |row|
      city = row['city']
      count = row['count'].to_i
      stats.add_city_report_count(city, count)
    end
    for i in 10..20
      stats.add_city_report_count("台北市", i)
    end
  end
  
  def load_top_reporters(stats) 
    r = ActiveRecord::Base.connection.execute('select * from qry_top_reporters_uid order by count desc')
    r.each do |row|
      name = row['name']
      count = row['count']
      countpercent = row['countpercent']
      uid = row['uid']
      stats.add_top_reporter(name, count, countpercent, uid)
    end
  end

end
