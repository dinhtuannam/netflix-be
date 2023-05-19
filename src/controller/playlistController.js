import pool from "../configs/connectDB";

const getPlaylist = async(req,res)=>{
    try{
        const id = req.params.id;
        const [rows,field] = await pool.execute(`Select * from playlists where ID_User = ?`,[id])
        return res.status(200).json({
            dataPlaylist:rows
        });
    }
    catch(e){
        console.log(e)
    }
    
}

const addPlaylist = async(req,res)=>{
    try{
        console.log(req.body);
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
    catch(e){
        console.log("req : " + req.body)
        console.log("error : " + e)
    }
    
}

const deletePlaylist = async(req,res)=>{
    try{
        let {ID_User,ID_Movie} = req.body;
        await pool.execute(`Delete from playlists where ID_User = ? and ID_Movie = ? `,
        [ID_User,ID_Movie])
            return res.status(200).json({result:true,message:"Delete Success"})
    }
    catch(e){
        console.log(e);
    }
   
}


module.exports = {
    addPlaylist ,
    getPlaylist ,
    deletePlaylist
}