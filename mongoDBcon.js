const { timeStamp } = require('console');
const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017').then(()=>{
    console.log("connected to db");
}).catch((err)=>{console.log(`DB connection error ${err}.`)});

// property schema
const property_schema=new mongoose.Schema({
    contact_person_full_name:{
        type:String,
        required: true
    },
    State:{
        type:String,
        required: true
    },
    City:
    {
        type:String,
        required: true
    },
    House_number_and_residency_name:{
        type:String,
        unique:true,
        required: true
    },
    Full_address:{
        type:String,
        unique:true,
        required: true
    },
    Img_url:
    {
        type: String
    },
    Total_size:{
        type:Number,
        required: true
    },
    Additional_info:{
        type:String,
        required: true
    },
    Price:{
        type:String,
        required: true
    },
    ZIP_code:{
        type:String,
        required: true
    },
    BHK:{
        type:String,
        required: true
    },
    phone_number_for_contact:{
        type:String,
        min:10,
        max:13,
        required: true
    }
});
// defning an schema
const user_schema_def = new mongoose.Schema({
    first_name_user:{
        type:String,
        required:true,
    },
    last_name_user:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:3
    }
},{ timestamps : true });

// modal creation for CRUD operation on DB
const user_modal=mongoose.model('user_collection',user_schema_def);
const property_modal=mongoose.model('propertie',property_schema);

module.exports={user_modal,property_modal};