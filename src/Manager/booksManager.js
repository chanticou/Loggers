import books from '../schema/books.js'
import booksArray from '../booksArray/books.js'
import mongoConnect from '../mognoConnect/mongoConfig.js'


mongoConnect()

const CRUD = async()=>{
   let insertMany =  await books.insertMany(booksArray)
   console.log(insertMany)
}   


export default CRUD;