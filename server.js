const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 8888;

const clientId = 'b18acce7865b488782b0a404a6848e98';
const clientSecret = '9fd1bccc55fc402986159b6fb3dd0560';
const redirectUri = 'https://mateenpixel.github.io/mateenmusic/callback';

app.use(cors());

app.get('/login', (req, res) => {
    const scopes = 'user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes,
            redirect_uri: redirectUri
        }));
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
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;

            res.redirect(`https://mateenpixel.github.io/mateenmusic/#${querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
            })}`);
        } else {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
