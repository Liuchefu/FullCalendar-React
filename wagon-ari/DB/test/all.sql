-- create table public.achievement_data (
--   id serial not null
--   , shipping_plan_id character varying(50) #繝ｦ繝九・繧ｯ繧ｭ繝ｼ繧剃ｻ倥￠縺溘＞
--   , ship_num character varying(255)
--   , block_name character varying(255)
--   , start_point character varying(255)
--   , central_point character varying(255)
--   , end_point character varying(255)
--   , departure_time timestamp(6) without time zone
--   , receiving_achievement timestamp(6) without time zone
--   , delivery_achievement timestamp(6) without time zone
--   , wagon_num character varying(255)
--   , driving_person character varying(255)
--   , create_at timestamp(6) without time zone default now() not null
--   , update_at timestamp(6) without time zone default now() not null
--   , primary key (id)
-- );

CREATE TABLE public.achievement_data (
  id SERIAL NOT NULL,
  shipping_plan_id CHARACTER VARYING(50) NOT NULL UNIQUE, -- 繝ｦ繝九・繧ｯ繧ｭ繝ｼ繧定ｨｭ螳・
  ship_num CHARACTER VARYING(255),
  block_name CHARACTER VARYING(255),
  start_point CHARACTER VARYING(255),
  central_point CHARACTER VARYING(255),
  end_point CHARACTER VARYING(255),
  departure_time TIMESTAMP(6) WITHOUT TIME ZONE,
  receiving_achievement TIMESTAMP(6) WITHOUT TIME ZONE,
  delivery_achievement TIMESTAMP(6) WITHOUT TIME ZONE,
  wagon_num CHARACTER VARYING(255),
  driving_person CHARACTER VARYING(255),
  created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (id)
);
create table public.block_name (
  id serial not null
  , block_name character varying(255)
  , primary key (id)
);
create table public.block_size (
  id serial not null
  , block_size character varying(255)
  , primary key (id)
);
create table public.color_master (
  id serial not null
  , ship_num character varying(255)
  , color character varying(255)
  , primary key (id)
);
create table public.company (
  id serial not null
  , company_name character varying(255)
  , primary key (id)
);
create table public.employee (
  id serial not null
  , company_name character varying(255)
  , employee_name character varying(255)
  , primary key (id)
);
create table public.end_point (
  id serial not null
  , end_point character varying(255)
  , primary key (id)
);
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
create table public.ship_num (
  id serial not null
  , ship_num character varying(255)
  , primary key (id)
);
create table public.start_point (
  id serial not null
  , start_point character varying(255)
  , primary key (id)
);
create table public.wagon_gps_info_association_master (
  id serial not null
  , office character varying(10)
  , device_id character varying(10)
  , wagon_num character varying(10)
  , device_info_1 character varying(20)
  , color character varying(30)
  , primary key (id)
);
