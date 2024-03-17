const { timeStamp } = require('console');
const mongoose =require('mongoose');
const {Schema} = require('mongoose');

// Connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/LegalBharat').then(()=>{
    console.log("connected to db");
}).catch((err)=>{console.log(`DB connection error ${err}.`)});

// lawyer schema
const lawyer_schema=new mongoose.Schema({
    full_lawyer_name:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    City_lawyer:
    {
        type:String,
        //required: true
    },
    State_lawyer:{
        type:String,
        //unique:true,
        //required: true
    },
    Full_address_lawyer:{
        type:String,
        //unique:true,
        //required: true
    },
    pic_lawyer:
    {
        type:String,
        //required:true
    },
    phone_number_lawyer:{
        type:String,
        //required: true,
        //unique:true
    },
    password:{
        type:String,
        required:true,
        min:7,
        max:20
    },
    barAssociationProof: {
        type: Schema.Types.ObjectId,
        ref: 'file' 
    },
    educationalProof: {
        type: Schema.Types.ObjectId,
        ref: 'file' 
    },
    legalLicenseProof: {
        type: Schema.Types.ObjectId,
        ref: 'file' 
    },
    malpracticeInsuranceProof: {
        type: Schema.Types.ObjectId,
        ref: 'file' 
    },
    nl:{
        type:String,
        min:7,
        max:50
    }
});

// user schema
const users_schema=new mongoose.Schema({
    first_user_name:{
        type:String,
        required: true
    },
    last_user_name:{
        type:String,
        required: true
    },
    City:
    {
        type:String
    },
    State:{
        type:String,
    },
    Full_address:{
        type:String
    },
    Img_url:
    {
        type: String
    },
    email_user:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:7,
        max:20
    }
});

// Connection schema
const connectionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_collection', // Reference to the user model
      required: true
    },
    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'lawyer_collection', // Reference to the lawyer model
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Connection model
  const Connection = mongoose.model('Connection', connectionSchema);
  


// modal creation for CRUD operation on DB
const lawyer_modal=mongoose.model('lawyer_collection',lawyer_schema);
const user_modal=mongoose.model('user_collection',users_schema);

module.exports={user_modal,lawyer_modal,Connection};