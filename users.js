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

  const addUser = async (req, res, next) => {
    try {
      const User = db.model('User');
      const instance = new User();
      instance.username = req.body.username;
      instance.email = req.body.email;
      await instance.save();
      console.log("Added user!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const updateUser = async (req, res, next) => {
    try {
      const User = db.model('User');
      const filter = { _id: req.params._id };
      const instance = await User.findOne(filter).exec();
  
      if (!instance) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      
      if (req.body.username) {
        instance.username = req.body.username;
      }
      if (req.body.email) {
        instance.email = req.body.email;
      }
      await instance.save();
      console.log("Updated user!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
router.get('/', getAllUsers);
router.get('/:_id', getUser);
router.post('/', addUser);

router.put('/:_id', updateUser);

module.exports = router;
