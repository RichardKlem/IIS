use myDB;

drop table if exists session_table;

create table session_table(
    id_user int not null,
    id_session TEXT not null,
    timestamp TIMESTAMP default NOW(),

    foreign key (id_user) REFERENCES uzivatel(id_user)
);

# Todo trigger to delete duplicate rows with same id_user

SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS myDB.sessionsHandler
ON SCHEDULE
EVERY 1 HOUR
COMMENT 'Delete active sessions every 1 hour'
DO
BEGIN
DELETE FROM myDB.session_table WHERE (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(timestamp)) > 3600;
END