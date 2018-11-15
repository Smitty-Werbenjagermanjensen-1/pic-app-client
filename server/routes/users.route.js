/* Dependencies */
var users = require('../controllers/user.controller.js'),
    express = require('express'),
    router = express.Router();

//requests at / call the associated controller function to interact from database
router.route('/')
.get(users.list)
.post(users.create);

router.route('/delete/:userId').delete(users.deleteUser);



//requests at /:userId call the associated controller functions to interact with the database
router.route('/:username')
  .get(users.read)
  .put(users.updateAddPhoto);
  
router.route('/auth').post(users.authenticate);



//This is for handling any router params by first passing it to the controller function that binds id to a variable
//and then sends it to the next appropiate function
router.param('userId', users.userByID);
router.param('username', users.userByUser);
//router.param('photo', users.userByUser);

module.exports = router;
