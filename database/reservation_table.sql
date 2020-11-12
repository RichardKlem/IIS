use myDB;

drop table if exists reservation_table;

create table reservation_table(
    id_reservation int auto_increment,
    id_user int not null,
    id_room int not null,
    id_approved_by int,
    start_date date not null,
    end_date date not null,
    adult_count int default 1,
    child_count int default 0,
    total_price int not null,
    pre_price int default 0,
    room_count int default 0,
    approved boolean not null default 1,
    check_in boolean not null default 0,
    check_out boolean not null default 0,


    foreign key (id_room) REFERENCES rooms_table(id_room) on delete cascade,
    foreign key (id_user) REFERENCES uzivatel(id_user) on delete cascade,
    foreign key (id_approved_by) REFERENCES uzivatel(id_user) on delete cascade,
    primary key (id_reservation)
);


# Trigger
## Todo calculate total_price from date

# Test data
insert into reservation_table (id_user, id_room, start_date, end_date, total_price)
values (5, 1, '2020-10-23', '2020-10-24', 1500);