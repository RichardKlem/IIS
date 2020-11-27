use ituDB;

drop table if exists babysitting_table;
drop table if exists babysitter_table;
drop table if exists reservation_table;
drop table if exists rooms_table;
drop table if exists hotels_table;
drop table if exists session_table;
drop table if exists password_table;
drop table if exists uzivatel;
drop table if exists role_table;

create table role_table
(
    id_role   int,
    role_name TEXT not null,

    primary key (id_role)
);


create table uzivatel
(
    id_user      int auto_increment,
    name         TEXT not null,
    email        TEXT not null,
    address      TEXT default null,
    phone_number TEXT default null,
    birth_date   date default null,
    role         int  default 3,

    primary key (id_user),
    foreign key (role) REFERENCES role_table (id_role) on delete cascade
);

create table password_table
(
    id_user  int,
    password TEXT not null,

    foreign key (id_user) REFERENCES uzivatel (id_user) ON DELETE CASCADE
);

create table session_table
(
    id_user    int  not null,
    id_session TEXT not null,
    timestamp  TIMESTAMP default NOW(),

    foreign key (id_user) REFERENCES uzivatel (id_user) on delete cascade
);

create table hotels_table
(
    hotel_id          int auto_increment,
    name              TEXT not null,
    description       TEXT default null,
    category          int  default 1,
    address           TEXT default null,
    email             TEXT default null,
    phone_number      TEXT default null,
    rating            int  default 0,
    free_cancellation bool default false,
    no_prepayment     bool default false,
    free_wifi         bool default false,
    gym               bool default false,
    spa               bool default false,
    swimming_pool     bool default false,
    is_available      bool default true,
    primary key (hotel_id)
);

create table rooms_table
(
    id_room        int auto_increment,
    hotel_id       int,
    name           TEXT not null,
    category       int  default 0,
    bed_count      int  default 2,
    description    TEXT default null,
    room_size      int  default 0,
    pre_price      int  default 0,
    price_night    int  not null,
    bed_type       int  default 0,
    free_breakfast bool default false,
    count          int  default 1,
    is_available   bool default true,

    foreign key (hotel_id) REFERENCES hotels_table (hotel_id) on delete cascade,
    primary key (id_room)
);

create table babysitter_table
(
    id_babysitter int auto_increment,
    name          TEXT not null,
    phone_number  TEXT not null,
    age           int  default 18,
    description   TEXT default null,
    price_hour    int  not null,
    is_available  bool default true,

    primary key (id_babysitter)
);

create table reservation_table
(
    id_reservation int auto_increment,
    id_user        int  not null,
    id_room        int  not null,
    start_date     date not null,
    end_date       date not null,
    adult_count    int     default 1,
    total_price    int  not null,
    pre_price      int     default 0,
    room_count     int     default 0,
    approved       boolean default 1,
    check_in       boolean default 0,
    check_out      boolean default 0,

    foreign key (id_room) REFERENCES rooms_table (id_room) on delete cascade,
    foreign key (id_user) REFERENCES uzivatel (id_user) on delete cascade,
    primary key (id_reservation)
);

create table babysitting_table
(
    id_babysitting int auto_increment,
    reservation    int,
    babysitter     int,
    start_date     datetime not null,
    end_date       datetime not null,
    total_price    int      not null,

    foreign key (babysitter) REFERENCES babysitter_table (id_babysitter) on delete cascade,
    foreign key (reservation) REFERENCES reservation_table (id_reservation) on delete cascade,
    primary key (id_babysitting)
);


# Trigger user
DELIMITER $$
CREATE TRIGGER uzivatel_check
    BEFORE INSERT
    ON uzivatel
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
CREATE TRIGGER hotel_check
    BEFORE
        INSERT
    ON hotels_table
    FOR EACH ROW
BEGIN
    IF NEW.category < 0 or NEW.category > 8 THEN
        SIGNAL SQLSTATE '12346'
            SET MESSAGE_TEXT = 'Given category has wrong value!';
    END IF;
    IF NEW.rating < 0 or NEW.rating > 5 THEN
        SIGNAL SQLSTATE '12346'
            SET MESSAGE_TEXT = 'Given rating has wrong value!';
    END IF;
