import db from '../config/db.js';

const createService = (req, res) => {
   const { name, duration, description, uid } = req.body;

   db.query(
    'INSERT INTO Service (name, duration, description, uid) VALUES (?,?,?,?)',
    [name, duration, description, uid],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Service created', sid: result.insertId });
    }
  );
}


const getServices = (req, res) => {

    db.query('SELECT * FROM Service', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
}

const getServiceById = (req, res) => {
    const { sid } = req.params;
    db.query('SELECT * FROM Service WHERE sid=?', [sid], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows[0]);
    });
}

const updateService = (req,res)=>{
    const {sid}= req.params;
    db.query('UPDATE Service SET ? WHERE sid=?',[req.body,sid],(err,result)=>{
        if (err) return res.status(500).json(err);
        res.json({message:'Service updated', sid});
    });
}

const deleteService = (req,res)=>{
    const {sid}= req.params;
    db.query('DELETE FROM Service WHERE sid=?',[sid],(err,result)=>{
        if (err) return res.status(500).json(err);
        res.json({message:'Service deleted', sid});
    });
}

export { createService, getServices, getServiceById, updateService, deleteService };