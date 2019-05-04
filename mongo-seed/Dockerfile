FROM mongo

COPY books_init.json authors_init.json users_init.json comments_init.json ./
#  mongoimport --host <host_name> --username <user_name> --password <password> --db <database_name> --collection <collection_name> --file <input_file>
CMD mongoimport --host db --db nodeAntiLibrary --collection books --type json --file /books_init.json --jsonArray \
&& mongoimport --host db --db nodeAntiLibrary --collection authors --type json --file /authors_init.json --jsonArray \
&& mongoimport --host db --db nodeAntiLibrary --collection comments --type json --file /comments_init.json --jsonArray \
&& mongoimport --host db --db nodeAntiLibrary --collection users --type json --file /users_init.json --jsonArray
