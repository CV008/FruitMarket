// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FruitMarketplace
 * @dev Ce contrat permet de vendre, acheter et noter des fruits.
 * Il intègre des mesures de sécurité comme : require, modificateurs d'accès,
 * et la protection contre les attaques de reentrancy.
 */
contract FruitMarketplace {
    struct Fruit {
        string name;
        uint price;
        address payable seller;
        bool available;
        address buyer;
    }

    struct IndividualRating {
        address rater;
        uint rating;
        uint timestamp;
    }

    struct Rating {
        uint rating;
        uint totalRating;
        uint numberOfRatings;
    }

    Fruit[] public fruits;

    mapping(address => uint[]) public sellerFruits;
    mapping(address => IndividualRating[]) public allRatings;
    mapping(address => Rating) public sellerRatings;
    mapping(address => mapping(address => bool)) public hasRated;
    mapping(address => mapping(address => bool)) public hasBoughtFrom;

    event FruitAdded(
        uint indexed index,
        string name,
        uint price,
        address indexed seller
    );
    event FruitBought(uint indexed index, address indexed buyer, uint price);
    event SellerRated(
        address indexed seller,
        uint rating,
        address indexed rater
    );
    event FruitUpdated(uint indexed index, string name, uint price);

    // Modificateur pour vérifier que le fruit est valide
    modifier validFruit(uint _index) {
        require(_index < fruits.length, "Invalid fruit index");
        _;
    }

    // Modificateur pour vérifier que seul le vendeur peut modifier ses fruits
    modifier onlySeller(uint _index) {
        require(
            fruits[_index].seller == msg.sender,
            "Only seller can perform this action"
        );
        _;
    }

    //  Protection contre les mises à jour d’un fruit déjà vendu
    modifier fruitAvailable(uint _index) {
        require(fruits[_index].available, "Fruit already sold");
        _;
    }

    // Ajout d'un fruit à vendre
    function addFruit(string memory _name, uint _price) public {
        require(_price > 0, "Price must be greater than 0"); // Validation de l'entrée
        require(bytes(_name).length > 0, "Fruit name cannot be empty"); // Sécurité sur l'entrée texte

        fruits.push(
            Fruit(_name, _price, payable(msg.sender), true, address(0))
        );
        uint index = fruits.length - 1;
        sellerFruits[msg.sender].push(index);

        emit FruitAdded(index, _name, _price, msg.sender);
    }

    // Acheter un fruit
    function buyFruit(
        uint _index
    ) public payable validFruit(_index) fruitAvailable(_index) {
        Fruit storage fruit = fruits[_index];

        require(msg.value >= fruit.price, "Not enough funds"); // Validation du paiement
        require(msg.sender != fruit.seller, "Seller cannot buy own fruit"); // Anti-abus

        // Checks-Effects-Interactions pattern : important pour éviter la reentrancy
        fruit.available = false;
        fruit.buyer = msg.sender;
        hasBoughtFrom[msg.sender][fruit.seller] = true;

        // Transfert des fonds après mise à jour de l’état (anti-reentrancy)
        fruit.seller.transfer(fruit.price);

        //  Remboursement du surplus (bonne pratique)
        if (msg.value > fruit.price) {
            payable(msg.sender).transfer(msg.value - fruit.price);
        }

        emit FruitBought(_index, msg.sender, fruit.price);
    }

    // Noter un vendeur
    function rateSeller(address _seller, uint _rating) public {
        require(_rating > 0 && _rating <= 5, "Rating must be between 1 and 5"); // Entrée valide
        require(
            !hasRated[msg.sender][_seller],
            "You already rated this seller"
        );
        require(
            hasBoughtFrom[msg.sender][_seller],
            "You must have bought from this seller"
        );

        sellerRatings[_seller].totalRating += _rating;
        sellerRatings[_seller].numberOfRatings += 1;
        hasRated[msg.sender][_seller] = true;

        allRatings[_seller].push(
            IndividualRating({
                rater: msg.sender,
                rating: _rating,
                timestamp: block.timestamp
            })
        );

        emit SellerRated(_seller, _rating, msg.sender);
    }

    //  Modifier les détails d’un fruit
    function updateFruit(
        uint _index,
        string memory _name,
        uint _price
    ) public validFruit(_index) onlySeller(_index) fruitAvailable(_index) {
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_name).length > 0, "Fruit name cannot be empty");

        Fruit storage fruit = fruits[_index];
        fruit.name = _name;
        fruit.price = _price;

        emit FruitUpdated(_index, _name, _price);
    }

    //  Obtenir la note moyenne d’un vendeur
    function getSellerAverageRating(
        address _seller
    ) public view returns (uint) {
        Rating memory r = sellerRatings[_seller];
        if (r.numberOfRatings == 0) return 0;
        return r.totalRating / r.numberOfRatings;
    }

    //  Nombre total de fruits
    function getFruitCount() public view returns (uint) {
        return fruits.length;
    }

    //  Détails d’un fruit
    function getFruit(
        uint _index
    )
        public
        view
        validFruit(_index)
        returns (
            string memory name,
            uint price,
            address seller,
            bool available,
            address buyer
        )
    {
        Fruit memory fruit = fruits[_index];
        return (
            fruit.name,
            fruit.price,
            fruit.seller,
            fruit.available,
            fruit.buyer
        );
    }

    //  Notes d’un vendeur
    function getAllRatings(
        address _seller
    )
        public
        view
        returns (
            address[] memory raters,
            uint[] memory ratings,
            uint[] memory timestamps
        )
    {
        uint count = allRatings[_seller].length;
        raters = new address[](count);
        ratings = new uint[](count);
        timestamps = new uint[](count);

        for (uint i = 0; i < count; i++) {
            IndividualRating storage r = allRatings[_seller][i];
            raters[i] = r.rater;
            ratings[i] = r.rating;
            timestamps[i] = r.timestamp;
        }
    }
}
