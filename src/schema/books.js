
import mongoose  from 'mongoose'

const booksCollection = 'books'

const booksSchema = new mongoose.Schema({
    pk:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    published_date:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    published_date:{
        type:Date,
        required:true
    },
    autor_id:{
        type:Date,
        required:true
    },
    category_id:{
        type:Date,
        required:true
    }
    
})

const books = mongoose.model(booksCollection, booksSchema)
export default books;



























