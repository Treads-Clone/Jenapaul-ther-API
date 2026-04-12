
# API ENDPOINTS OVERVIEW

## GET /v1
  Verify if the application is running.
 
### Example Response
```sh
{
'message': 'V1 API App is Running',
'controller': this.__controllerName,
        }
```
-------------------------------------------------------------------
## GET /v1/
Retrieve the list of threads for the home feed.

### Query Parameters
- /v1/
### Request Header
 - apikey={API_KEY}
 - token={jwt_token}
 - content-type: application/json

### Example Response
```sh
{
  "success": true,
  "data": {
    "threads": [
      {
        "post_id": 1,
        "user_id": ,
        "username": "user1",
        "content": "Threads post user1"
        "profile_image": "user1 image",
        "likes": 150,
        "Replies": 20,
        "Repost_id": 1,
        "created_at": "2024-10-11T12:00:00Z"
      },
    {
        "post_id": 2,
        "user_id": ,
        "username": "user2",
        "content": "Threads post user2"
        "profile_image": "user2 image",
        "likes": 150,
        "Replies": 20,
        "Repost_id": 2,
        "created_at": "2024-10-11T12:00:00Z"
      }
    ]
  }
}
```
-----------------------------------------------------------------------
## POST v1/account
Register a new user.

### URL Path
- /v1/account

### Request Header
- apikey={API_KEY}
- content-type: application/json

### Request Body
```sh
{
  "username": "johndude",
  "email": "example@email.com", //ensure that you have valid email or else it will invalid
  "password": "johndudy",
  "fullname":"johnny duddy",
  "bio": "papasa ako",
  "profile_img": "image.jpg"
}
```

### Example Response
```sh
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "record_index": 1
  }
}
```
------------------------------------------------------------------------
## GET v1/account
Verify JWT token and fetch user information
  
### URL Path
- /v1/account/

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "johnd",
    "email": "johnd@example.com",
    "created_at": "2024-10-11T12:00:00Z"
  }
}
```
-----------------------------------------------------------------------------------------------------

## DELETE v1/account
delete a user  account

### Query Parameters
- /v1/account

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{"password": "pass_123}
```

### Example Response
```sh
{
  "success": true,
  "message": "Account deleted successfully."
}
```

-----------------------------------------------------------------------------------------------------

## PATCH v1/account
update user account

