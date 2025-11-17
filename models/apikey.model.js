// Model ini akan menangani query ke tabel 'apikeys'

// Fungsi untuk membuat apikey baru
exports.create = (db, apiKeyData, callback) => {
  const sql = "INSERT INTO apikeys (user_id, api_key, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      apiKeyData.user_id,
      apiKeyData.api_key,
      apiKeyData.start_date,
      apiKeyData.end_date,
      apiKeyData.status || 'valid' // Default status 'valid'
    ],
    (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    }
  );
};
// Fungsi untuk mengupdate status key yang kadaluwarsa
exports.updateExpiredKeys = (db, callback) => {
  // Set status ke 'invalid' jika end_date sudah lewat
  const sql = "UPDATE apikeys SET status = 'invalid' WHERE end_date < CURDATE() AND status = 'valid'";
  db.query(sql, callback);
};
// Fungsi untuk mengambil SEMUA apikey (digabung dengan data user)
exports.getAllWithUser = (db, callback) => {
  const sql = `
    SELECT 
      users.first_name, 
      users.last_name, 
      users.email, 
      apikeys.id, 
      apikeys.status, 
      apikeys.end_date 
    FROM apikeys 
    JOIN users ON apikeys.user_id = users.id 
    ORDER BY apikeys.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

// Fungsi untuk mengambil SATU apikey (detail lengkap)
exports.getOneWithUser = (db, keyId, callback) => {
  const sql = `
    SELECT 
      users.first_name, 
      users.last_name, 
      users.email, 
      apikeys.api_key, 
      apikeys.start_date, 
      apikeys.end_date, 
      apikeys.status,
      apikeys.id
    FROM apikeys 
    JOIN users ON apikeys.user_id = users.id 
    WHERE apikeys.id = ?
  `;
  db.query(sql, [keyId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]); // Kembalikan 1 data saja
  });
};

// Fungsi untuk menghapus API Key berdasarkan ID
exports.deleteById = (db, keyId, callback) => {
  const sql = "DELETE FROM apikeys WHERE id = ?";
  db.query(sql, [keyId], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result.affectedRows);
  });
};
