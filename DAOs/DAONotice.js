"use strict"

const DAOUser = require("./DAOUser");

class DAONotices {

    constructor(pool) { this.pool = pool; }

    newNotice(email, notice, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const daoUser = new DAOUser(this.pool);

                daoUser.getUser(email, (err, user) => {
                    if (err) callback(err);
                    else {
                        const sql = 'INSERT INTO Notices (Type, Text, FunctionType, Function, Date, Done, Active)  VALUES (?, ?, ?, ?, ?, ?, ?);';

                        connection.query(sql, [notice.type, notice.text, notice.typeFunction, notice.function, notice.date, 0, 1], (err, result) => {
                            connection.release();
                            if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                            else daoUser.insertUserNotice(user.Id, result.insertId, (err) => {
                                if (err) callback(err);
                                else callback(null);
                            });
                        });
                    }
                });
            }
        });
    }

    getNotice(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT * FROM Notices WHERE Id = ?;';

                connection.query(sql, [id], (err, notice) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, notice[0]);
                });
            }
        });
    }

    getIncomingNotices(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT Users.Name, Notices.Id, Type, Text, Technical, FunctionType, Function, Notices.Date FROM Notices JOIN UsersNotices ON UsersNotices.IdNotice = Id JOIN Users ON Users.Id = UsersNotices.IdUser WHERE Done = 0 AND Notices.Active = 1;'

                connection.query(sql, [], (err, notices) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos:' + err.message));
                    else callback(null, notices);
                });
            }
        });
    }

    search(search, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT * FROM Notices WHERE instr(Text, ?) > 0;';

                connection.query(sql, [search], (err, notice) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, notice);
                });
            }
        });
    }

    deleteNotice(email, id, text, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const daoUser = new DAOUser(this.pool);
                    
                daoUser.getUser(email, (err, user) => {
                    if (err) callback(err);
                    else {
                        const sql = 'UPDATE Notices SET Active = 0 AND Comment = ? AND Technical = ? WHERE Id = ?;';

                        connection.query(sql, [text, user.Id, id], (err) => {
                            if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                            else callback(null);
                        });
                    }
                });
            }
        });
    }

}

module.exports = DAONotices;