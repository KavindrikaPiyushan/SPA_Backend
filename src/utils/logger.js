import db from '../config/db.js'

export const logInfo = (action,uid=null)=>{
    db.query('INSERT INTO Logs (action,uid) VALUES (?,?)',
    [action,uid],
    (err,result)=>{
            if (err) console.error('Logging error:', err);
    });
    
}
