const express= require("express");
let app=express();
const dotenv=require("dotenv");
const connectionDB=require("./config/db")
let route= require("./routes/auth")
let cors=require("cors");
dotenv.config();
connectionDB()
app.use(cors());
app.use(express.json());
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

app.use('/auth', route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
