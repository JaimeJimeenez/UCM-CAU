"use strict"

class DAOUser {

    constructor(pool) { this.pool = pool; }

    login(user, password, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Users WHERE Email = ? AND Password = ?;";

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
                    const sql = "INSERT INTO Users (Name, Email, Password, Employee, Image, Date, Active) VALUES (?, ?, ?, ?, ?, ?, 1);";
                    
                    connection.query(sql, [user.name, user.email, user.password, user.employee, user.image, user.date], (err, newUser) => {
                        connection.release();
                        if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                        else callback(null, newUser.insertId);
                    });
                } else {
                    const sql = "INSERT INTO Users (Name, Email, Password, Profile, Image, Date, Active) VALUES (?, ?, ?, ?, ?, ?, 1);";

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
                const sql = "SELECT * FROM Users WHERE Email = ? AND Active = 1;";

                connection.query(sql, [email], (err, user) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, user[0]);
                });
            }
        });
    }

    getTechnicals(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT Id, Name FROM Users WHERE Employee IS NOT NULL AND Active = 1;';

                connection.query(sql, [], (err, technicals) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, technicals);
                });
            }
        });
    }

    getUsers(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error ('Error de conexión a la base de datos: ' + err.message));
            else this.getUser(email, (err, user) => {
                if (err) callback(err);
                else {
                    const sql = 'SELECT * FROM Users WHERE Id != ? AND Active = 1;';

                    connection.query(sql, [user.Id], (err, users) => {
                        connection.release();
                        if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                        else callback(null, users);
                    });
                }
            });
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
                    else if (image.length === 0) callback(new Error('No existe'));
                    else callback(null, image[0].Image);
                });
            }
        });
    }

    getNotices(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else this.getUser(email, (err, user) => {
                if (err) callback(err);
                else if (user.Employee === null) {

                    const sql = 'SELECT Notices.Id, Notices.Type, Notices.Text, Notices.FunctionType, Notices.Function, Notices.Date, Notices.Done, Notices.Active, Users.Name AS Technical FROM Notices JOIN UsersNotices ON UsersNotices.IdUser = ? AND UsersNotices.IdNotice = Id LEFT JOIN Users ON Users.Id = Notices.Technical';

                    connection.query(sql, [user.Id], (err, notices) => {
                        connection.release();
                        if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                        else callback(null, notices);
                    });
                } else {
                    const sql = 'SELECT Notices.Id, Notices.Type, Notices.Text, Notices.FunctionType, Notices.Function, Notices.Date, Notices.Done, Notices.Active, Users.Name AS Username FROM Notices JOIN UsersNotices ON UsersNotices.IdNotice = Id JOIN Users ON UsersNotices.IdUser = Users.Id WHERE Notices.Technical = ?;';

                    connection.query(sql, [user.Id], (err, notices) => {
                        connection.release();
                        if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                        else callback(null, notices);
                    });
                }
            });
        });
    }

    search(id, name, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                const sql = 'SELECT * FROM Users WHERE instr(Name, ?) > 0 AND Id != ?;';

                connection.query(sql, [name, id], (err, users) => {
                    connection.release();
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else callback(null, users);
                });
            }
        });
    }

    deleteUser(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error('Error de conexión a la base de datos: ' + err.message));
            else {
                let sql = 'SELECT * FROM Users WHERE Id = ? AND Active = 1;';

                connection.query(sql, [id], (err, user) => {
                    if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                    else if (user === null) callback(new Error('Error: el usuario no existe'));
                    else {
                        sql = "UPDATE Users SET Active = 0 WHERE Id = ?;";
                        
                        connection.query(sql, [id], (err) => {
                            connection.release();
                            if (err) callback(new Error('Error de acceso a la base de datos: ' + err.message));
                            else callback(null);
                        });
                    }
                });
            }
        });
    }
}

module.exports = DAOUser;