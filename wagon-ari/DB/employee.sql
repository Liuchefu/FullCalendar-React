create table public.employee (
  id serial not null
  , company_name character varying(255)
  , employee_name character varying(255)
  , primary key (id)
);