### Query Parameters
- /v1/account?

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{"password": "pass_123"}
```
OR
```sh
{"username": "diether"}
```
OR
```sh
{"bio": "i'm strong"}
```
OR
```sh
{"password": "pass_123}
```
### Example Response
IF USERNAME
```sh
{
  "success": true,
  "data": {
      "user_id": 1,
      "token": "{new jwt_token}"
}
```
IF not
```sh
{
    "success": true,
    "message": "Profile Updated!",
    "data": {
        "user_id": 1,
        "data": {
            "token": null
        }
    }
}
```
------------------------------------------------------------------------------------------------
## POST v1/account/login
Authenticate and sign a JWT for the user's session.

### Path URL
- v1/account/login
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "user_name": "paup",
  "password": "password123"
}
```

### Example Response
```sh
{
  "success": true,
   "data": {
        "token": ""
    }
}
```
-------------------------------------------------------------------------------------------
## POST v1/account/logout
Log out the user.

### Path URL
- /v1/account/logout
  
### Request Header
- token={jwt_token}
- content-type: application/json
 
### Request Body
- it can be pass through the header
  
### Example Response
```sh
{
  "success": true,
  "message": "User logged out successfully."
}
```
--------------------------------------------------------------------------------------
## POST v1/threads/
Add a post.

### Path URL
- /v1/threads/

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "content": "papasa ba ako sir?, - gen"
}
```
### Example Response
```sh
{
  "success": true,
  "message": "threadpost added successfully.",
  "data": {
    "user_id": 1,
    "content": "papasa ba ako sir?, - gen"
    "created_at": "2024-10-24T11:37:48.072Z",
        "hashtags": []
  }
```
--------------------------------------------------------------------------------------
## GET v1/threads
retrieves threads post

### Path Parameters
- /v1/threads
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
    "success": true,
    "data": {
        "result": [
            {
                "user_id": 1,
                "post_id": 5,
                "username": "nath",
                "content": "hi",
                "like_count": 0,
                "comment_count": 0,
                "repost_count": 0
            },
            {
                "user_id": 1,
                "post_id": 6,
                "username": "nath",
                "content": "hello",
                "like_count": 0,
                "comment_count": 0,
                "repost_count": 0
             }
        ]
    }    
}  
```
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------
## PATCH v1/threads/:post_id
edit or update the user thread post

### Path Parameters
- /v1/threads/:post_id
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "content": "i edit my content"
}
```
### Example Response
```sh
{
  "success": true,
  "message": "threadpost edited successfully.",
  "data": {
    "post_id": 1,
    "content": "ipapasa ni sir - gen"
  }
```
------------------------------------------------------------------------------------------------------------

## DELETE  v1/threads/{post_id}
deleting a post thread.

### Query Parameters
- /v1/threads/{post_id}

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "threadpost deleted successfully.",
  "data": {
    "post_id": 1,
    "content": ""
  }
```
--------------------------------------------------------------------------------------------------------------

## POST v1/threads/:post_id/reply
Add a replies to the thread.

### Path URL
- v1/threads/:post_id/reply
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "comment_text": that's good."
}
```

### Example Response
```sh
{
    "success": true,
    "data": {
        "user_id": 1,
        "post_id": 1,
        "replies": 1,
        "comment_text": "pauull",
        "created_at": "2024-10-24T12:33:31.792Z"
    }
}
```
----------------------------------------------------------------------------------------------
## GET v1/threads/:post_id/reply
fetch the comment to the thread.

### Path URL
- v1/thread/:post_id/reply

### Request Header- 
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json


### Example Response
```sh
{
    "success": true,
    "data": {
        "result": [
            {
                "user_id": 1,
                "username": "diether",
                "replies_id": 1,
                "post_id": 1,
                "comment_text": "paull",
                "like_count": 0
             },
         ]
     }
 }
```
------------------------------------------------------------------------------------------
## PATCH v1/threads/:post_id/reply/:replies_id
edit specific comment by `replies_id`.

### Path URL
- /v1/threads/reply/:replies_id

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json
  
### Example Response
```sh
{
  "success": true,
  "message": "reply edit successfully.",
  "data": {
    "post_id": 1,
    "replies_id": 1,
    "replies": "paul"
  }
```
------------------------------------------------------------------------------------------
## DELETE v1/threads/:post_id/reply/:replies_id
delete specific comment by `replies_id`.

### Path URL
- /v1/threads/reply/:replies_id

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json
  
### Example Response
```sh
{
  "success": true,
  "message": "replies deleted successfully.",
  "data": {
    "post_id": 1,
    "replies_id": 1,
    "replies": ""
  }
```
-------------------------------------------------------------------------------------------------------------------
## POST /v1/threads/:post_id/reply/:replies_id/like
Allows a user to like a specific comment based on its `replies_id`.

### Path URL
- /v1/threads/:post_id/reply/:replies_id/like
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json


### Example Response
```sh
{
  "success": true,
  "message": "Comment liked successfully.",
  "data": {
    "user_id": 123,
    "replies_id": 789,
    "liked_at": "2024-10-11T12:00:00Z"
  }
}
```
-----------------------------------------------------------------------------------------------------------------
## GET  /v1/threads/:post_id/reply/:replies_id/like
fetch the like for a specific comment based on its `replies_id`.

### Path URL
- - /v1/threads/:post_id/reply/:replies_id/like
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "Comment like count fetched successfully.",
  "data": {
    "user_id": 123,
    "content": "yey",
    "comment_id": 789,
    "like_count": 119
     
  }
}
```
-----------------------------------------------------------------------------------------------------------------------------
## DELETE /v1/thread/:post_id/reply/:replies_id/unlike
delete the user like for a specific comment based on its `replies_id`.

### Path URL
- /v1/reply/:replies_id/like
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "comment unlike successfully.",
  "data": {
    "user_id": 123,
    "content": "yey",
    "comment_id": 789,
    "like_count": 118
     
  }
}
```
---------------------------------------------------------------------------------------------------------------------
## DELETE /v1/threads/:post_id/unlike
Allows a user to "unlike" a specific thread or post based on its `post_id`. The like count for the thread is updated and returned.

### Path URL
- /v1/threads/:post_id/unlike
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "Thread unliked successfully.",
  "data": {
    "user_id": 123,
    "post_id": 123,
    "content": "yey",
    "like_count": 119
  }
}
```
---------------------------------------------------------------------------------------------------------------------
## POST /v1/threads/:post_id/like
Allows a user to "like" a specific thread or post based on its `post_id`. The like count for the thread is updated and returned.

### Path URL
- /v1/threads/:post_id/like
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "Thread liked successfully.",
  "data": {
    "user_id": 123,
    "post_id": 123,
    "content": "yey",
    "like_count": 120
  }
}
```
---------------------------------------------------------------------------------------------------------------------
## GET /v1/threads/:post_id/like
Allows a user to retrieve the current like count for a specific thread or post based on its `post_id`.

### Path URL
- /v1/threads/:post_id/like
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "Like fetched successfully.",
  "data": {
    "post_id": 123,
    "content": "yey",
    "like_count": 120
  }
}
```
---------------------------------------------------------------------------------------------------------------------
## POST v1/threads/{post_id}/repost
Repost a thread.

### Path URL
- /v1/threads/{post_id}/repost
- 
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json
- 
### Example Response
```sh
"data": {
    "post_id": 12345,
    "parent_repost_id": 12344,
    "user_id": 67,
    "content": "reposted in thread",
    "created_at": "2024-10-18T14:35:22Z"
  }
```
- if user already reposted specific threadpost
 ```sh
{
  success: false,
  message: "already reposted"
}

```
---------------------------------------------------------------------------------------------------------------------
## DELETE v1/threads/{post_id}/unrepost
unrepost a thread.

### Path URL
- /v1/threads/{post_id}/unrepost
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json
- 
### Example Response
```sh
{
  success: true,
  message: "repost deleted successfully"
}

```
---------------------------------------------------------------------------------------------------------------------
## GET v1/threads/repost/userID
Get a Repost.

### Path URL
- /v1/threads/repost/:userID
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  success: true,
    data: {
        "user_id": 1,
        "username":"asa",
        "post_id": 60,
        "created_at": 2024-10-11T12:00:00Z,
    }
}
```
---------------------------------------------------------------------------------------------------------------------------
## POST /v1/follow/
Follow a specific user by their user ID.

### Path URL
- /v1/follow/
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "content": "follow the user"
}
```

