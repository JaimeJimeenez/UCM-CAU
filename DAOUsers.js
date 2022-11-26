"use strict"

class DAOUsers {

    constructor(pool) { this.pool = pool; }

    insertUser(user, callback) {
        console.log("Hola");
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                this.getUserByEmail(user.email, (err, result) => {
                    if (err) console.log(err);
                    else if (result !== undefined)
                        callback(new Error("Error: Email duplicado"));
                    else {
                        if (user.confirmPass !== user.password)
                            callback(new Error("Error: La contraseña no coincide"));
                        else {
                            // Falta de comprobar que la contraseña sea válida
                            const sql = "INSERT INTO Users (Name, Email, Password, Profile, CreationDate) VALUES (?, ?, ?, ?, ?);";
                            
                            connection.query(sql, [user.name, user.email, user.password, user.profile, user.date], (err) => {
                                connection.release();
                                if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                                else callback(null);
                            });
                        }
                    }
                });
            }
        });
    }

    getUser(name) {
        
    }

    getUserByEmail(email, callback) {
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

    login(user, password, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Users WHERE Email = ? AND Password = ?";

                connection.query(sql, [user, password], (err, result) => {
                    connection.release();
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else {
                        console.log(result);
                        callback(null, result);
                    } 
                })
            }
        });
    }

    getNotices(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else this.getUserByEmail(email, (err, user) => {
                if (err) console.log(err);
                else {
                    const sql = "SELECT Notices.Id, Notices.Date, Notices.Text, Notices.Type, Notices.Done FROM UsersNotices JOIN Notices ON Notices.Id = UsersNotices.IdUser WHERE UsersNotices.IdUser = ?";

                    connection.query(sql, [user.Id], (err, notices) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, notices);
                    });
                }
            });
        });
    }
}

module.exports = DAOUsers;