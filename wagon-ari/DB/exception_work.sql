create table public.exception_work (
  id serial not null
  , ship_num character varying(255)
  , block_name character varying(255)
  , start_point character varying(255)
  , end_point character varying(255)
  , wagon_num character varying(255)
  , driving_person character varying(255)
  , work_count character varying(5)
  , work_date date default now()
  , departure_time timestamp(6) without time zone
  , receiving_achievement timestamp(6) without time zone
  , delivery_achievement timestamp(6) without time zone
  , ship_flag boolean default false
  , receiving_flag boolean default false
  , departure_flag boolean default false
  , create_at timestamp(6) without time zone default now() not null
  , update_at timestamp(6) without time zone default now() not null
  , primary key (id)
);