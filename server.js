require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 8888;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'https://mateenpixel.github.io/mateenmusic/';

console.log('Server started');
console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret ? 'Set' : 'Not Set');
console.log('Redirect URI:', redirectUri);

app.use(cors());

// Define root route
app.get('/', (req, res) => {
    res.send('Welcome to the Spotify Authentication Server');
});

app.get('/login', (req, res) => {
    console.log('Login route accessed');
    const scopes = 'user-read-recently-played';
    const url = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        redirect_uri: `https://mateenmusic.vercel.app/callback`
    });
    console.log('Redirecting to Spotify:', url);
    res.redirect(url);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    console.log('Callback route accessed, code:', code);
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: `https://mateenmusic.vercel.app/callback`,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (error) {
            console.error('Error in request:', error);
            return res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
        }

        if (response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            console.log('Tokens received, access:', access_token, 'refresh:', refresh_token);
            res.redirect(`${redirectUri}/#${querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
            })}`);
        } else {
            console.error('Unexpected response:', response.statusCode, body);
            res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app; // Ensure the app is exported for Vercel to use
