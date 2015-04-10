class Stats

  def initialize
    @report_count = 0
    @top_reporters = []
    @top_cities = []
  end

  def report_count
    @report_count
  end
  
  def report_count=(count)
    @report_count = count
  end
  
  def top_reporters
    @top_reporters
  end
  
  def add_top_reporter(name, count, percent, uid)
    @top_reporters << {'name' => name, 'reportcount' => count, 'reportcountpercent' => percent, 'fbid' => uid}
  end
  
  def top_cities
    @top_cities
  end
  
  def add_city_report_count(city, count)
    @top_cities << {"name" => city, "count" => count}
  end
  
end