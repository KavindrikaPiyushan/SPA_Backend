import db from '../config/db.js';
import { logInfo } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../utils/tokenHelpers.js';

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
export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Admin WHERE email=?', [email], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}

export const adminLogin = async (req,res) =>{
    const {email,password}= req.body;
    
    const user = await getUserByEmail(email);
    if(!user) 
        return res.status(401).json({message: 'Invalid email or password'});

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if(!passwordMatch)
        return res.status(401).json({message: 'Invalid email or password'});

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)

    await saveRefreshToken(user.aid, refreshToken)
    
    res.cookie('access_token', accessToken, {
         httpOnly: true, 
         secure: true,
         sameSite: "None",
         maxAge: 15 * 60 * 1000
        });
    res.cookie('refresh_token', refreshToken, { 
        httpOnly: true, 
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });


    logInfo(user.aid, 'admin', `Admin logged in with id ${user.aid}`);
    res.json({message: 'Login successful'});

}


const saveRefreshToken = async (adminId, token) => {
  try {
    await db.promise().query(
      'INSERT INTO AdminTokens (admin_id, token) VALUES (?, ?)',
      [adminId, token]
    );
  } catch (err) {
    // log or rethrow so caller can respond
    throw err;
  }
};