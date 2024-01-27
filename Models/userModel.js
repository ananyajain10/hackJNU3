import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
          validator: function(value) {
              return value.length >= 5 && value.length <= 10;
          },
          message: 'User name must be between 5 and 10 characters'
      }
    },

    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
  
        
  
        validate: {
            validator: function (value) {
  
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: 'Invalid email format'
        }
      },

    password: {
      type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 8;
            },
            message: 'Password must be between 8 and 15 characters'
        }
    },

    age:{
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
            return value < 100;
        },
        message: 'Age must be greater than 18'
    }
    
  },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
            return value.length == 10;
        },
        message: 'Phone Number must be 10 of digits'
    }
    },
    info: {
      type: String,
      
    }
    
}
);

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
