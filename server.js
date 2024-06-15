require('dotenv').config(); // Load environment variables from .env file

const path = require('path');
const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 8888;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'https://mateenmusic.vercel.app/callback';

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
    res.redirect(url);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (error) {
            return res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
        }

        if (response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            res.redirect(`/#${querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
            })}`);
        } else {
            res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
        }
    });
});

// Serve static files and handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
