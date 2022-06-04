#!/bin/bash

#########################################################
#                                                       #
# author: Tim Wende                                     #
#                                                       #
# dependencies:                                         #
#   DELETE: /todos muss den id_counter auf 0 setzen     #
#   Die Todo muss wie folgt aussehen: {id, title, done} #
#                                                       #
#########################################################

# rooturl je nach System anpassen
# rooturl="https://weit.tmwnd.de/h08/todos/" # keep alive etc...
rooturl="localhost:3002/h08/todos/"

# global vars
todo_0="Geschenk fuer Jupp kaufen"
todo_1="FitX mit den Bres"
todo_2="WEIT ueben... lol"
todo_3="Blumen für Paddel kaufen"

i=0
n=0

# setup system
echo
echo "SETUP:"
echo "- ROOT = $rooturl"
echo -n "- CONNECT"
status_code=$(curl --write-out %{http_code} --silent --output /dev/null $rooturl)
if [[ "$status_code" -eq 200 ]] ; then
    echo " OK"
else
    echo
    echo "STATUS CODE $status_code; CANT START TESTING";
    exit
fi
echo "- DELETE ALL TODOS"
delete=$(curl --request DELETE --url $rooturl -s)
if [ "$delete" != '[]' ]; then
    echo "DELETE ERROR; CANT START TESTING"
    exit
fi

echo "- ADD TEST TODOS (1/3)"
post_0=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_0"'"}' -s)
echo "- ADD TEST TODOS (2/3)"
post_1=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_1"'"}' -s)
echo "- ADD TEST TODOS (3/3)"
post_2=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_2"'"}' -s)

echo "- VERIFY STATUS"
get=$(curl --request GET --url $rooturl -s)
if [ "$get" == '[{"id":0,"title":"'"$todo_0"'","done":false},{"id":1,"title":"'"$todo_1"'","done":false},{"id":2,"title":"'"$todo_2"'","done":false}]' ]; then
    echo "SETUP DONE SUCCESSFULLY"
else
    echo "ERROR; CANT START TESTING"
    exit
fi

echo
echo "START TESTS:"

((++n))
echo -n "GET:    /todos           | gibt alle Todos zurück                               -> "
get=$(curl --request GET --url $rooturl -s)
if [ "$get" == '[{"id":0,"title":"'"$todo_0"'","done":false},{"id":1,"title":"'"$todo_1"'","done":false},{"id":2,"title":"'"$todo_2"'","done":false}]' ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $get
fi

((++n))
echo -n "GET:    /todos/{id}      | gibt Todo mit der id {id} zurück                     -> "
get_0=$(curl --request GET --url $rooturl"0/" -s)
get_1=$(curl --request GET --url $rooturl"1/" -s)
get_2=$(curl --request GET --url $rooturl"2/" -s)
if [ \
        "$get_0" == '{"id":0,"title":"'"$todo_0"'","done":false}' \
    ] && [ \
        "$get_1" == '{"id":1,"title":"'"$todo_1"'","done":false}' \
    ] && [ \
        "$get_2" == '{"id":2,"title":"'"$todo_2"'","done":false}' \
    ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $get_0
    echo $get_2
    echo $get_3
fi

((++n))
echo -n "PATCH:  /todos/{id}      | markiert das Todo mit der id {id} als erledigt       -> "
patch_0=$(curl --request PATCH --url $rooturl"0/" -s)
if [ "$patch_0" == '{"id":0,"title":"'"$todo_0"'","done":true}' ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $patch_0
fi

((++n))
echo -n "PATCH:  /todos/{id}      | markiert das Todo mit der id {id} als nicht erledigt -> "
patch_0=$(curl --request PATCH --url $rooturl"0/" -s)
if [ "$patch_0" == '{"id":0,"title":"'"$todo_0"'","done":false}' ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $patch_0
fi

((++n))
echo -n "POST:   /todos           | fügt neues Todo hinzu                                -> "
post=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_3"'"}' -s)
get_3=$(curl --request GET --url $rooturl"3/" -s)
if [ \
        "$post" == '{"id":3,"title":"'"$todo_3"'","done":false}' \
    ] && [ \
        "$get_3" == '{"id":3,"title":"'"$todo_3"'","done":false}' \
    ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $post
    echo $get_3
fi

((++n))
echo -n "DELETE: /todos?done=true | löscht alle erledigten Todos                         -> "
patch_2=$(curl --request PATCH --url $rooturl"2/" -s)
delete=$(curl --request DELETE --url $rooturl"?done=true" -s)
get_2=$(curl --request GET --url $rooturl"2/" -s)
if [ \
        "$delete" == '[{"id":0,"title":"'"$todo_0"'","done":false},{"id":1,"title":"'"$todo_1"'","done":false},{"id":3,"title":"'"$todo_3"'","done":false}]' \
    ] && [ \
        "$get_2" == "Kein Todo mit der id 2 gefunden" \
    ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $delete
    echo $get_2
fi

((++n))
echo -n "DELETE: /todos/{id}      | löscht Todo mit der id {id}                          -> "
delete=$(curl --request DELETE --url $rooturl"/1" -s)
get=$(curl --request GET --url $rooturl -s)
get_1=$(curl --request GET --url $rooturl"1/" -s)
if [ \
        "$delete" == '{"id":1,"title":"'"$todo_1"'","done":false}' \
    ] && [ \
        "$get" == '[{"id":0,"title":"'"$todo_0"'","done":false},{"id":3,"title":"'"$todo_3"'","done":false}]' \
    ] && [ \
        "$get_1" == "Kein Todo mit der id 1 gefunden" \
    ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $delete
    echo $get
    echo $get_1
fi

((++n))
echo -n "DELETE: /todos           | löscht alle Todos                                    -> "
delete=$(curl --request DELETE --url $rooturl -s)
if [ "$delete" == '[]' ]; then
    ((++i))
    echo "OK"
else
    echo "ERROR"
    echo $delete
fi

echo -n "ALL TEST DONE ($i/$n) "
if [ "$i" == "$n" ]; then
    echo "SUCCESS"
else
    echo "FAILURE"
fi

# readd the todos
post_0=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_0"'"}' -s)
post_1=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_1"'"}' -s)
post_2=$(curl --request POST --url $rooturl --header 'Content-Type: application/json' --data '{"title": "'"$todo_2"'"}' -s)