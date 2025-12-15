import db from '../config/db.js';

const createUser = (req,res)=>{
    const {email,contact,firstName,lastName,role}= req.body;

    db.query('INSERT INTO user (email,contact,first_name,last_name,role) VALUES (?,?,?,?,?)',
    [email,contact,firstName,lastName,role],
    (err,result)=>{
       if (err) return res.status(500).json(err);
      res.json({ message: 'User created', id: result.insertId });
    });

}

const getUsers = (req, res) => {
  db.query('SELECT * FROM User', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
 
export {createUser, getUsers};


