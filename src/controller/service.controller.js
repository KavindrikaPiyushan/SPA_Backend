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
        const services = rows.map(service => ({
            ...service,
            media: service.media ? JSON.parse(service.media) : []
        }));
        res.json(services);
    });
}

const getServiceById = (req, res) => {
    const { sid } = req.params;
    db.query('SELECT * FROM Service WHERE sid=?', [sid], (err, rows) => {
        if (err) return res.status(500).json(err);
        if (rows.length === 0) return res.status(404).json({ message: 'Service not found' });
        const service = {
            ...rows[0],
            media: rows[0].media ? JSON.parse(rows[0].media) : []
        };
        res.json(service);
    });
}

const updateService = (req,res)=>{
    const {sid}= req.params;
    const updateData = { ...req.body };
    if (updateData.media) {
        updateData.media = JSON.stringify(updateData.media);
    }
    db.query('UPDATE Service SET ? WHERE sid=?',[updateData,sid],(err,result)=>{
        if (err) return res.status(500).json(err);
       logInfo(req.body.aid, 'admin', `Service updated with id ${sid}`);
        res.json({message:'Service updated', sid});
    });
}

const deleteService = (req,res)=>{
    const {sid}= req.params;
    db.query('DELETE FROM Service WHERE sid=?',[sid],(err,result)=>{
        if (err) return res.status(500).json(err);
        logInfo(sid, 'admin', `Service deleted with id ${sid}`);
        res.json({message:'Service deleted', sid});
    });
}

export { createService, getServices, getServiceById, updateService, deleteService };