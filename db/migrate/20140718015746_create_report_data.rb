class CreateReportData < ActiveRecord::Migration
  def change
    create_table :report_data do |t|
      t.string :reporter
      t.float :latitude
      t.float :longitude
      t.float :altitude
      t.datetime :time
      t.string :address
      t.string :photodesc
      t.binary :photodata

      t.timestamps
    end
  end
end
