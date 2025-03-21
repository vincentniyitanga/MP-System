const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI - replace with your actual connection string
const uri = 'mongodb+srv://vincentniyitanga:Cenzo%403854958245@clustermp.zzac2.mongodb.net/warehouseDB';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'clerk', 'accountant', 'admin'], required: true }
}));

async function updatePasswords() {
  const users = [
    { username: 'manager_user', password: 'Cenzo@385' },
    { username: 'clerk_user', password: 'Cenzo@495' },
    { username: 'accountant_user', password: 'Cenzo@8245' },
    { username: 'admin_user', password: 'Cenzo@3854958245' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.findOneAndUpdate(
      { username: user.username },
      { password: hashedPassword },
      { new: true }
    );
    console.log(`Updated password for ${user.username}`);
  }
}

updatePasswords().then(() => {
  console.log('All passwords updated');
  mongoose.disconnect();
});