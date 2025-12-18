import db from '../config/db.js';

/**
 * Logs a system action performed by a user or admin
 * @param {number} actorId - ID from User.uid or Admin.aid
 * @param {'user'|'admin'} actorType - Type of actor
 * @param {string} action - Description of the action
 */
export const logInfo = (actorId, actorType, action) => {
  db.query(
    'INSERT INTO Logs (actor_id, actor_type, action) VALUES (?,?,?)',
    [actorId, actorType, action],
    (err) => {
      if (err) {
        console.error('Logging error:', err);
      }
    }
  );
};
