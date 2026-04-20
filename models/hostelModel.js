import mongoose from "mongoose";


const HostelSchema = new mongoose.Schema({
    admin: {type: mongoose.Schema.Types.ObjectId, ref: ''}
})