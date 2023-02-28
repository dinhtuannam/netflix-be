import pool from "../configs/connectDB";
import jwt from "jsonwebtoken";
import e from "express";

let getUser = async(req,res) =>{

    const [rows,field] = await pool.execute("Select * from accounts")
    return res.status(200).json({
        dataUser:rows
    });
}

let getUserByID = async(req,res) =>{
    const id = req.params.id;
    const [rows,field] = await pool.execute(`Select * from accounts where id = ?`,[id])
    rows[0].password = rows[0].password.replace(/[0-9a-z]/gi, '*');
    return res.status(200).json({
        dataUser:rows
    });
}

const updatePassword = async(req,res)=>{
    let {currentPassword,newPassword,id} = req.body;
    const [rows,field] = await pool.execute(`select * from accounts where password = ? and id = ?`,[currentPassword,id])
    if(rows.length<=0)
        return res.status(200).json({result:false,message:"current password is not correct"})
    else{
        await pool.execute(`update accounts set password = ? where id = ?`,[newPassword,id])
        return res.status(200).json({result:true,message:"update password successfully"})
    }
}

const updateUsername = async(req,res)=>{
    let {username,id} = req.body;
    const [rows,field] = await pool.execute(`select * from accounts where username = ? `,[username])
    if(rows.length>0)
        return res.status(200).json({result:false,message:"username has been used"})
    else{
        await pool.execute(`update accounts set username = ? where id = ?`,[username,id])
        return res.status(200).json({result:true,message:"update username success"})
    }
}

const updateEmail = async(req,res)=>{
    let {email,id} = req.body;
    await pool.execute(`update accounts set email = ? where id = ?`,[email,id])
        return res.status(200).json({result:true,message:"update email success"})
}

const updatePhone = async(req,res)=>{
    let {phone,id} = req.body;
    await pool.execute(`update accounts set phone = ? where id = ?`,[phone,id])
        return res.status(200).json({result:true,message:"update phone success"})
}

const generateAccessToken = (rows) =>{
    const accessToken = jwt.sign({
        id: rows[0].id,
        role: rows[0].role
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn : "30s"}
    );
    return accessToken
}

const generateRefreshToken = (rows) =>{
    const accessToken = jwt.sign({
        id: rows[0].id,
        role: rows[0].role
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn : "365d"}
    );
    return accessToken
}

let login = async(req,res)=>{
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

let logout = (req,res) =>{
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out !")
}

let register = async(req,res) =>{
    let {username,password,email,phone,role} = req.body;
    if(!username || !password || !email || !phone )
        return res.status(404).json({result:false,message:"missing information"})
    await pool.execute(`insert into accounts(username,password,email,phone,role) values(?,?,?,?,?)`,
    [username,password,email,phone,role])
    return res.status(200).json({result:true,message:"register successfully"})

}

let checkUser = async(req,res) =>{
    let { username }= req.body
    let [rows,fields] = await pool.execute(`select * from accounts where username = ? `,
    [username])
    if(rows.length>0)
        return res.status(200).json({result:false,message:"username has been used"})
    else
        return res.status(200).json({result:true,message:"username is only"})
}

let deleteUserByID = async(req,res) =>{
    const id = req.params.id;
    await pool.execute(`delete from accounts where id = ?`,[id])
    return res.status(200).json({result:true,message:"Sucessfully delete"})
}

let updateUser = async(req,res) =>{
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

let insertAccounts = async(req,res) =>{
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