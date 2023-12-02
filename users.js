const express = require('express');

const router = express.Router();

const getAllUsers = async (req, res, next) => {
    try {
      const User = db.model('User');
      const instance = await User.find({});
      console.log("Retrieved all users!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
  const getUser = async (req, res, next) => {
    try {
      const User = db.model('User');
      const instance = await User.findOne({ _id: req.params._id });
      if (!instance) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      console.log("Retrieved user!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

router.get('/', getAllUsers);
router.get('/:_id', getUser);

module.exports = router;
