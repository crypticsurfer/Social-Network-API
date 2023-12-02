const express = require('express');

const router = express.Router();

const getAllThoughts = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const instance = await Thought.find({});
      console.log("Retrieved all thoughts!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

const getThought = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const instance = await Thought.findOne({ _id: req.params._id });
      if (!instance) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
      console.log("Retrieved thought!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const addThought = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const User = db.model('User');
      const instance = new Thought();
      const userRef = await User.findOne({ _id: req.body.userId });
      if (!instance) {
        res.status(404).json({ message: 'No user with this userId!' });
        return;
      }
      instance.thoughtText = req.body.thoughtText;
      instance.username = userRef.username;
      instance.userId = req.body.userId;
      await instance.save();
      console.log(instance._id);
      userRef.thoughts.push(instance._id);
      await userRef.save();
      console.log("Added thought!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

router.get('/', getAllThoughts);
router.get('/:_id', getThought);

router.post('/', addThought);

module.exports = router;