END$$
DELIMITER ;

#auto delete sessions
SET GLOBAL event_scheduler = ON;
CREATE EVENT
    IF NOT EXISTS ituDB.sessionsHandler
    ON SCHEDULE
        EVERY 2 HOUR
    COMMENT 'Delete active sessions every 2 hours'
    DO
    BEGIN
        DELETE FROM ituDB.session_table WHERE (UNIX_TIMESTAMP() - UNIX_TIMESTAMP(timestamp)) > 7200;
    END;

#Test role data
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

#Test user data
insert into uzivatel
values (1, 'Admin', 'admin@iis-hotel.cz', 'Ulice 1, Brno 613 00, ČR', '+4200000000000', '1998-1-1', 0),
       (2, 'Vlastník', 'vlastnik@iis-hotel.cz', 'Ulice 2, Brno 613 00, ČR', '+420111222333', '1998-1-1', 1),
       (3, 'Recepční', 'recepcni@iis-hotel.cz', 'Ulice 3, Brno 613 00, ČR', '+420111222334', '1998-1-1', 2),
       (4, 'Martin', 'martin@email.cz', 'Ulice 4, Brno 613 00, ČR', '+420123456789', '1998-1-1', 3),
       (5, 'John Appleseed', 'john.appleseed@apple.com', '1 Infinite Loop, Cupertino, CA 95014-2084', '+18006927753',
        '1998-1-1', 3);

insert into password_table
values (1,
        '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f'),
       (2,
        '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f'),
       (3,
        '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f'),
       (4,
        '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f'),
       (5,
        '6c8d3a67536230be7b6a0f40c0cdb54e4e3dd8aa80a8e6869829274f8409c119113fd86e49c42e9bb96299e6b4e7272608d56e190af1b37b3966b9038d038c7310cfb98ffc7c1da60a19ba0eae10302788564c4ff7b5462e98cfecdf4a9b9e3f');

#Test hotel data
INSERT INTO `hotels_table`
VALUES (1, 'Hotel', 'Business hotel v centru Brna', 2, 'Náměstí svobody 0, Brno 614 00, Česká Republika',
        'info@hotel-brno.cz', '+4200000000000', 5, 1, 1, 1, 1, 1, 1, 1),
       (2, 'Hotel 1', 'Standard Hotel in Brno', 1, 'Ulice 1, Brno 612 00, CZ', 'hotel1@is-hotel.cz', '+420000000000', 4,
        1, 0, 1, 1, 1, 1, 1),
       (3, 'Hotel 2', 'Airport Hotel Prague', 3, 'Příčná 498/7, Praha 276 01, CZ ', 'hotel2@is-hotel.cz',
        '+420000000000', 3, 0, 0, 1, 1, 1, 1, 1),
       (4, 'Hotel 3', 'Hotel 3 - Casino Hotel', 5, 'Ulice 1, Zlín 760 01, CZ', 'hotel3@is-hotel.cz', '+420000000000', 2,
        0, 0, 0, 1, 1, 1, 1),
       (5, 'Hotel 4', 'Hotel 4 - Studio hotel', 6, 'Ulice 1, Praha 100 00, CZ', 'hotel4@is-hotel.cz', '+420000000000',
        1, 0, 0, 0, 1, 0, 1, 1),
       (6, 'Hotel 5', 'Hotel 5 - London hotel', 7, 'Street 1, London WC2N 5DU, UK', 'hotel5@is-hotel.cz',
        ' +44000000000', 5, 0, 0, 0, 0, 0, 1, 1),
       (7, 'Hotel 6', 'Economy hotel', 8, 'Ulice 42, Vsetín 75501, CZ', 'hotel6@is-hotel.cz', '+420000000000', 0, 0, 1,
        0, 0, 0, 0, 1);

