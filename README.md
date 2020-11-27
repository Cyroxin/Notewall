# Notewall
Site for posting messages 



## Git Commands

**Cloning the repository**

```` Git
$ git clone https://github.com/cyroxin/notewall.git
```` 

**Synchronizing changes**

```` Git
$ git pull
$ git commit -a -m "Synchronizing"
$ git push
```` 


## Setup

  1. Create a **.env** file in the the repo folder with the following content:
```` conf
DB_HOST=mysql.databaseunlimited.com
DB_USER=myusername
DB_PASS=mypassword
DB_NAME=mydatabasename
production=false
````

2. Create certificates for https and folders for hosting files by writing the following commands into the terminal:
```` batch
$ cd /location/to/your/repo/folder/
$ sudo openssl genrsa -out ssl-key.pem 2048
$ sudo openssl req -new -key ssl-key.pem -out certrequest.csr
$ sudo openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem
$ mkdir thumbnails
$ mkdir uploads
```` 

3. Open ``projectfolder/info/Dbfile.txt`` and copy the content into your own local database defined earlier and run it.

4. Install nodejs

5. While in the project folder, run ``node app.js`` and open https://localhost:8000/ in your browser.
 

