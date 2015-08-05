class ApiStatsController < ApplicationController 

  def minmax
    min = params[:min]
    max = params[:max]
    stats = []
    results = ActiveRecord::Base.connection.execute('select * from qry_reporter_submissions where submissions >= %d and submissions <= %d order by submissions desc' % [min.to_i, max.to_i])
    results.each do |row|
      reporter_fbname = row['reporter_fbname']
      submissions = row['submissions'].to_i
      stats << {:reporter_fbname => reporter_fbname, :submissions => submissions}
    end

    respond_to do |format|
      format.json {
        render json: stats
      }
      format.html
    end    
  end

  def reporter_submissions_since(date)
    stats = []
    results = ActiveRecord::Base.connection.execute("select * from sp_reporters_submissions_since_date('%s')" % date)
    results.each do |row|
      reporter_fbname = row['reporter_fbname']
      submissions = row['submissions'].to_i
      stats << {:reporter_fbname => reporter_fbname, :submissions => submissions}
    end

    respond_to do |format|
      format.json {
        render json: stats
      }
      format.html
    end    

  end

  def yeartodate
    from_dt = Time.now.year.to_s + '/1/1'
    reporter_submissions_since(from_dt)
  end

  def monthtodate
    from_dt = Time.now.year.to_s + '/' + Time.now.month.to_s + '/1'
    reporter_submissions_since(from_dt)
  end

end