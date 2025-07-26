require('dotenv').config();

const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const { ManagementClient } = require('auth0');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// The /profile route will require authentication
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// A simple API endpoint to check if the server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Endpoint to handle KYC form submissions
app.post('/api/kyc', requiresAuth(), (req, res) => {
  const kycData = req.body;
  // For now, we'll just log the data to the console.
  // In a real application, this is where you would
  // process and store the KYC information securely.
  console.log('Received KYC data:', kycData);
  res.status(200).json({ message: 'KYC data received successfully.' });
});

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
});

app.patch('/api/user/update', requiresAuth(), async (req, res) => {
    const { sub } = req.oidc.user;
    const { nickname, picture } = req.body;

    try {
        await managementClient.users.update({ id: sub }, {
            nickname: nickname,
            picture: picture,
        });
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});