### Example Response
```sh
{
  "success": true,
  "message": "User followed successfully.",
  "data": {
    "user_id": 123,
    "followed_user_id": 456,
    "followed_at": "2024-10-11T12:00:00Z"
  }
}
```
----------------------------------------------------------------------------------------------------------------------------------------
## DELETE v1/follow/unfollow
Unfollow the user
  
### Query Parameters
- v1/unfollow/unfollow

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "User unfollowed successfully.",
  "data": {
    "user_id": 123,
    "unfollowed_user_id": 456,
    "unfollowed_at": "2024-10-11T12:30:00Z"
  }
}
```
----------------------------------------------------------------------------------------------------------------------------------------------
## GET v1/follow/followers
retrieve the followers of the user

### Request Parameters
- v1/follow/followers/:userID

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "message": "follows you successfully.",
  "data": {
    "user_id": 123,
    "follower_user_id": 456,
   }
}
```
----------------------------------------------------------------------------------
## GET v1/follow/following
Get the list of users who are following the logged-in user.

### Request Parameters
- /v1/follow/following/:userID

### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "data": {
    "following": [
      {
    	"user_id": 3,
        "username": "following1"
      }
    ]
  }
}
```
-----------------------------------------------------------------------------------------
## GET v1/search
search other user or profile and other content.

### Query Parameters
-  v1/search?q=keyword&limit=10
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Example Response
```sh
{
  "success": true,
  "data": {
    "users": [
      {
        "user_id": 123,
        "username": "",
        "full_name": "",
        "profile_image": "https://example.com/images/user2.jpg",
        "is_following": true
      }
    ],
    "threads": [
      {
        "thread_id": 123,
        "user_id": 123,
        "username": "",
        "content": "This is a thread example with #shoes",
        "image": "https://example.com/images/thread1.jpg",
        "likes": 250,
        "comments": 40,
        "created_at": "2024-10-14T10:00:00Z"
      }
    ],
    "hashtags": [
      {
        "hashtag": "#shoes",
        "post_count": 14
      }
    ]
  }
}

