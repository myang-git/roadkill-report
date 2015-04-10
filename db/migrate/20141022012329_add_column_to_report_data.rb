class AddColumnToReportData < ActiveRecord::Migration
  def change
    add_column :report_data, :country, :string
    add_column :report_data, :city, :string
    add_column :report_data, :species, :string
    add_column :report_data, :is_important, :boolean
  end
end
