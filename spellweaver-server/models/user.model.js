import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
{
email: { type: String, required: true, unique: true },
passwordHash: { type: String, required: true }, // hashed password
role: {
    type: String,
    enum: ["patient", "therapist", "admin"],
    required: true,
},
name: {
    first: String,
    last: String,
},
npi: { type: String }, // therapist NPI, optional
npiVerified: { type: Boolean, default: false },
therapistId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // patient -> exactly 1 therapist
},
{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
