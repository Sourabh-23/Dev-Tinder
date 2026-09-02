# DevTinder APIs

## Auth Router
POST /signup
POST /login
POST /logout

## Profile Router
GET /profile/view
PATCH /profile/edit
PATCH /profile/password = forgot passord api


## Connection Req Router
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId


## user Router
GET /user/connections
GET /user/requests
GET /user/feed — Gets you the profiles of other users on platform

Status: ignore, interested, accepted, rejected