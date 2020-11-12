use myDB;

drop table if exists reservation_table;
drop table if exists rooms_table;

create table rooms_table(
    id_room int auto_increment,
    hotel_id int not null,
    name TEXT not null,
    category int not null,
    bed_count int not null,
    description TEXT not null,
    room_size int not null,
    pre_price int default 0,
    price_night TEXT not null,
    bed_type int default 0,
    free_breakfast bool default false,
    meal int default 0,
    count int default 1,
    available int default 1,

    foreign key (hotel_id) REFERENCES hotels_table(hotel_id) on delete cascade,
    primary key (id_room)
);


# Test data
insert into rooms_table (hotel_id, name, bed_count, category, description, room_size, price_night)
values (1,'Double room', 2, 1, 'Fancy room with nice view', 40, 1500);