pragma solidity ^0.8.20;

contract FruitMarketplace {
    struct Fruit{
        string name;
        uint price;
        address payable seller;
        bool available;
        address buyer;
    }

    Fruit[] public fruits;

    mapping(address => uint[]) public sellerFruits;
    mapping(address => uint) public sellerRatings;

    function addFruit(string memory _name, uint _price) public{
        fruits.push(Fruit(_name, _price, payable(msg.sender), true, address(0)));
        sellerFruits[msg.sender].push(fruits.length - 1);
    }

    function buyFruit(uint _index) public payable{
        Fruit storage fruit = fruits[_index];
        require(fruit.available, "Fruit already sold");
        require(msg.value >= fruit.price, "Not enough funds");

        fruit.available = false;
        fruit.buyer = msg.sender;
        fruit.seller.transfer(msg.value);
    }

    function rateSeller(address _seller, uint _rating) public {
        require(_rating <= 5, "Ratting must be out of 5");
        sellerRatings[_seller] = _rating;
    }

    function updateFruit(uint _index, string memory _name, uint _price) public{
        Fruit storage fruit = fruits[_index];
        require(msg.sender == fruit.seller, "Only seller can update");
        require(fruit.available, "Fruit alredy sold");
        fruit.name = _name;
        fruit.price = _price;
    }

    function getFruits() public view returns (Fruit[] memory){
        return fruits;
    }
}