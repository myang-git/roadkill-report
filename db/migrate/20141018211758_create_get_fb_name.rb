class CreateGetFbName < ActiveRecord::Migration
  def up
		execute "CREATE OR REPLACE FUNCTION public.get_fb_name(full_name character varying)
             RETURNS character varying
             LANGUAGE plpgsql
             AS $function$
             begin
               return substring(full_name from length(full_name) - position('/' in reverse(full_name)) + 2);
             end; $function$;"	  	
  end
  
  def down
  		execute "drop function get_fb_name(full_name character varying)"
  end
  
end
