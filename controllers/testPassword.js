const bcrypt = require('bcrypt');

async function testPassword() {
  const password = 'Admin2024!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('Password:', password);
  console.log('Hashed Password:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch);
}
testPassword();
