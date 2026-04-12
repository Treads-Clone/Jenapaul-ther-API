
Creating Acoount
POST v1/account/

Profile
GET v1/account/

LogIn 
POST v1/account/login

Get your own post
GET v1/account/post

Update Profile
PATCH v1/account/

Delete Account
DELETE v1/account/

Follow User
POST v1/follow/

Unfollow
DELETE v1/follow/unfollow

Get Followers
GET v1/follow/followers/:userID

Get Following
GET v1/follow/following/:userID

Reaction

Like a threadpost
POST v1/threads/:post_id/like

UnLike a threadpost
DELETE v1/threads/:post_id/unlike

Get all Like a threadpost
GET v1/threads/:post_id/likes

Repost

Get repost
GET v1/threads/repost/userID

Repost a post
POST v1/threads/repost

Delete a repost
DELETE v1/threads/reposts/:repost_id

Search 

Get a search item
GET v1/search/

ThreadPost

Get AllThreads
GET v1/threads/

Post a post
POST v1/threads/

Delete a post
DELETE v1/threads/:post_id

Update a post
PATCH v1/threads/:post_id

Replies

Create a reply
POST v1/threads/:post_id/reply

Update a reply
PATCH v1/threads/:post_id/reply/:replies_id

Delete a reply
DELETE v1/threads/:post_id/reply/"replies_id

Get all Replies 
GET v1/threads.:post_id/reply




































