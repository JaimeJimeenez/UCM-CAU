"use strict"

class DAOUser {

    constructor(pool) { this.pool = pool; }

    login(user, password, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Users WHERE Email = ? AND Password = ?";

                connection.query(sql, [user, password], (err, result) => {
                    connection.release();
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else callback(null, result[0]);
                })
            }
        });
    }

    insertUser(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                if (user.hasOwnProperty("technical")) {
                    const sql = "INSERT INTO Users (Name, Email, Password, Profile, Employee, Image, Date) VALUES (?, ?, ?, ?, ?, ?, ?);";

                    connection.query(sql, [user.name, user.email, user.password, "technical", user.employee, user.image, user.date], (err) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null);
                    });
                } else {
                    const sql = "INSERT INTO Users (Name, Email, Password, Profile, Image, Date) VALUES (?, ?, ?, ?, ?, ?);";

                    connection.query(sql, [user.name, user.email, user.password, user.profile, user.image, user.date], (err) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null);
                    });
                }
            }
        });
    }

    getUser(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Users WHERE Email = ?";

                connection.query(sql, [email], (err, result) => {
                    connection.release();
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else callback(null, result[0]);
                });
            }
        });
    }

    getNotices(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else this.getUser(email, (err, user) => {
                if (err) callback(err);
                else {
                    const sql = "SELECT * FROM NOTICES JOIN UsersNotices ON UsersNotices.IdUser = ? AND UsersNotices.IdNotice = Id;";
                    
                    connection.query(sql, [user.Id], (err, notices) => {
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, notices);
                    });
                }
            });
        });
    }
}

module.exports = DAOUser;