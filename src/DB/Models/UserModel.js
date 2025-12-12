import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({




  
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;