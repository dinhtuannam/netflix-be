import pool from "../configs/connectDB";

const getPlaylist = async(req,res)=>{
    const id = req.params.id;
    const [rows,field] = await pool.execute(`Select * from playlists where ID_User = ?`,[id])
    return res.status(200).json({
        dataPlaylist:rows
    });
}

const addPlaylist = async(req,res)=>{
    let {ID_User,ID_Movie,movieName,img,date,rating} = req.body;
    const [rows,field] = await pool.execute(`select * from playlists where ID_User = ? and ID_Movie = ? `,
    [ID_User,ID_Movie])
    if(rows.length > 0)
        return res.status(200).json({result:false,message:"The movie already in playlist . Please choose another one"})
    else{
        await pool.execute(`insert into playlists(ID_User,ID_Movie,movieName,img,date,rating) values(?,?,?,?,?,?)`,
        [ID_User,ID_Movie,movieName,img,date,rating])
        return res.status(200).json({result:true,message:"Add movie success"})
    }
}

const deletePlaylist = async(req,res)=>{
    let {ID_User,ID_Movie} = req.body;
    await pool.execute(`Delete from playlists where ID_User = ? and ID_Movie = ? `,
    [ID_User,ID_Movie])
        return res.status(200).json({result:true,message:"Delete Success"})
}


module.exports = {
    addPlaylist ,
    getPlaylist ,
    deletePlaylist
}