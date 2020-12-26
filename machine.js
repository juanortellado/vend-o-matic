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

module.exports = {
    
    beverages: function () {
        return machine;
    },
    
    findBeverage: function (id) {
        // searching for beverage :id
        return machine.find(beverage => beverage.name === id);
    },
    
    getCoinsInMachine: function () {
        return coinsInMachine;
    },
    
    getCoinsToBuy: function () {
        return coinsToBuy;
    },
    
    collectCoins: function () {
        coinsInMachine -= coinsToBuy;
    },
    
    deliverBeverage: function (id) {
        
        var deliveryBeverage = machine.find(beverage => beverage.name === id);
        if (deliveryBeverage) {
            deliveryBeverage.quantity--;
        }
        
    },
    
    addCoin: function (coin) {
        coinsInMachine += coin;
    },
    
    resetCoins: function () {
        coinsInMachine = 0;
    }

}
