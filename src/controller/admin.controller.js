import db from '../config/db.js';
import { logInfo } from '../utils/logger.js';

export const createAdmin = async (req,res) =>{
    const {email,contact,firstName,lastName,password} = req.body;
    if(!email || !contact || !password)
        return res.status(400).json({message: 'Email, contact and password are required'});

    const existing = await getUserByEmail(email);
    if(existing)
        return res.status(409).json({message: 'Admin with this email already exists'});

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query('INSERT INTO admin (email,contact,first_name,last_name,password_hash) VALUES (?,?,?,?,?)',
        [email,contact,firstName,lastName,hashedPassword],
        (err,result)=>{
              if (err) return res.status(500).json(err);
                logInfo(result.insertId, 'admin', `Admin created with id ${result.insertId}`);
                res.json({ message: 'Admin created', id: result.insertId });
        }
    )

}