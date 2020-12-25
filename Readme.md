# Vend-O-Matic!

Hi! This is a resume of the API for **Vend-O-Matic**. You will find the technology and assumptions for the implementation, trying to keep as simple as possible, and it's also mentioned some improvement points.

## Files
The API was developed with _Node.js_ and _Express_, and for unitary tests, the _Mocha_ and _Chai_ framework. The project has the structure represented below:
```
.
+-- package.json
+-- test
|   +-- test.js
+-- vend-o-matic.js
+-- Readme.md
```

## Assumptions

It is assumed to run within a safe environment of the vending machine.

According to vending constraints, it is indicated that only one coin will be entered, so the API considers that each invocation to add coins will contain only one.  However, it was implemented in a way that if more coins are accepted per invocation, can be easily modified and accepted. Although the contract does not specify, controls and messages were added for cases where the requirement of one coin is not met at a time, as well as if an identifier of a beverage that is not in the machine, is received. Also, it's designed to if the number of coins needed to buy change in the future, you only have to modify that constant in code.

For development purposes, API entities like beverages, coins, coins needed to buy, are handled in memory just to keep it simple but could be implemented differently.

## Execution
First of all, it’s necessary to execute installation modules for _Node.js_ and _Express_.
```
npm install
```
```
npm install express
```
Once installed those modules, we need to install unitary test modules, in this case, _Mocha_ and _Chai_
```
npm install chai-http
npm install chai
```
```
npm install mocha -g
```
Now we are ready to run tests or API server. To run test execute:
```
npm test
```
To run the API server:
```
node vend-o-matic.js
```
or
```
node vend-o-matic.js &
```

## Improvement points
In order to implement a better service, there are identified some points that could be improved.
 - A DB can be modeled for coins and stock of beverages management. This should bring transaction guarantees if the system goes down.
- For better security purposes, controls such as HTTPS with mutual authentication and OAuth tokens can be added.
- Like it’s said before, entities could be implemented in a DB. Also, parameters like coins needed to buy could be saved on DB or a configuration file, making service more flexible with functional changes.
