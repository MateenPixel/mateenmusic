require('dotenv').config();
const path = require('path');
const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3001;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'https://mateenpixel.github.io/mateenmusic/callback';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    const scopes = 'user-read-recently-played';
    const url = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri
    });
    console.log('Redirecting to:', url); // Log the redirect URL
    res.redirect(url);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    console.log('Authorization code received:', code);
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.error('Error getting tokens:', error || body);
            return res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
        }

        const access_token = body.access_token;
        const refresh_token = body.refresh_token;
        console.log('Access token received:', access_token);
        console.log('Refresh token received:', refresh_token);
        res.redirect(`https://mateenpixel.github.io/mateenmusic/#${querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        })}`);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
