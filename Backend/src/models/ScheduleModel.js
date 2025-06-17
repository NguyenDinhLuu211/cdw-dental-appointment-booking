const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  dayOfWeek: Number,
  workingHours: [
    new mongoose.Schema(
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        startTime: String,
        endTime: String,
        isAvailable: Boolean
      },
      { _id: true } // ✅ Tự động thêm _id vào từng workingHour
    )
  ]
});


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
