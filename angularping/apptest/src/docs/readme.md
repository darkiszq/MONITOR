# MONITOR - Documentation

## INTRODUCTION


MONITOR app is a website written in the Angular framework connected to database and express.js server, made for monitoring websites and packet response verification

## FUNCTIONS

- Displaying current status of websites
- Displaying pie-chart of websites activity
- Saving raports from websites activity
- Saving current status of websites in database

## USED TECHNOLOGIES

### Backend
- Node.js
  - Express.js
  - Mysql2

### Frontend
- Angular
  - Rxjs
  - Express.js
  - Charts.css

### DATABASE
- MySQL

## INSTALATION

### PREREQUISITES

- Angular CLI (version 21.0.4)
- Node.js (version 24.12.0)
- GitHub CLI (version 2.83.2), or any program used for clonning github repositories
- XAMPP (version 3.0.0)
- Working internet connection + web browser

### INSTALATION PROCESS

#### INTRODUCTION

1. Create new blank folder 
2. Clone repo to the folder

   **Jeśli używasz GitHub CLI:**
   - Open CMD in the app folder
   - If you use GitHub CLI for the first time use command:
     ```
     gh auth login
     ```
     and log in according to the instructions on screen
   - Use command  :
     ```
     gh repo clone darkiszq/MONITOR
     ```

3. Make sure that the local ports 4200, 8080 and 3306 are not blocked, the app uses them

#### DATABASE SETUP

1. Open XAMPP
2. Turn on Apache and MySQL
3. Click the "Admin" button next to the MySQL
4. On the left bar click the "New" button
5. Write name "uptime" and click the "Create" button
6. Go to the "Import" tab
7. Select the "uptime.sql" file from the cloned repository and click the "Import" button without changing the import settings 

## STARTING THE APP
1.	Repeat the first two steps from the previous point
2.	Open CMD and use command
```
cd [CLONED REPO FOLDER LOCATION]/angularping/apptest
```
3.  Use command
```
npm install
```
4.	Use command 
```
ng serve --proxy-config proxy.conf.json
```
5.	Open second cmd and use command 
```
cd [CLONED REPO FOLDER LOCATION]/databasepostserver
```
6.	Use command
```
node index.js
```
7.	In your web browser go to http://localhost:4200/
