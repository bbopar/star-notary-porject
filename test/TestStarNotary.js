const StarNotary = artifacts.require("StarNotary.sol");

var accounts;
var owner;

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("can Create a Star", async () => {
  let tokenId = 1;
  let instance = await StarNotary.deployed();
  await instance.createStar("Awesome Star!", tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Awesome Star!");
});

it("lets user1 put up their star for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it("lets user1 get the funds after the sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 3;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value: balance });
  let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
  let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
  let value2 = Number(balanceOfUser1AfterTransaction);
  assert.equal(value1, value2);
});

it("lets user2 buy a star, if it is put up for sale", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 4;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it("lets user2 buy a star and decreases its balance in ether", async () => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
  let value =
    Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
  assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it("can add the star name and star symbol properly", async () => {
  // 1. create a Star with different tokenId (this is so confusing please remove this from boiler plate)
  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  let instance = await StarNotary.deployed();
  let name = await instance.name.call();
  let symbol = await instance.symbol.call();
  assert.equal(name, "BBToken420");
  assert.equal(symbol, "BB420");
});

it("lets 2 users exchange stars", async () => {
  // 1. create 2 Stars with different tokenId
  let tokenId1 = 6;
  let tokenId2 = 7;
  let user1 = accounts[0];
  let user2 = accounts[1];
  let instance = await StarNotary.deployed();
  await instance.createStar("awesome star", tokenId1, { from: user1 });
  await instance.createStar("ugly star", tokenId2, { from: user2 });
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  await instance.exchangeStars(tokenId2, tokenId1);
  // 3. Verify that the owners changed
  // user2 should be owner of tokenId and user1 should be owner of tokenId + 1
  assert.equal(await instance.ownerOf(tokenId2), user1);
  assert.equal(await instance.ownerOf(tokenId1), user2);
});

it("lets a user transfer a star", async () => {
  // 1. create a Star with different tokenId
  let tokenId = 8;
  let instance = await StarNotary.deployed();
  let user = accounts[0];
  let toUser = accounts[1];
  await instance.createStar("transfer star", tokenId, { from: user });
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(toUser, tokenId);
  // 3. Verify the star owner changed.
  assert.equal(await instance.ownerOf(tokenId), toUser);
});

it("lookUptokenIdToStarInfo test", async () => {
  // 1. create a Star with different tokenId
  let tokenId = 9;
  let instance = await StarNotary.deployed();
  let user = accounts[0];
  await instance.createStar("Verify star", tokenId, { from: user });
  // 2. Call your method lookUptokenIdToStarInfo
  const name = await instance.lookUptokenIdToStarInfo(tokenId);
  // 3. Verify if you Star name is the same
  assert.equal(name, "Verify star");
});
