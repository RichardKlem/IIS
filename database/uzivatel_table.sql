use myDB;

drop table if exists password_table;
drop table if exists session_table;
drop table if exists uzivatel;

create table uzivatel(
    id_user int auto_increment,
    name TEXT not null,
    email TEXT not null,
    phone_number TEXT not null,
    birth_date date not null,
    role int default 3 not null,

    primary key (id_user),
    foreign key (role) REFERENCES role_table(id_role) on delete cascade
);

# Todo disable read permission for rootRemote and create new user
create table password_table(
    id_user int not null,
    password TEXT not null,

    foreign key (id_user) REFERENCES uzivatel(id_user) ON DELETE CASCADE
);


# Trigger
DELIMITER $$
CREATE TRIGGER uzivatel_check BEFORE INSERT ON uzivatel
FOR EACH ROW
BEGIN
IF (NEW.email REGEXP '^[^@]+@[^@]+\.[^@]{2,}$') = 0 THEN
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Given email has wrong format!';
END IF;
IF (NEW.phone_number REGEXP '^[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}') = 0 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given number has wrong format!';
END IF;
IF NEW.role < 0 or NEW.role > 3 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given role has wrong value!';
END IF;
END$$
DELIMITER ;


# Test data
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