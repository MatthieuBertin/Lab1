#!/bin/bash
#Sign up
curl -d 'email=A@liu.se&password=123&firstname=A&familyname=AFamily&gender=male&city=Linkoping&country=Sweden' http://127.0.0.1:5000/sign_up/
sleep 1

#Sign in
curl -d 'email=A@liu.se&password=123' http://127.0.0.1:5000/sign_in/ > /tmp/test-server
TOKEN=`cat  /tmp/test-server | cut -c 49-88`
echo $TOKEN
rm -f /tmp/test-server
sleep 1

#Sign out
curl http://127.0.0.1:5000/sign_out/$TOKEN