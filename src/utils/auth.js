
export const authenticate =  (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token)
        return res.status(401).json({message: 'Access token missing'});

    try{
        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );
        req.user = {id: payload.userId, role: payload.role};
        next();
    }catch(err){
      return   res.status(401);
    }
}