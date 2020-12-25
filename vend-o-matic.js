var express = require('express');
var bodyParser = require('body-parser');

// instantiate express
var app = express();

// defines a json body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// beverages for vend-o-matic machine. For next version this could be 
let machine = [
    {
        name: "Fernet",
        quantity : 5
    },
    {
        name: "Coke",
        quantity : 5
    },
    {
        name: "Water",
        quantity : 5
    }
];

// coins accepted by the machine
let coinsInMachine = 0;

// number of coins needed to buy
const coinsToBuy = 2;

// getter for vend-o-matic remaining items
app.get('/inventory', function(req, res) {    
    
    //console.debug(machine);
    
    res.status(200).json(machine).send();
});

// defines getter for vend-o-matic remaining item :id
app.get('/inventory/:id', function(req, res) {
    
    // searching for beverage :id
    const findBeverage = machine.find(beverage => beverage.name === req.params.id);
    
    // if beverage exists, then findBeverage will be true
    if (findBeverage) {
        //console.debug("Beverage found: " + findBeverage.name + " " + findBeverage.quantity);
        // return located item
        res.status(200).json(findBeverage);
    } else {
        // if beverage doesn't exists, return 404 Not found with number of coins accepted
        res.status(404).set('X-Coins', coinsInMachine);
    }
    res.send();
});

// put to buy a certain item
app.put('/inventory/:id', function(req, res) {
    
    // Search the beverage by :id
    var findBeverage = machine.find(beverage => beverage.name === req.params.id);
    //console.debug("Beverage found: " + findBeverage.name + " " + findBeverage.quantity);
    
    // checking if beverage exists and if there are remaining items
    if (findBeverage && findBeverage.quantity > 0) {
    
        // checking coins balance
        if (coinsInMachine >= coinsToBuy) {
            
            // Collect coins
            coinsInMachine -= coinsToBuy;
            
            // deliver selected beverage
            findBeverage.quantity--;
            
            res.status(200).set('X-Coins', coinsInMachine)
                .set('X-Inventory-Remaining', findBeverage.quantity)
                .json({'quantity': 1});
        
        } else {
            // funds are insufficient
            res.status(400).set('X-Coins', coinsInMachine);
        }
    } else {
        // Beverage doesn't exist or there's no stock
        res.status(404).set('X-Coins', coinsInMachine);
    }
    res.send();
})

// put to add coin to vend-o-matic
app.put('/', function(req, res) {
    
    // checking if body respects api contract
    if(!req.body.coin || req.body.coin !== 1) {
        
        // Answer with status code 400 and message
        res.status(400).json({message: "Coin must be 1"});
    } else {
        
        // if it's ok, the coins are accepted
        coinsInMachine += req.body.coin;
        //console.debug(coinsInMachine + " coins accepted.")
        res.status(204).set('X-Coins', coinsInMachine);
    }
    res.send();
})

// defines delete for vend-o-matic
app.delete('/', function(req, res) {
    
    res.status(204).set('X-Coins', coinsInMachine);
    // system log number of coins returned
    //console.debug(coinsInMachine + " coins returned.")
    
    // reset number of coins in machine
    coinsInMachine = 0;
    res.send();
})

// server init on port 8080
app.listen(8080, () => {
 console.log("Server started on port 8080");
});

// Export our app for testing purposes
module.exports = app; // for testing