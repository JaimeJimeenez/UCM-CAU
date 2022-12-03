"use strict"

const DAOUser = require("./DAOUser");

class DAONotices {

    constructor(pool) { this.pool = pool; }

    newNotice(user, notice, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                let daoUser = new DAOUser(this.pool);
                const sql = "INSERT INTO Notices (Text) VALUE (?)";

                connection.query(sql, [notice], (err, result) => {
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else daoUser.insertUserNotice(user, result.insertId, (err) => {
                        if (err) console.log(err);
                        else callback(null);
                    });
                });
            }
        });
    }

    getNotice(notice, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(new Error("Error de conexión a la base de datos: " + err.message));
            else {
                const sql = "SELECT * FROM Notices WHERE Id = ?;";

                connection.query(sql, [notice], (err, result) => {
                    console.log("Hola");
                    console.log(result);
                    if (err) callback(new Error("Error de acceso a la base de datos: " + err.message));
                    else callback(err, result);
                });
            }
        });
    }

}

module.exports = DAONotices;