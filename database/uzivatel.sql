use myDB;

drop table if exists uzivatel;

create table uzivatel(
    id_uz int auto_increment,
    jmeno TEXT not null,
    prijmeni TEXT not null,
    email TEXT not null,
    password TEXT not null,
    tel_cislo TEXT not null,
    datum_narozeni date not null,
    role int not null default 3,

    primary key (id_uz)
);


DELIMITER $$
CREATE TRIGGER uzivatel_check BEFORE INSERT ON uzivatel
FOR EACH ROW
BEGIN
IF (NEW.email REGEXP '^[^@]+@[^@]+\.[^@]{2,}$' ) = 0 THEN
  SIGNAL SQLSTATE '12345'
     SET MESSAGE_TEXT = 'Given email has wrong format!';
END IF;
IF (NEW.tel_cislo REGEXP '^[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}' ) = 0 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given number has wrong format!';
END IF;
IF NEW.role < 0 or NEW.role > 3 THEN
  SIGNAL SQLSTATE '12346'
     SET MESSAGE_TEXT = 'Given role has wrong value!';
END IF;
END$$
DELIMITER ;

#Test data
insert into uzivatel (jmeno, prijmeni, email, password, tel_cislo, datum_narozeni, role)
values ('admin', 'admin', 'admin@iis-hotel.cz', '1234', '+4200000000000', '1998-1-1', 0);

insert into uzivatel (jmeno, prijmeni, email, password, tel_cislo, datum_narozeni, role)
values ('vlastnik', 'bohaty', 'bohaty@iis-hotel.cz', '1234','+420111222333)', '1998-1-1', 1);

insert into uzivatel (jmeno, prijmeni, email, password, tel_cislo, datum_narozeni, role)
values ('recepcni', 'prijmeni', 'prijmeni@iis-hotel.cz', '1234','+420111222334)', '1998-1-1', 2);

insert into uzivatel (jmeno, prijmeni, email, password, tel_cislo, datum_narozeni)
values ('adam', 'novák', 'email@email.cz', '1234','+420123456789', '1998-1-1');

insert into uzivatel (jmeno, prijmeni, email, password, tel_cislo, datum_narozeni)
values ('john', 'appleseed', 'john.appleseed@apple.com', '1234','+18006927753)', '1998-1-1');