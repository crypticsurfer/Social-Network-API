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
  
  const deleteUser = async (req, res, next) => {
    try {
      const User = db.model('User');
      const filter = { _id: req.params._id };
      const instance = await User.findOneAndDelete(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      console.log("Deleted user!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const addFriend = async (req, res, next) => {
    try {
      const User = db.model('User');
      const filter = { _id: req.params.userId };
      const instance = await User.findOne(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      const secondFilter = { _id: req.params.friendId };
      const friendInstance = await User.findOne(secondFilter).exec();
      if (!friendInstance) {
        res.status(404).json({ message: 'No friend with this id!' });
        return;
      }
      const friendExists = instance.friends.filter( (friend) => friend.toString() === req.params.friendId );
      if (friendExists.length > 0) {
        res.status(500).json({ message: 'User already has this friend!' });
        return;
      }
      instance.friends.push(req.params.friendId);
      await instance.save();
      console.log("Added friend!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
  const deleteFriend = async (req, res, next) => {
    try {
      const User = db.model('User');
      const filter = { _id: req.params.userId };
      const instance = await User.findOne(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      const secondFilter = { _id: req.params.friendId };
      const friendInstance = await User.findOne(secondFilter).exec();
      if (!friendInstance) {
        res.status(404).json({ message: 'No friend with this id!' });
        return;
      }
      const friendExists = instance.friends.filter( (friend) => friend.toString() === req.params.friendId );
      if (friendExists.length == 0) {
        res.status(500).json({ message: 'User does not have this friend!' });
        return;
      }
      instance.friends = instance.friends.filter( (friend) => friend.toString() !== req.params.friendId );;
      await instance.save();
      console.log("Removed friend!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }


router.get('/', getAllUsers);
router.get('/:_id', getUser);
router.post('/', addUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.post('/:userId/friends/:friendId', addFriend);
router.delete('/:userId/friends/:friendId', deleteFriend);

module.exports = router;
