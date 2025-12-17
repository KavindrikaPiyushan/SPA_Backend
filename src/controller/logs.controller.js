import db from '../config/db.js'


export const getLogs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT l.lid, l.action, l.time, u.email
    FROM Logs l
    LEFT JOIN User u ON l.uid = u.uid
    ORDER BY l.time DESC
    LIMIT ? OFFSET ?;
  `;

  db.query(sql, [limit, offset], (err, logs) => {
    if (err) return res.status(500).json(err);

    db.query('SELECT COUNT(*) AS total FROM Logs', (err, count) => {
      if (err) return res.status(500).json(err);

      res.json({
        page,
        limit,
        total: count[0].total,
        data: logs
      });
    });
  });
};