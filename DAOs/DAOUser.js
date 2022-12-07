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
                if (user.hasOwnProperty("employee")) {
                    const sql = "INSERT INTO Users (Name, Email, Password, Employee, Image, Date) VALUES (?, ?, ?, ?, ?, ?);";
                    console.log(user);
                    connection.query(sql, [user.name, user.email, user.password, user.employee, user.image, user.date], (err, newUser) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, newUser.insertId);
                    });
                } else {
                    const sql = "INSERT INTO Users (Name, Email, Password, Profile, Image, Date) VALUES (?, ?, ?, ?, ?, ?);";

                    connection.query(sql, [user.name, user.email, user.password, user.profile, user.image, user.date], (err, newUser) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, newUser.insertId);
                    });
                }
            }
        });
    }

    insertUserNotice(user, notice, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = "INSERT INTO UsersNotices (IdUser, IdNotice) VALUES (?, ?);";

                connection.query(sql, [user, notice], (err) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null);
                });
            }
        });
    }

    getUser(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Users WHERE Email = ?;";

                connection.query(sql, [email], (err, user) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, user[0]);
                });
            }
        });
    }

    getImage(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT Image FROM Users WHERE Id = ?;';

                connection.query(sql, [id], (err, image) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else if (image.length === 0) callback('No existe');
                    else callback(null, image[0].Image);
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
                    const sql = "SELECT * FROM Notices JOIN UsersNotices ON UsersNotices.IdUser = ? AND UsersNotices.IdNotice = Id;";

                    connection.query(sql, [user.Id], (err, notices) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, notices);
                    });
                }
            });
        });
    }

    getUsers(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else this.getUser(email, (err, user) => {
                if (err) callback(err);
                else {
                    const sql = 'SELECT * FROM Users WHERE Id IS NOT ?;';

                    connection.query(sql, [user.Id], (err, users) => {
                        connection.release();
                        if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                        else callback(null, users);
                    });
                }
            });
        });
    }
}

module.exports = DAOUser;