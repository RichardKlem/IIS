use ituDB;

drop table if exists reservation_table;
drop table if exists rooms_table;
drop table if exists hotels_table;
drop table if exists session_table;
drop table if exists password_table;
drop table if exists uzivatel;
drop table if exists role_table;

create table role_table(
    id_role int,
    role_name TEXT not null,

    primary key (id_role)
);


create table uzivatel(
    id_user int auto_increment,
    name TEXT not null,
    email TEXT not null,
    address TEXT default null,
    phone_number TEXT default null,
    birth_date date default null,
    role int default 3,

    primary key (id_user),
    foreign key (role) REFERENCES role_table(id_role) on delete cascade
);

create table password_table(
    id_user int,
    password TEXT not null,

    foreign key (id_user) REFERENCES uzivatel(id_user) ON DELETE CASCADE
);

create table session_table(
    id_user int not null,
    id_session TEXT not null,
    timestamp TIMESTAMP default NOW(),

    foreign key (id_user) REFERENCES uzivatel(id_user) on delete cascade
);

create table hotels_table(
    hotel_id int auto_increment,
    name TEXT not null,
    description TEXT default null,
    category int default 1,
    address TEXT default null,
    email TEXT default null,
    phone_number TEXT default null,
    rating int default 0,
    free_cancellation bool default false,
    no_prepayment bool default false,
    free_wifi bool default false,
    gym bool default false,
    spa bool default false,
    swimming_pool bool default false,
    primary key (hotel_id)
);

create table rooms_table(
    id_room int auto_increment,
    hotel_id int,
    name TEXT not null,
    category int default 0,
    bed_count int default 2,
    description TEXT default null,
    room_size int default 0,
    pre_price int default 0,
    price_night int not null,
    bed_type int default 0,
    free_breakfast bool default false,
    count int default 1,

    foreign key (hotel_id) REFERENCES hotels_table(hotel_id) on delete cascade,
    primary key (id_room)
);


create table babysitter_table(
    id_babysitter int auto_increment,
    name TEXT not null,
    phone_number TEXT not null,
    age int default 18,
    description TEXT default null,
    price_hour int not null,

    primary key (id_babysitter)
);

insert into babysitter_table(name, phone_number, age, description, price_hour)
values ("Bára", "+420000000000", 20, "studentka", 250);

create table reservation_table(
    id_reservation int auto_increment,
    id_user int not null,
    id_room int not null,
    start_date date not null,
    end_date date not null,
    adult_count int default 1,
    child_count int default 0,
    total_price int not null,
    pre_price int default 0,
    room_count int default 0,
    approved boolean default 1,
    check_in boolean default 0,
    check_out boolean default 0,

    foreign key (id_room) REFERENCES rooms_table(id_room) on delete cascade,
    foreign key (id_user) REFERENCES uzivatel(id_user) on delete cascade,
    primary key (id_reservation)
);

create table babysitting_table(
    id_babysitting int auto_increment,
    reservation int,
    babysitter int,
    start_date datetime not null,
    end_date datetime not null,
    total_price int not null,

    foreign key (babysitter) REFERENCES babysitter_table(id_babysitter) on delete cascade,
    foreign key (reservation) REFERENCES reservation_table(id_reservation) on delete cascade,
    primary key (id_babysitting)
);


# Trigger user
DELIMITER $$
CREATE TRIGGER uzivatel_check BEFORE INSERT ON uzivatel
FOR EACH ROW
BEGIN

IF NEW.role < 0 or NEW.role > 3 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given role has wrong value!';
END IF;
END$$
DELIMITER ;


# Trigger hotel
DELIMITER $$
CREATE TRIGGER hotel_check BEFORE INSERT ON hotels_table
FOR EACH ROW
BEGIN
IF NEW.category < 0 or NEW.category > 7 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given category has wrong value!';
END IF;
IF NEW.rating < 0 or NEW.rating > 5 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given rating has wrong value!';
END IF;
END$$
DELIMITER ;

# auto delete sessions
SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS ituDB.sessionsHandler
ON SCHEDULE
EVERY 2 HOUR
COMMENT 'Delete active sessions every 2 hours'
DO
BEGIN
DELETE FROM ituDB.session_table WHERE (UNIX_TIMESTAMP() - UNIX_TIMESTAMP(timestamp)) > 7200;
END;

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

# Test user data
insert into uzivatel (name, email, phone_number, birth_date, role)
values ('admin', 'admin@iis-hotel.cz', '+4200000000000', '1998-1-1', 0);
SET @last_id_in_uzivatel = LAST_INSERT_ID();
insert into password_table values (@last_id_in_uzivatel, '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');

insert into uzivatel (name, email, phone_number, birth_date, role)
values ('vlastnik', 'bohaty@iis-hotel.cz','+420111222333', '1998-1-1', 1);
SET @last_id_in_uzivatel = LAST_INSERT_ID();
insert into password_table values (@last_id_in_uzivatel, '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');

insert into uzivatel (name, email, phone_number, birth_date, role)
values ('recepcni', 'prijmeni@iis-hotel.cz','+420111222334', '1998-1-1', 2);
SET @last_id_in_uzivatel = LAST_INSERT_ID();
insert into password_table values (@last_id_in_uzivatel, '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');

insert into uzivatel (name, email, phone_number, birth_date)
values ('adam', 'email@email.cz', '+420123456789', '1998-1-1');
SET @last_id_in_uzivatel = LAST_INSERT_ID();
insert into password_table values (@last_id_in_uzivatel, '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');

insert into uzivatel (name, email, phone_number, birth_date)
values ('john', 'john.appleseed@apple.com','+18006927753', '1998-1-1');
SET @last_id_in_uzivatel = LAST_INSERT_ID();
insert into password_table values (@last_id_in_uzivatel, '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');


# Test hotel data
insert into hotels_table (name, description, category, address, email, phone_number, rating)
values ('Hotel Brno', 'Prémiový hotel v centru Brna', 3, 'Náměstí svobody 0, Brno, Česká Republika', 'info@hotel-brno.cz', '+4200000000000', 5);

# Test rooms data
insert into rooms_table (hotel_id, name, bed_count, category, description, room_size, price_night)
values (1,'Double room', 2, 1, 'Fancy room with nice view', 40, 1500);

# Test reservation data
insert into reservation_table (id_user, id_room, start_date, end_date, total_price)
values (5, 1, '2020-10-23', '2020-10-24', 1500);