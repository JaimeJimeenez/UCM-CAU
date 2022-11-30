"use strict"

class DAOUser {

    constructor(pool) { this.pool = pool; }

    insertStudent(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                let sql = "INSERT INTO Users (Name, Email, Password, Profile, Image, Creation, Active) VALUES (?, ?, ?, 'Alumno', ?, ?, 1) ";
                
                connection.query(sql, [user.name, user.email, user.password, user.image, user.date], (err, newUser) => {
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else {
                        const idFunctions = [1, 3, 4, 6, 7, 8, 13, 15, 16, 18, 21, 22, 26];
                        sql = "INSERT INTO UsersFunctions (IdUser, IdFunction) VALUES (?, )";

                        idFunctions.forEach((id) => {
                            sql = "INSERT INTO UsersFunctions (IdUser, IdFunction) VALUES (?, " + id + " );";
                            connection.query(sql, [newUser.insertId], (err) => {
                                if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                            });
                        });
                        connection.release(); //??
                    }
                });
            }   
        });
    }

    insertPAS(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                let sql = i
            }
        });

    }

    insertPDI(user, callback) {

    }

    insertOldStudent(user, callback) {
        
    }

    insertUser(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "INSERT INTO Users (Name, Email, Password, Profile, Image, Creation, Active) VALUES (?, ?, ?, ?, ?, ?, 1); ";

                connection.query(sql, [user.name, user.email, user.password. user.profile, user.image, user.date], (err, newUser) => {
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else switch (user.profile) {
                        case "Alumno": this.insertStudent(newUser.insertId, (err) => {
                            if (err) console.log(err);
                        });

                        case "PAS": this.insertPAS(newUser.insertId, (err) => {
                            if (err) console.log(err);
                        });

                        case "PDI": this.insertPDI(newUser.insertId, (err) => {
                            if (err) console.log(err);
                        });
                        
                        case "Antiguo Alumno": this.insertOldStudent(newUser.insertId, (err) => {
                            if (err) console.log(err);
                        });
                    }
                });
            }
        });
    }

    createAccount(user, callback) {
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

                            this.insertUser(user, (err) => {
                                if (err) console.log(err);
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
                    else callback(null, result[0]);
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
                    const sql = "SELECT Notices.Date, Notices.Text, Notices.Type, Notices.Done FROM Notices JOIN UsersNotices ON UsersNotices.IdNotice = Notices.Id AND UsersNotices.IdUser = ?;";
                    console.log(user);
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

module.exports = DAOUser;