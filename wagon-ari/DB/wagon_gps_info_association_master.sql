create table public.wagon_gps_info_association_master (
  id serial not null
  , office character varying(10)
  , device_id character varying(10)
  , wagon_num character varying(10)
  , device_info_1 character varying(20)
  , color character varying(30)
  , primary key (id)
);