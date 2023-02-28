import express from "express"
import userController from '../controller/userController'
import playlistController from '../controller/playlistController'
let router = express.Router();

const initWebRoute = (app) =>{
    router.get('/',(req,res)=>{
        res.send("Netflix api")
    })
    // Accounts
    router.get('/accounts',userController.getUser)
    router.get('/accounts/:id',userController.getUserByID)
    router.post('/accounts/delete/:id',userController.deleteUserByID)
    router.post('/accounts/updateUser',userController.updateUser)
    router.post('/accounts/updatePassword',userController.updatePassword)
    router.post('/accounts/updateUsername',userController.updateUsername)
    router.post('/accounts/updateEmail',userController.updateEmail)
    router.post('/accounts/updatePhone',userController.updatePhone)
    router.post('/accounts/insertAccounts',userController.insertAccounts)
    router.post('/accounts/login',userController.login)
    router.post('/accounts/logout',userController.logout)
    router.post('/accounts/register',userController.register)
    router.post('/accounts/checkUser',userController.checkUser)
    
    // Playlist
    router.post('/playlists/addPlaylist',playlistController.addPlaylist)
    router.get('/playlists/getPlaylist/:id',playlistController.getPlaylist)
    router.post('/playlists/delPlaylist',playlistController.deletePlaylist)
    return app.use('/api/v1',router)
}

module.exports = initWebRoute