const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
require('dotenv').config();

const app =express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDb Connected'))
.catch(err=>console.log(err));

const reviewSchema = new mongoose.Schema({
  name: String,
  comment: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Review =mongoose.model('Review',reviewSchema);

app.post('/api/reviews',async(req,res)=>{
    try{
        const {name , comment}=req.body;
        const review =new Review({name,comment});
        await review.save();
        res.json({message:'Review submitted! Pending approval.'});
    } catch(err){
        res.status(500).json({error:'Something went wrong'});
    }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));