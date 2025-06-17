const express = require("express");
const dotenv = require("dotenv");
const mongoose  = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ Kích hoạt CORS nếu frontend gọi từ domain khác
const allowedOrigins = [
  'http://localhost:3000',
  'https://cdw-frontend.vercel.app' // cập nhật domain frontend thực tế của bạn
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép gọi từ Postman hoặc không có origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// ✅ Middleware xử lý JSON và form
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Khai báo các routes
routes(app);

// ✅ Kết nối MongoDB
mongoose.connect(process.env.MONGO_DB)
.then(() => {
    console.log('✅ Connect db success');
})
.catch((err)=> {
    console.error('❌ Connect db failed:', err);
});

// ✅ Khởi động server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
