import mongoose, {Document,Schema} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
     name :{
        type: String,
        required: true
     },
     email : {
        type: String,
        required: true,
        unique: true
     }
},{timestamps: true})

const User = mongoose.model<IUser>('User', UserSchema);

export default User;