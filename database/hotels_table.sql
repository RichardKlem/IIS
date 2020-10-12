use myDB;

drop table if exists hotels_table;

create table hotels_table(
    hotel_id int auto_increment,
    name TEXT not null,
    description TEXT not null,
    category int not null,
    address TEXT not null,
    email TEXT not null,
    phone_number TEXT not null,
    rating int not null default 0,

    primary key (hotel_id)
);

# Trigger
DELIMITER $$
CREATE TRIGGER hotel_check BEFORE INSERT ON hotels_table
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

# Test data
insert into hotels_table (name, description, category, address, email, phone_number, rating)
values ('Hotel Brno', 'Prémiový hotel v centru Brna', 3, 'Náměstí svobody 0, Brno, Česká Republika', 'info@hotel-brno.cz', '+4200000000000', 5);
