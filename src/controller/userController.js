import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
import e from "express";

let getUser = async(req,res) =>{
    try{
        const [rows,field] = await pool.execute("Select * from accounts")
        return res.status(200).json({
            dataUser:rows
        });
    }
    catch(e){
        console.log(e);
    }
}

let getUserByID = async(req,res) =>{
    try{
        const id = req.params.id;
        const [rows,field] = await pool.execute(`Select * from accounts where id = ?`,[id])
        rows[0].password = rows[0].password.replace(/[0-9a-z]/gi, '*');
        return res.status(200).json({
            dataUser:rows
        });
    }
    catch(e){
        console.log(e)
    }
    
}

const updatePassword = async(req,res)=>{
    try{
        let {currentPassword,newPassword,id} = req.body;
        const [rows,field] = await pool.execute(`select * from accounts where password = ? and id = ?`,[currentPassword,id])
        if(rows.length<=0)
            return res.status(200).json({result:false,message:"current password is not correct"})
        else{
            await pool.execute(`update accounts set password = ? where id = ?`,[newPassword,id])
            return res.status(200).json({result:true,message:"update password successfully"})
        }        
    }
    catch(e){
        console.log(e);
    }
    
}

const updateUsername = async(req,res)=>{
    try{
        let {username,id} = req.body;
        const [rows,field] = await pool.execute(`select * from accounts where username = ? `,[username])
        if(rows.length>0)
            return res.status(200).json({result:false,message:"username has been used"})
        else{
            await pool.execute(`update accounts set username = ? where id = ?`,[username,id])
            return res.status(200).json({result:true,message:"update username success"})
        }        
    }
    catch(e){
        console.log(e);
    }
    
}

const updateEmail = async(req,res)=>{
    try{
        let {email,id} = req.body;
        await pool.execute(`update accounts set email = ? where id = ?`,[email,id])
            return res.status(200).json({result:true,message:"update email success"})        
    }
    catch(e){
        console.log(e);
    }
    
}

const updatePhone = async(req,res)=>{
    try{
        let {phone,id} = req.body;
        await pool.execute(`update accounts set phone = ? where id = ?`,[phone,id])
            return res.status(200).json({result:true,message:"update phone success"})        
    }
    catch(e){
        console.log(e);
    }
    
}

const generateAccessToken = (rows) =>{
    try{
        const accessToken = jwt.sign({
            id: rows[0].id,
            role: rows[0].role
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn : "30s"}
        );
        return accessToken        
    }
    catch(e){
        console.log(e);
    }
    
}

const generateRefreshToken = (rows) =>{
    try{
        const accessToken = jwt.sign({
            id: rows[0].id,
            role: rows[0].role
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn : "365d"}
        );
        return accessToken       
    }
    catch(e){
        console.log(e);
    }
    
}

let login = async(req,res)=>{
    try{
        let {username,password} = req.body;
        if(!username || !password)
            return res.status(404).json({result:"missing username or password"})
        const [rows,field] = await pool.execute(`Select * from accounts where username = ? and password = ? `,
        [username,password])
        if(rows.length<=0)
            return res.status(200).json({message:"username or password are not correct"})
        else{
            const accessToken = generateAccessToken(rows);
            const refreshToken = generateRefreshToken(rows);
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            })
            const {password,...data} = rows[0]
            return res.status(200).json({
                dataUser:data,
                token:accessToken,
                message:"Login Success"
            })
        }       
    }
    catch(e){
        console.log(e);
    }
        
}

let logout = (req,res) =>{
    try{
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out !")       
    }
    catch(e){
        console.log(e);
    }
    
}

let register = async(req,res) =>{
    try{
        let {username,password,email,phone,role} = req.body;
        if(!username || !password || !email || !phone )
            return res.status(404).json({result:false,message:"missing information"})
        await pool.execute(`insert into accounts(username,password,email,phone,role) values(?,?,?,?,?)`,
        [username,password,email,phone,role])
        return res.status(200).json({result:true,message:"register successfully"})       
    }
    catch(e){
        console.log(e);
    }
    

}

let checkUser = async(req,res) =>{
    try{
        let { username }= req.body
        let [rows,fields] = await pool.execute(`select * from accounts where username = ? `,
        [username])
        if(rows.length>0)
            return res.status(200).json({result:false,message:"username has been used"})
        else
            return res.status(200).json({result:true,message:"username is only"})        
    }
    catch(e){
        console.log(e);
    }
    
}

let deleteUserByID = async(req,res) =>{
    try{
        const id = req.params.id;
        await pool.execute(`delete from accounts where id = ?`,[id])
        return res.status(200).json({result:true,message:"Sucessfully delete"})
    }
    catch(e){
        console.log(e);
    }
    
}

let updateUser = async(req,res) =>{
    try{
        let {id,username,password,email,phone,role} = req.body;
        const [rows,field] = await pool.execute(`select * from accounts where username = ? `,[username])
        if(rows.length>0)
            return res.status(200).json({result:false,message:"username has been used"})
        else{
            await pool.execute(`update accounts set username = ? , password = ? , email = ? ,phone = ? , role = ? where id = ? `,
            [username,password,email,phone,role,id])
            return res.status(200).json({
                result:"true",
                message:"update success"
            })
        }
    }
    catch(e){
        console.log(e);
    }
    
}

let insertAccounts = async(req,res) =>{
    try{
        let {username,password,email,phone,role} = req.body;
        const [rows,field] = await pool.execute(`select * from accounts where username = ? `,[username])
        if(rows.length>0)
            return res.status(200).json({result:false,message:"username has been used"})
        else{
            await pool.execute(`insert into accounts(username,password,email,phone,role) values(?,?,?,?,?)`,
            [username,password,email,phone,role])
            return res.status(200).json({result:true,message:"insert account successfully"})
        }
    }
    catch(e){
        console.log(e);
    }
    
}

module.exports = {
    getUser,
    getUserByID,
    deleteUserByID,
    login,
    logout,
    register,
    checkUser,
    updatePassword,
    updateUsername,
    updateEmail,
    updatePhone,
    updateUser,
    insertAccounts
}