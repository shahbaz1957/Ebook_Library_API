import mongoose,{ Model} from "mongoose";
import type{ IUser } from "./userTypes.js";
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Model name ( Users because monogDb add s in last , User becomes Users)
export default mongoose.model<IUser>("User", userSchema);

// const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
// export default User;