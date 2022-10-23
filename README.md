### Back end Project 

### API with node.js express mongoDB

The goals of the project was to create an API and database with mongoDB.

### API functionalities
User can signup , user info are stock in DB and password are hashed with bcrypt.

User can signin , if username and password are good user get an unique jsonwebtoken.

User can create a sauce post , all sauce are stock in DB and contain the unique  userId.

User can modify , delete only  his sauce post.

All user can like and dislike all sauce post only once.

## set up Backend

run npm install to set up all dependencies.

there is a dotenv , you will have to create a file name .env and inside setup your personnal connexion information from your DB :
DB_PASSWORD=yourDataBasePassword
DB_USER=yourDataBaseUsername
TOKENPASSWORD=yourTokenPassword

then finnaly run nodemon index.js to start the project !

