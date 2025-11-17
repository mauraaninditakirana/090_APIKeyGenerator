// Model ini akan menangani query ke tabel 'admins'

// Fungsi untuk mencari admin berdasarkan email
exports.findByEmail = (db, email, callback) => {
  const sql = "SELECT * FROM admins WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]); 
  });
};