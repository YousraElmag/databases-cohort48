function getPopulation(Country, name, code, cb) {
    // assuming that connection to the database is established and stored as conn
    conn.query(
      `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`,
      function (err, result) {
        if (err) cb(err);
        if (result.length == 0) cb(new Error("Not found"));
        cb(null, result[0].name);
      }
    );
  }


  1-SELECT Population FROM ${Country} WHERE Name = '' OR '1'='1' and code = '' OR '1'='1'
  2-

  function getPopulation(Country, name, code, cb) {
    conn.query(
      `SELECT Population FROM ?? WHERE Name = ? AND code = ?`,
      [Country, name, code],
      function (err, result) {
        if (err) return cb(err);
        if (result.length == 0) return cb(new Error("Not found"));
        cb(null, result[0].Population);
      }
    );
  }
