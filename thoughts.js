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
      if (!userRef) {
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

  const updateThought = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const filter = { _id: req.params._id };
      const instance = await Thought.findOne(filter).exec();
  
      if (!instance) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
      
      if (req.body.thoughtText) {
        instance.thoughtText = req.body.thoughtText;
      }
      await instance.save();
      console.log("Updated thought!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const deleteThought = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const User = db.model('User');
      const filter = { _id: req.params._id };
      const instance = await Thought.findOneAndDelete(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
      const userFilter = { _id: instance.userId };
      const userInstance = await User.findOne(userFilter).exec();
      if (userInstance) {
        console.log(instance._id);
        userInstance.thoughts = userInstance.thoughts.filter( (thought) => thought.toString() !== instance._id.toString() );
        userInstance.save();
      }
      console.log("Deleted thought!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const addReaction = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const filter = { _id: req.params._id };
      const instance = await Thought.findOne(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
      instance.reactions.push(req.body);
      await instance.save();
      console.log("Added reaction!");
      res.json(instance);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  
  const deleteReaction = async (req, res, next) => {
    try {
      const Thought = db.model('Thought');
      const filter = { reactionId: req.params.reactionId };
      const instance = await Thought.findOne(filter).exec();
      if (!instance) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
  
      const reaction = instance.reactions.filter( (reaction) => reaction.reactionId.toString() === req.params._reactionId );
      if (reaction.length == 0) {
        res.status(404).json({ message: 'No reaction with this id!' });
        return;
      }
      instance.reactions = instance.reactions.filter( (reaction) => reaction.reactionId.toString() !== req.params._reactionId );
      await instance.save();
  
      console.log("Deleted reaction!");
      res.send(instance);
    } catch (err) {
      res.status(500).json(err);
    }
  }

 
  
router.get('/', getAllThoughts);
router.get('/:_id', getThought);
router.post('/', addThought);
router.put('/:_id', updateThought);
router.delete('/:_id', deleteThought);
router.post('/:_id/reactions', addReaction);
router.delete('/:_id/reactions/:_reactionId', deleteReaction);


module.exports = router;


