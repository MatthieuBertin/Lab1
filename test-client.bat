telnet localhost 5000

1. Sign up user A.
GET /sign_up/A@liu.se/123/A/Afamily/male/Linkoping/Sweden HTTP/1.1

2. Sign up user B.
GET /sign_up/B@liu.se/123/B/Bfamily/male/Linkoping/Sweden HTTP/1.1

3. Sign in as user A.
GET /sign_in/A@liu.se/123 HTTP/1.1

4. Post a message on user B’s wall.
GET /post_message/<token>/BonjourB/B@liu.se HTTP/1.1

5. Check all messages posted to user B’s wall.
GET /get_user_messages_by_email/<token>/B@liu.se HTTP/1.1

6. Sign out user A.
GET /sign_out/<token> HTTP/1.1

7. Sign in as user B.
GET /sign_in/B@liu.se/123 HTTP/1.1

8. Post a message on the signed​in user’s wall.
GET /post_message/<token>/BonjourB/B@liu.se HTTP/1.1

9. Check the messages belonging to the signed​ in user’s wall.
GET /get_user_messages_by_token/<token> HTTP/1.1

10. Sign out user B.
GET /sign_out/<token> HTTP/1.1

11. In the terminal running the server, terminate it and restart it.

12. Sign in as user A again.
GET /sign_in/A@liu.se/123 HTTP/1.1
