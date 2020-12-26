var express = require('express');
var bodyParser = require('body-parser');
var machine = require("./machine.js");
var jwt = require('jsonwebtoken');
var config = require('./config.js');

//var https = require('https');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

//var credentials = {key: privateKey, cert: certificate};

// instantiate express
var app = express();

// defines key for json web token
app.set('key', config.key);

// defines a json body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// function to secure every endpoint with JWT
const protectedRoutes = express.Router(); 
protectedRoutes.use((req, res, next) => {
    // validate if token it's present on request
    const token = req.headers['access-token'];
    if (token) {
        // token validation 
        jwt.verify(token, app.get('key'), (err, decoded) => {      
            if (err) {
                // console.debug(err);
                return res.status(401).json({ message: 'Invalid token' });    
            } else {
                // token it's ok, continue invocation
                req.decoded = decoded;    
                next();
            }
        });
    } else {
        res.status(401).send({ 
            message: "Didn't send token" 
        });
    }
 });

// post to get json web token
app.post('/authenticate', (req, res) => {
    
    // it authenticates using user and password from request on plain text
    if(req.body.user === config.user && req.body.pass === config.pass) {
        
        // valid credentials
        const payload = {
            check:  true
        };
        
        // create token
        const token = jwt.sign(payload, app.get('key'), {
            // set token expiration time in seconds
            expiresIn: config.expirationTime
        });
        
        // answers token
        res.json({
            message: 'Success',
            token: token
        });
    } else {
        res.status(401).json({ message: "Wrong user or password"})
    }
});

// getter for vend-o-matic remaining items
app.get('/inventory', protectedRoutes, function(req, res) {    
    
    //console.debug(machine.beverages());
    
    res.status(200).json(machine.beverages()).send();
});

// defines getter for vend-o-matic remaining item :id
app.get('/inventory/:id', protectedRoutes, function(req, res) {
    
    // searching for beverage :id
    const findBeverage = machine.findBeverage(req.params.id);
    
    // if beverage exists, then findBeverage will be true
    if (findBeverage) {
        //console.debug("Beverage found: " + findBeverage.name + " " + findBeverage.quantity);
        // return located item
        res.status(200).json(findBeverage);
    } else {
        // if beverage doesn't exists, return 404 Not found with number of coins accepted
        res.status(404).set('X-Coins', machine.getCoinsInMachine());
    }
    res.send();
});

// put to buy a certain item
app.put('/inventory/:id', protectedRoutes, function(req, res) {
    
    // Search the beverage by :id
    var findBeverage = machine.findBeverage(req.params.id);
    //console.debug("Beverage found: " + findBeverage.name + " " + findBeverage.quantity);
    
    // checking if beverage exists and if there are remaining items
    if (findBeverage && findBeverage.quantity > 0) {
    
        // checking coins balance
        if (machine.getCoinsInMachine() >= machine.getCoinsToBuy()) {
            
            // Collect coins
            machine.collectCoins();
            
            // deliver selected beverage
            machine.deliverBeverage(findBeverage.name);
            
            res.status(200).set('X-Coins', machine.getCoinsInMachine())
                .set('X-Inventory-Remaining', machine.findBeverage(req.params.id).quantity)
                .json({'quantity': 1});
        
        } else {
            // funds are insufficient
            res.status(400).set('X-Coins', machine.getCoinsInMachine());
        }
    } else {
        // Beverage doesn't exist or there's no stock
        res.status(404).set('X-Coins', machine.getCoinsInMachine());
    }
    res.send();
});

// put to add coin to vend-o-matic
app.put('/', protectedRoutes, function(req, res) {
    
    // checking if body respects api contract
    if(!req.body.coin || req.body.coin !== 1) {
        
        // Answer with status code 400 and message
        res.status(400).json({message: "Coin must be 1"});
    } else {
        
        // if it's ok, the coins are accepted
        machine.addCoin(req.body.coin);
        
        //console.debug(machine.getCoinsInMachine + " coins accepted.")
        res.status(204).set('X-Coins', machine.getCoinsInMachine());
    }
    res.send();
})

// defines delete for vend-o-matic
app.delete('/', protectedRoutes, function(req, res) {
    
    res.status(204).set('X-Coins', machine.getCoinsInMachine());
    // system log number of coins returned
    //console.debug(machine.getCoinsInMachine + " coins returned.")
    
    // reset number of coins in machine
    machine.resetCoins();
    res.send();
})

// server init on port 8080
app.listen(8080, () => {
 console.log("Server started on port 8080");
});

//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);

// Export our app for testing purposes
module.exports = app; // for testing