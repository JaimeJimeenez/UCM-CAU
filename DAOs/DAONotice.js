"use strict"

const DAOUser = require("./DAOUser");

class DAONotices {

    constructor(pool) { this.pool = pool; }

    newNotice(email, notice, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                let daoUser = new DAOUser(this.pool);
                daoUser.getUser(email, (err, user) => {
                    if (err) callback(err);
                    else {
                        const sql = 'INSERT INTO Notices (Type, Text, FunctionType, Function, Date, Done)  VALUES (?, ?, ?, ?, ?, ?);';

                        connection.query(sql, [notice.type, notice.text, notice.typeFunction, notice.function, notice.date, 0], (err, result) => {
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
                const sql = 'SELECT * FROM Notices WHERE Technical IS NULL;'

                connection.query(sql, [], (err, notices) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos:' + err.message));
                    else callback(null, notices);
                });
            }
        });
    }

    getNoticesHistory(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const daoUser = new DAOUser(this.pool);

                daoUser.getUser(email, (err, user) => {
                    if (err) callback(err);
                    else {
                        const sql = 'SELECT * FROM Notices JOIN UsersNotices ON UsersNotices.IdNotice = Id AND UsersNotices.IdUser = ? WHERE Done = 1;';

                        connection.query(sql, [user.Id], (err, notices) => {
                            connection.release();
                            if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                            else callback(null, notices);
                        });
                    }
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

}

module.exports = DAONotices;