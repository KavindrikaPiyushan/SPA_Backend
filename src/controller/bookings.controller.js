import db from '../config/db.js';
import { logInfo } from '../utils/logger.js';

const createBooking = (req,res)=>{
    const { uid,sid,date,time,notes,status="pending"} = req.body;
    db.query('INSERT INTO Bookings (uid,sid,date,time,notes,status) VALUES (?,?,?,?,?,?)',
    [uid,sid,date,time,notes,status],
    (err,result)=>{
         if (err) return res.status(500).json(err);
            logInfo(uid, 'user', `Booking created with id ${result.insertId}`);
        res.json({ message: 'Booking created', bid: result.insertId });
    });
}

const getBookings = (req,res)=>{
    db.query('SELECT * FROM Bookings', (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
}

const getBookingById = (req,res)=>{
    const {bid}= req.params;
    db.query('SELECT * FROM Bookings WHERE bid=?',[bid],(err,rows)=>{
        if (err) return res.status(500).json(err);
        res.json(rows[0]);
    });
}

const updateBooking = (req, res) => {
    const { bid } = req.params;
    const { aid, sid, date, time, notes, status } = req.body;
    db.query('UPDATE Bookings SET uid=?, sid=?, date=?, time=?, notes=?, status=? WHERE bid=?',
        [aid, sid, date, time, notes, status, bid],
        (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Booking not found' });
            logInfo(aid, 'admin', `Booking updated with id ${bid}`);
            res.json({ message: 'Booking updated', bid });
        });
};

const deleteBooking = (req, res) => {
    const { bid } = req.params;
    const { aid } = req.body;
    db.query('DELETE FROM Bookings WHERE bid=?', [bid], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Booking not found' });
        logInfo(aid, 'admin', `Booking deleted with id ${bid}`);
        res.json({ message: 'Booking deleted', bid });
    });
};

export {createBooking, getBookings, getBookingById, updateBooking, deleteBooking};

