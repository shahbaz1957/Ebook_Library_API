import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res,next) => {
  res.json({message: 'Ebook Library API is running!'});
});
app.post('/',(req,res,next)=>{
  res.send('Data Save Successfully !!!!!')
})

export default app;
