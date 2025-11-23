const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
  type: String, 
  required: true,
  validate: {
    validator: function (value) {
      // minimal 8 karakter, ada huruf besar, angka, dan karakter khusus
      return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
    },
    message: 'Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.'
  }
  },

  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },

  bookmarks: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Film' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
