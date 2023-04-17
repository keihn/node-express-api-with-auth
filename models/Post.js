const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const PostSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        body: {type: String, required: true},
        excerpt: String,
        thumbnail: String,
        author:{type:Schema.Types.ObjectId, ref:'User'}
    },
    {
        timestamps: true
    }
);

const PostModel = model('Post', PostSchema)

module.exports = PostModel;
