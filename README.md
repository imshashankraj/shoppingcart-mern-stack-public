Sample Shopping Cart created in MERN(MongoDB, Express JS, React, NodeJS) Stack.

Steps to start the application:
----------------------------------
1. Run "npm install" in the extracted project folder.
2. Create a mongoDB Atlas Database named "shoppingcart" and provide its connection string in the "\backend\db.js". Example connection string:
'mongodb+srv://<username>:<password>@cluster0...mongodb.net/?retryWrites=true&w=majority'
3. Modify the connection string to use database "shoppingcart" as below and replace with a valid credentials:
'mongodb+srv://<username>:<password>@cluster0...mongodb.net/shoppingcart?retryWrites=true&w=majority'
4. Add your IP to Cluster to allow connection.
5. Create collections "products" and "users" and import data from files under "mongoDB_collections" using mongoDBCompass or other tool. Provided user: "user@gmail.com" password: "123".
6. Open a Terminal(command prompt window) and Run "npm start" to start the React development server.
7. (Keep React development server running) Additionally Open a Terminal(command prompt window) and run "npm run start:server" to start the Node.js server