```
---------------------------------------------------------------------------------------------------------------------
## POST v1/account/forgot
make a request to change password, send otp tru email.

### Path URL
- /v1/account/forgot
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "email": "johnpaulbodino49@gmail.com"
}
```
### Example Response
```sh
{
 "message": "otp has sent to your email."
  }
```
---------------------------------------------------------------------------------------------------------------------
## POST v1/account/reset
reset or change password of the user.

### Path URL
- /v1/account/reset
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

### Request Body
```sh
{
  "otp": "1233",
  "newPasword": "mynewlife"
}
```
### Example Response
```sh
{
 "message": "password successfully reset."
  }
```
---------------------------------------------------------------------------------------------------------------------
## GET v1/account/replies
Fetch all user's replies in it's account.

### Path URL
- /v1/account/replies
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

```
### Example Response
```sh
{
  "success": true,
  "data": [
    {
      "replies_id": 220,
      "comment_text": "waley",
      "post_id": 193,
      "content": "niigga",
      "reply_username": "niga",
      "reply_profile_image": "https://res.cloudinary.com/dda8q97x2/image/upload/v1731561311/profiles/il1zuv6tguem4ostavie.jpg",
      "post_username": "niga",
      "post_profile_image": "https://res.cloudinary.com/dda8q97x2/image/upload/v1731561311/profiles/il1zuv6tguem4ostavie.jpg",
      "like_count": 0,
      "replies_count": 1,
      "repost_count": 0
    }
]
```
---------------------------------------------------------------------------------------------------------------------
## GET v1/account/post
Fetch all user's threadpost in it's account.

### Path URL
- /v1/account/post
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

```
### Example Response
```sh
{
  "success": true,
  "data": {
    "result": [
      {
        "user_id": 48,
        "username": "niga",
        "content": "taena",
        "post_id": 196,
        "parent_repost_id": 34,
        "profile_image": "https://res.cloudinary.com/dda8q97x2/image/upload/v1731561311/profiles/il1zuv6tguem4ostavie.jpg",
        "like_count": 0,
        "replies_count": 0,
        "repost_count": "0z"
]
}
```
---------------------------------------------------------------------------------------------------------------------
## GET v1/account/repost
Fetch all user's repost in it's account.

### Path URL
- /v1/account/repost
  
### Request Header
- apikey={API_KEY}
- token={jwt_token}
- content-type: application/json

```
### Example Response
```sh
{
  "success": true,
  "data": {
    "result": [
      {
        "user_id": 48,
        "username": "niga",
        "content": "taena",
        "post_id": 196,
        "parent_repost_id": 34,
        "profile_image": "https://res.cloudinary.com/dda8q97x2/image/upload/v1731561311/profiles/il1zuv6tguem4ostavie.jpg",
        "like_count": 0,
        "replies_count": 0,
        "repost_count": "0"
]
}
```


