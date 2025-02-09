const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

let email = 'test1@example.com';
let username = 'testsuser';
let password = 'securepass';

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_PASSWORD);
});

afterAll(async () => {
    await User.deleteOne({email: email});
    await mongoose.connection.close();
});

test('POST /register: should register a new user and redirect to /campgrounds', async () => {
    
    const response = await request(app)
        .post('/register')
        .send({ email: email, username: 'testsuser', password: 'securepass' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/campgrounds');

    const user = await User.findOne({ email: email });
    expect(user).not.toBeNull();
});

test('GET /register: should render the register view for user', async () => {
    const response = await request(app)
        .get('/register')
    console.log(response.headers.location);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Register');   
});

test('GET /login: should render the login view for user', async () => {
    const response = await request(app)
        .get('/login')
    console.log(response.headers.location);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Login');   
});

test('POST /login: should login an existing user and redirect to /campgrounds', async () => {
    
    const response = await request(app)
        .post('/login')
        .send({ username: username, password: password });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/campgrounds');

});