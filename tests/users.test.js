const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

let email = 'tests@example.com';
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_PASSWORD);
});

afterAll(async () => {
    await User.deleteOne({email: email});
    await mongoose.connection.close();
});

test('should register a new user and redirect', async () => {
    
    const response = await request(app)
        .post('/register')
        .send({ email: email, username: 'testsuser', password: 'securepass' });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);
    console.log("Response Body:", response.body);  // 🔥 Log full response for debugging

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/campgrounds');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
});

