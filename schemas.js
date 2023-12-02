const Schema = require('mongoose').Schema;
const ObjectId = require('mongoose').Types.ObjectId;

const getNewObject = () => {
  return new ObjectId();
}

const opts = { toJSON: { virtuals: true } };

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  thoughts: [{
    type:
      ObjectId, ref: 'Thought'
  }],
  friends: [{
    type: ObjectId, ref: 'User'
  }]
}, opts);

User.virtual('friendCount').get(function () {
  return this.friends.length;
});

const Reaction = new Schema({
  reactionId: {
    type: ObjectId,
    default: getNewObject,
  },
  reactionBody: {
    type: String,
    required: true,
    maxLength: 280
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => new Date(timestamp).toDateString()
  }
});

const Thought = new Schema({
  thoughtText: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => new Date(timestamp).toDateString()
  },
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  reactions: [Reaction]
}, opts);

Thought.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

db.model('User', User);
db.model('Thought', Thought);