#Test rooms data
INSERT INTO `rooms_table`
VALUES (1, 1, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (2, 1, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (3, 1, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (4, 1, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (5, 1, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (6, 1, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (7, 1, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (8, 1, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (9, 1, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (10, 1, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (11, 2, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (12, 2, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (13, 2, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (14, 2, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (15, 2, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (16, 2, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (17, 2, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (18, 2, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (19, 2, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (20, 2, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (21, 3, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (22, 3, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (23, 3, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (24, 3, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (25, 3, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (26, 3, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (27, 3, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (28, 3, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (29, 3, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (30, 3, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (31, 4, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (32, 4, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (33, 4, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (34, 4, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (35, 4, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (36, 4, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (37, 4, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (38, 4, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (39, 4, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (40, 4, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (41, 5, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (42, 5, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (43, 5, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (44, 5, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (45, 5, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (46, 5, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (47, 5, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (48, 5, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (49, 5, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (50, 5, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (51, 6, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (52, 6, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (53, 6, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (54, 6, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (55, 6, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (56, 6, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (57, 6, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (58, 6, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (59, 6, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (60, 6, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1),
       (61, 7, 'Single Room', 1, 1, 'Single Room', 30, 0, 1000, 1, 1, 5, 1),
       (62, 7, 'Double room', 1, 2, 'Standard room with nice view', 40, 0, 1500, 0, 1, 10, 1),
       (63, 7, 'Tripple room', 3, 3, 'Tripple room with nice view', 60, 0, 2000, 1, 0, 5, 1),
       (64, 7, 'Business Single Room', 4, 1, 'Business Single Room', 40, 0, 4000, 1, 1, 5, 1),
       (65, 7, 'Business Room', 2, 2, 'Premium Business Room', 50, 0, 4000, 2, 1, 10, 1),
       (66, 7, 'Deluxe Singe Room', 5, 1, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 5, 1),
       (67, 7, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (68, 7, 'Deluxe Double Room', 5, 2, 'Deluxe Double Room', 20, 0, 7000, 1, 1, 10, 1),
       (69, 7, 'Studio Room', 6, 5, 'Studio Room', 40, 0, 10000, 1, 1, 3, 1),
       (70, 7, 'Suite Room', 7, 10, 'Suite ', 40, 0, 40000, 1, 0, 1, 1);

#Test reservation data
INSERT INTO `reservation_table`
VALUES (1, 5, 1, '2020-10-23', '2020-10-24', 1, 1500, 0, 0, 1, 0, 0),
       (3, 1, 51, '2021-01-19', '2021-01-26', 1, 7000, 0, 1, 1, 0, 0),
       (4, 1, 2, '2020-12-02', '2020-12-05', 2, 4500, 0, 1, 1, 0, 0),
       (5, 4, 45, '2020-12-22', '2020-12-25', 2, 12000, 0, 1, 1, 0, 0),
       (6, 4, 58, '2021-02-22', '2021-02-25', 2, 21000, 0, 1, 1, 0, 0),
       (7, 5, 65, '2020-11-27', '2020-11-30', 5, 36000, 0, 3, 1, 0, 0);


#Babysitters data
INSERT INTO `babysitter_table`
VALUES (1, 'Bára', '+420000000000', 20, 'studentka', 250, 1),
       (2, 'Anna', '+420000000000', 20, 'Dlouhodobá zkušenost s hlídáním dětí', 300, 1),
       (3, 'Lenka', '+420000000000', 22, 'studentka', 250, 1),
       (4, 'Kateřina', '+420000000000', 21, 'studentka, s možností doučování', 400, 1),
       (5, 'Michal', '+420000000000', 23, 'Možnost sportovních aktivit', 300, 1);

#Babysitting data
INSERT INTO `babysitting_table`
VALUES (1, 3, 2, '2021-01-19 12:00:00', '2021-01-19 13:00:00', 300),
       (2, 3, 3, '2021-01-25 13:00:00', '2021-01-25 20:00:00', 1750),
       (3, 6, 4, '2021-02-23 08:00:00', '2021-02-23 20:00:00', 4800),
       (4, 5, 5, '2020-12-24 23:00:00', '2020-12-25 06:00:00', 2100);