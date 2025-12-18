import db from '../config/db.js';

export const getLogs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const logsSql = `
    SELECT 
      l.lid,
      l.action,
      l.time,
      l.actor_type,
      CASE 
        WHEN l.actor_type = 'user' THEN u.first_name
        WHEN l.actor_type = 'admin' THEN a.first_name
      END AS first_name,
      CASE
        WHEN l.actor_type = 'user' THEN u.last_name
        WHEN l.actor_type = 'admin' THEN a.last_name
      END AS last_name,
      CASE 
        WHEN l.actor_type = 'user' THEN u.contact
        WHEN l.actor_type = 'admin' THEN a.contact
      END AS contact
    FROM Logs l
    LEFT JOIN User u 
      ON l.actor_type = 'user' AND l.actor_id = u.uid
    LEFT JOIN Admin a 
      ON l.actor_type = 'admin' AND l.actor_id = a.aid
    ORDER BY l.time DESC
    LIMIT ? OFFSET ?;
  `;

  db.query(logsSql, [limit, offset], (err, logs) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch logs' });
    }

    const countSql = `SELECT COUNT(*) AS total FROM Logs`;

    db.query(countSql, (err, countResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to count logs' });
      }

      res.json({
        page,
        limit,
        total: countResult[0].total,
        data: logs
      });
    });
  });
};
