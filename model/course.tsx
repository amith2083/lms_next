
import mongoose,{Schema} from "mongoose";

const courseSchema = new Schema({
    title:{
        required: true,
        type: String
    },
    subtitle:{
        required: false,
        type: String
    },
    description:{
        required: true,
        type: String
    },
    thumbnail:{
        required: false,
        type: String
    },
  modules: {
  type: [Schema.Types.ObjectId],
  ref: "Module",
  default: [],
},

    price:{
        required: false,
        type: Number
    },
    active:{
        type: Boolean,
        default:false,
    },   
    category:{  type: Schema.ObjectId, ref: "Category" ,
        default: null,
  required: false,
    },

    instructor:{  type: Schema.ObjectId, ref: "User" },

    testimonials:[{  type: Schema.ObjectId, ref: "Testimonial" }],

    quizSet:{
        required: false,
        type: Schema.ObjectId
    },
    learning:{
        required: false,
        type: [String]
    },  
    createdOn:{
        required: true,
        default:Date.now(),
        type: Date
    },    
    modifiedOn:{
        required: true,
          default:Date.now(),
        type: Date
    },
});
export const Course = mongoose.models.Course ?? mongoose.model("Course",courseSchema);
