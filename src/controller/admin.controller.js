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

    await saveRefreshToken(user.aid, refreshToken, 'admin')
    
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


const saveRefreshToken = async (actorId, token, actorType = 'admin') => {
  try {
    await db.promise().query(
      'INSERT INTO refresh_tokens (actor_id, actor_type, token) VALUES (?, ?, ?)',
      [actorId, actorType, token]
    );
  } catch (err) {
    // log or rethrow so caller can respond
    throw err;
  }
};

export const tokenRefreshing = async (req,res)=>{
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken)
        return res.status(401).json({message: 'Refresh token missing'});

    const stored = await findRefreshToken(refreshToken);
    if(!stored)
        return res.status(403).json({message: 'Invalid refresh token'});

    try{
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const user = await getUserById(payload.userId);
        const newAccessToken = createAccessToken(user);

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 15 * 60 * 1000
        });

        res.json({message: 'Access token refreshed'});
    }catch(err){
        return res.status(403).json({message: 'Invalid refresh token'});
    }

}

const findRefreshToken = async(token) => {
    try{
        const [rows] = db.query(
            'SELECT * FROM refresh_tokens WHERE token=?',
            [token]
        );
        return rows[0];
    }catch(err){
        throw err;
    }
}


export const adminLogout = async (req,res)=>{
    const refreshToken = req.cookies.refresh_token;
    if(refreshToken){
        await deleteRefreshToken(refreshToken);
    }

    res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.json({ message: "Logged out" });
}


const deleteRefreshToken = async(token) => {
    try{
        await db.promise().query(
            'DELETE FROM refresh_tokens WHERE token=?',
            [token]
        );
    }catch(err){
        throw err;
    }
}

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Admin WHERE aid=?', [id], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}