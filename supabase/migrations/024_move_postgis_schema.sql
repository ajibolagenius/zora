create schema if not exists extensions;

alter extension postgis set schema extensions;

grant usage on schema extensions to postgres,
anon,
authenticated,
service_role;

alter database "postgres"
set
    search_path = "$user",
    public,
    extensions;