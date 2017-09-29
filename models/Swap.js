const mongoose = require('mongoose');
const { Schema } = mongoose;

const swapSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  requester: { type: Schema.Types.ObjectId, ref: 'User' },
  status: String
});

module.exports = mongoose.model('Swap', swapSchema);
