use myDB;

drop table if exists role_table;

create table role_table(
    id_role int,
    role_name TEXT not null,

    primary key (id_role)
);


#Test data
insert into role_table (id_role, role_name)
values (0, 'administrátor');

insert into role_table (id_role, role_name)
values (1, 'vlastník');

insert into role_table (id_role, role_name)
values (2, 'recepční');

insert into role_table (id_role, role_name)
values (3, 'zákazník');

insert into role_table (id_role, role_name)
values (4, 'neregistrovaný návštěvník');