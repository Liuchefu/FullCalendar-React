create table public.shipping_plan (
  id serial not null
  , delete_no character varying(255)
  , ship_num character varying(255)
  , block_name character varying(255)
  , start_point character varying(255)
  , central_point character varying(255)
  , end_point character varying(255)
  , wagon_num character varying(255)
  , receiving_scheduled time without time zone default now()
  , delivery_scheduled time without time zone default now()
  , work_date date default now()
  , create_at timestamp(6) without time zone default now() not null
  , update_at timestamp(6) without time zone default now() not null
  , ship_num_change_flag boolean default false
  , block_name_change_flag boolean default false
  , start_point_change_flag boolean default false
  , central_point_change_flag boolean default false
  , end_point_change_flag boolean default false
  , comment1_change_flag boolean default false
  , ship_flag boolean default false
  , receiving_flag boolean default false
  , departure_flag boolean default false
  , delete_flag boolean default false
  , comment1 character varying(255)
  , comment2 character varying(255)
  , primary key (id)
);