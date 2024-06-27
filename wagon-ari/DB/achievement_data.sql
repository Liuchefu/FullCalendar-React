-- create table public.achievement_data (
--   id serial not null
--   , shipping_plan_id character varying(50) #ユニークキーを付けたい
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
  shipping_plan_id CHARACTER VARYING(50) NOT NULL UNIQUE, -- ユニークキーを設定
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