import db from '../config/db.js';
import { logInfo } from '../utils/logger.js';

const createService = (req, res) => {
   const { name, duration, description, aid, media } = req.body;

   db.query(
    'INSERT INTO Service (name, duration, description, aid, media) VALUES (?,?,?,?,?)',
    [name, duration, description, aid, JSON.stringify(media)],
    (err, result) => {
      if (err) return res.status(500).json(err);
        logInfo(aid, 'admin', `Service created with id ${result.insertId}`);
      res.json({ message: 'Service created', sid: result.insertId });
    }
  );
}


// get active services


const getServices = (req, res) => {

    db.query('SELECT * FROM Service where status="active"', (err, rows) => {
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
    const {aid}= req.params;
    db.query('UPDATE Service SET ? WHERE aid=?',[req.body,aid],(err,result)=>{
        if (err) return res.status(500).json(err);
       logInfo(aid, 'admin', `Service updated with id ${aid}`);
        res.json({message:'Service updated', aid});
    });
}

const deleteService = (req,res)=>{
    const {aid}= req.params;
    db.query('DELETE FROM Service WHERE aid=?',[aid],(err,result)=>{
        if (err) return res.status(500).json(err);
        logInfo(aid, 'admin', `Service deleted with id ${aid}`);
        res.json({message:'Service deleted', aid});
    });
}

export { createService, getServices, getServiceById, updateService, deleteService };