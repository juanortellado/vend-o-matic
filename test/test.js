// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// import vending machine
let app = require('../vend-o-matic');

// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let token;

describe('Vend-O-Matic', () => {
    
    describe('POST /authenticate errors', () => {
        
        it('it should not authenticate', (done) => {
            let user = {"user": "user", "pass": "pas"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
          });
        
        it('it should authenticate but do not send token to endpoint', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                
                    chai.request(app)
                        .get('/inventory')
                        .end((err, res) => {
                          res.should.have.status(401);
                          res.body.should.have.property('message');
                      done();
                    });
                });
          });
        
          it('it should authenticate but do not send correct token to endpoint', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                
                    chai.request(app)
                        .get('/inventory')
                        .set('access-token', "token")
                        .end((err, res) => {
                          res.should.have.status(401);
                          res.body.should.have.property('message');
                      done();
                    });
                });
          });
      });
    
    describe('GET /inventory', () => {
        
        it('it should GET all the beverages', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    
                    chai.request(app)
                        .get('/inventory')
                        .set('access-token', res.body.token)
                        .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('array');
                          res.body.length.should.be.eql(3);
                      done();
                    });
                });
          });
      });
    
    describe('GET /inventory/:id', () => {
      
        
        it('it should GET Fernet by the given id', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    
            
                  let beverage = {name: 'Fernet', quantity: 5}
                  chai.request(app)
                    .get('/inventory/' + beverage.name)
                    .set('access-token', res.body.token)
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('name');
                          res.body.should.have.property('quantity');
                          res.body.should.have.property('name').eql(beverage.name);
                          res.body.should.have.property('quantity').eql(beverage.quantity);
                      done();
                    });
            });
      });
     
        it('it should GET Coke by the given id', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    
              
                let beverage = {name: 'Coke', quantity: 5}
                chai.request(app)
                .get('/inventory/' + beverage.name)
                .set('access-token', res.body.token)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('name');
                      res.body.should.have.property('quantity');
                      res.body.should.have.property('name').eql(beverage.name);
                      res.body.should.have.property('quantity').eql(beverage.quantity);
                  done();
                });
            });
      });
        
        it('it should GET Water by the given id', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                
                let beverage = {name: 'Water', quantity: 5}
                chai.request(app)
                    .get('/inventory/' + beverage.name)
                    .set('access-token', res.body.token)
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('name');
                          res.body.should.have.property('quantity');
                          res.body.should.have.property('name').eql(beverage.name);
                          res.body.should.have.property('quantity').eql(beverage.quantity);
                      done();
                });
            });
      });
        
        it('it should throw not found', function (done) {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                
                    let beverage = {name: 'Pepsi', quantity: 5};
                    chai.request(app)
                        .get('/inventory/' + beverage.name)
                        .set('access-token', res.body.token)
                        .end((err, res) => {
                            if (err) {   
                                res.should.have.status(404);
                            }
                            done();
                        });
            });
        });
    });
     
    describe('DELETE /', () => {
      
      it('it should PUT a coin in machine', (done) => {
          let user = {"user": "machine", "pass": "securePass"};
          chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
                
                let coin = {
                    coin: 1
                }
                chai.request(app)
                    .put('/')
                    .send(coin)
                    .set('access-token', res.body.token)
                    .end((err, res) => {
                        res.should.have.status(204);
                        res.should.have.header('X-Coins', 1);
                        done();
                    });
            });
      });
        
      it('it should PUT a second coin in machine', (done) => {
          let user = {"user": "machine", "pass": "securePass"};
          chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
          
                let coin = {
                    coin: 1
                }
                chai.request(app)
                  .put('/')
                  .send(coin)
                  .set('access-token', res.body.token)
                  .end((err, res) => {
                    res.should.have.status(204);
                    res.should.have.header('X-Coins', 2);
                    done();
                });
            });
      });
        
      it('it should DELETE the coins', (done) => {
          let user = {"user": "machine", "pass": "securePass"};
          chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
              
                  chai.request(app)
                      .delete('/')
                      .set('access-token', res.body.token)
                      .end((err, res) => {
                        res.should.have.status(204);
                        res.should.have.header('X-Coins', 2);
                        done();
                    });
            });
      });
    });
    
    describe('PUT /', () => {
      it('it should PUT a coin in machine', (done) => {
          let user = {"user": "machine", "pass": "securePass"};
          chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
          
                  let coin = {
                    coin: 1
                  }
                  chai.request(app)
                      .put('/')
                      .send(coin)
                      .set('access-token', res.body.token)
                      .end((err, res) => {
                        res.should.have.status(204);
                        res.should.have.header('X-Coins', 1);
                        done();
                    });
          });
      });
        
        it('it should not PUT four coins in machine', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');

                let coin = {
                    coin: 4
                }
                chai.request(app)
                  .put('/')
                  .send(coin)
                  .set('access-token', res.body.token)
                  .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
            });
      });
        
        it('it should PUT a second coin in machine', (done) => {
          let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
                
                let coin = {
                    coin: 1
                }
          
                chai.request(app)
                  .put('/')
                  .send(coin)
                  .set('access-token', res.body.token)
                  .end((err, res) => {
                    res.should.have.status(204);
                    res.should.have.header('X-Coins', 2);
                    done();
                });
            });
        });
    });
       
    describe('PUT /inventory/:id using same token', () => {
        
        it('it should get a Token', (done) => {
            let user = {"user": "machine", "pass": "securePass"};
            chai.request(app)
              .post('/authenticate')
              .send(user)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
                
                token = res.body.token;
                done();
            });
        });
        
        
        
        it('it should buy a Coke', (done) => {            
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('X-Coins', 0);
                res.should.have.header('X-Inventory-Remaining', 4);
                res.body.should.be.a('object');
                res.body.should.have.property('quantity');
                res.body.should.have.property('quantity').eql(1);
                done();
            });
        });
        
        it('it should not buy a Coke because there are not coins', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(400);
                res.should.have.header('X-Coins', 0);
                done();
            });
        });
        
        it('it should PUT a coin in machine', (done) => {
          let coin = {
            coin: 1
          }
          
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 1);
                done();
            });
        });
        it('it should PUT a second coin in machine', (done) => {
          let coin = {
            coin: 1
          }
          
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 2);
                done();
            });
        });
        
        it('it should not buy a Pepsi because machine do not have that beverage', (done) => {
            let beverage = 'Pepsi';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(404);
                res.should.have.header('X-Coins', 2);
                done();
            });
        });
        
        it('it should PUT 6 coins more in machine, one at a time', (done) => {
          let coin = {
            coin: 1
          }
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 3);
            });
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 4);
            });
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 5);
            });
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 6);
            });
            chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 7);
            });
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 8);
                done();
            });
        });
        
        it('it should buy another a Coke', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('X-Coins', 6);
                res.should.have.header('X-Inventory-Remaining', 3);
                res.body.should.be.a('object');
                res.body.should.have.property('quantity');
                res.body.should.have.property('quantity').eql(1);
                done();
            });
        });
        it('another Coke please', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('X-Coins', 4);
                res.should.have.header('X-Inventory-Remaining', 2);
                res.body.should.be.a('object');
                res.body.should.have.property('quantity');
                res.body.should.have.property('quantity').eql(1);
                done();
            });
        });
        it('yep, another one', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('X-Coins', 2);
                res.should.have.header('X-Inventory-Remaining', 1);
                res.body.should.be.a('object');
                res.body.should.have.property('quantity');
                res.body.should.have.property('quantity').eql(1);
                done();
            });
        });
        it('the last one, i promise', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.should.have.header('X-Coins', 0);
                res.should.have.header('X-Inventory-Remaining', 0);
                res.body.should.be.a('object');
                res.body.should.have.property('quantity');
                res.body.should.have.property('quantity').eql(1);
                done();
            });
        });
        
        
        it('it should PUT a coin in machine', (done) => {
          let coin = {
            coin: 1
          }
          
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 1);
                done();
            });
        });
        it('it should PUT a second coin in machine', (done) => {
          let coin = {
            coin: 1
          }
          
          chai.request(app)
              .put('/')
              .send(coin)
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(204);
                res.should.have.header('X-Coins', 2);
                done();
            });
        });
        it('it should not buy a Coke because there are no more in machine', (done) => {
            let beverage = 'Coke';
            chai.request(app)
              .put('/inventory/' + beverage)
              .send()
              .set('access-token', token)
              .end((err, res) => {
                res.should.have.status(404);
                res.should.have.header('X-Coins', 2);
                done();
            });
        });
    });
    
});

