require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileUpload');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const upload = require('./routes/upload');
const productRouter = require('./routes/productRouter');
const paymentRouter = require('./routes/paymentRouter');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get('/', (req, res) => {
  res.json({ msg: 'Hello' });
});

// Routes
app.use('/user', userRouter);
app.use('/api', categoryRouter);
app.use('/api', upload);
app.use('/api', productRouter);
app.use('/api', paymentRouter);

// Connect DB
// nhớ loại bỏ dấu "<" ">" ở chỗ password trong cái url kết nối MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
  }
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at ${PORT}`));