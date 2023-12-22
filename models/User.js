import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {  type:String, enum:["user","intern","supplier"],default:"user"},
        trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
        whatsAppNumber:{ type: String}
    }
);

const User = mongoose.model('User', userSchema);

export default User;
