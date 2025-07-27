require('dotenv').config();

const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
const { ManagementClient } = require('auth0');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, 'public')));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

app.use(auth(config));

// Auth0 Management Client
const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
});

// Routes
// Simple admin route to approve KYC for demo
app.get('/admin/approve/:userId', async (req, res) => {
    try {
        const db = app.locals.db;
        const result = await db.collection('kyc_submissions').updateOne(
            { userId: req.params.userId, status: 'pending' },
            { $set: { status: 'approved' } }
        );
        if (result.matchedCount === 0) {
            res.send('No pending KYC found for user: ' + req.params.userId + '<br><a href="/dashboard">Back to Dashboard</a>');
        } else {
            res.send('KYC approved for user: ' + req.params.userId + '<br><a href="/dashboard">Back to Dashboard</a>');
        }
    } catch (err) {
        res.status(500).send('Error approving KYC');
    }
});
app.get('/zkp-explained', (req, res) => {
    res.render('zkp-explained');
});
app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('index', { isAuthenticated: false });
    }
});

app.get('/dashboard', requiresAuth(), async (req, res) => {
    try {
        const db = app.locals.db;
        const kyc = await db.collection('kyc_submissions').findOne({ userId: req.oidc.user.sub }, { sort: { submittedAt: -1 } });
        let kycStatus = 'Not Verified';
        if (kyc) {
            if (kyc.status === 'approved') kycStatus = 'Verified';
            else if (kyc.status === 'pending') kycStatus = 'Pending';
            else if (kyc.status === 'rejected') kycStatus = 'Rejected';
        }
        res.render('dashboard', { user: req.oidc.user, kycStatus });
    } catch (err) {
        console.error('Error fetching KYC status:', err);
        res.render('dashboard', { user: req.oidc.user, kycStatus: 'Unknown (Error)' });
    }
});

app.get('/settings', requiresAuth(), (req, res) => {
    res.render('settings', { user: req.oidc.user });
});

app.get('/kyc', requiresAuth(), (req, res) => {
    res.render('kyc', { user: req.oidc.user });
});

app.get('/profile', requiresAuth(), (req, res) => {
    (async () => {
        let picture = req.oidc.user.picture;
        let nickname = req.oidc.user.nickname;
        if (!picture) {
            if (req.oidc.user.email) {
                picture = `https://s.gravatar.com/avatar/${req.oidc.user.email}?s=480&r=pg&d=retro`;
            } else {
                picture = '/default-avatar.png';
            }
        }
        try {
            const db = app.locals.db;
            const edit = await db.collection('profile_edits').findOne({ userId: req.oidc.user.sub });
            if (edit) {
                if (edit.picture) picture = edit.picture;
                if (edit.nickname) nickname = edit.nickname;
            }
        } catch (e) { /* ignore for demo */ }
        const updated = req.query.updated === '1';
        res.render('profile', { user: { ...req.oidc.user, picture, nickname }, updated });
    })();
});

app.get('/profile/edit', requiresAuth(), (req, res) => {
    const picture = req.oidc.user.picture || `https://s.gravatar.com/avatar/${req.oidc.user.email}?s=480&r=pg&d=retro`;
    res.render('edit-profile', { user: { ...req.oidc.user, picture } });
});

app.post('/profile/edit', requiresAuth(), async (req, res) => {
    // DEMO PATCH: Update both the local session and persist to MongoDB for demo
    const { nickname, picture } = req.body;
    req.oidc.user.nickname = nickname;
    req.oidc.user.picture = picture;
    try {
        const db = app.locals.db;
        await db.collection('profile_edits').updateOne(
            { userId: req.oidc.user.sub },
            { $set: { nickname, picture } },
            { upsert: true }
        );
        res.redirect('/profile?updated=1');
    } catch (error) {
        console.error('Error saving profile edit:', error);
        res.status(500).render('error', { message: 'Failed to save profile changes.' });
    }
});

// Simulated ZKP proof generator (for demo)
function generateFakeZKP(kycData) {
    // In a real app, use cryptography! Here, just base64 encode the data
    const str = `${kycData.fullName}:${kycData.dob}:${kycData.country}:${kycData.govId}`;
    return Buffer.from(str).toString('base64');
}

app.post('/api/kyc', requiresAuth(), async (req, res) => {
    // Only store over18 and zkpProof, not dob or other sensitive fields
    const { over18, zkpProof } = req.body;
    const submission = {
        over18: over18 === 'true',
        zkpProof,
        userId: req.oidc.user.sub,
        submittedAt: new Date(),
        status: 'pending',
    };
    try {
        const db = app.locals.db;
        await db.collection('kyc_submissions').insertOne(submission);
        res.render('kyc-success', { over18: submission.over18 });
    } catch (error) {
        console.error('Error saving KYC data:', error);
        res.status(500).render('error', { message: 'Failed to save KYC data.' });
    }
});

app.get('/password/change', requiresAuth(), (req, res) => {
    // This route will initiate the password change flow
    // Note: You need to configure the "Password Change" settings in your Auth0 dashboard
    // and set the redirect URL to your dashboard or settings page.
    const options = {
        returnTo: 'http://localhost:3000/settings',
        user_id: req.oidc.user.sub
    };
    managementClient.tickets.createPasswordChangeTicket(options, (err, ticket) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to create password change ticket.');
        }
        res.redirect(ticket.ticket);
    });
});


// Database and Server Initialization
const mongoClient = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
  try {
    await mongoClient.connect();
    app.locals.db = mongoClient.db();
    console.log('Connected to MongoDB Atlas');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
    process.exit(1);
  }
}

startServer();