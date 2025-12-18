import db from '../config/db.js';
import { logInfo } from '../utils/logger.js';

const createUser = (req,res)=>{
    const {email,contact,firstName,lastName,role}= req.body;

    db.query('INSERT INTO user (email,contact,first_name,last_name,role) VALUES (?,?,?,?,?)',
    [email,contact,firstName,lastName,role],
    (err,result)=>{
       if (err) return res.status(500).json(err);
       logInfo(result.insertId, 'user', `User created with id ${result.insertId}`);
      res.json({ message: 'User created', id: result.insertId });
    });

}

const getUsers = (req, res) => {
  db.query('SELECT * FROM User', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

const getUserById = (req,res)=>{
  const {id}= req.params;
  db.query('SELECT * FROM User WHERE uid=?',[id],(err,rows)=>{
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
}

const updateUser = (req, res) => {
  const { id } = req.params;
  const { email, contact, firstName, lastName, role } = req.body;

  db.query('UPDATE user SET email=?, contact=?, first_name=?, last_name=?, role=? WHERE id=?',
    [email, contact, firstName, lastName, role, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
     logInfo(id, 'user', `User updated with id ${id}`);
      res.json({ message: 'User updated', id });
    });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM user WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    logInfo(id, 'user', `User deleted with id ${id}`);
    res.json({ message: 'User deleted', id });
  });
};
 
export {createUser, getUsers, updateUser,getUserById, deleteUser};


