## TP3 - Fruit Market DApp
Ntamen Mesmin - 537 327 212
Claudel Valbrune - 537 370 144

Nombre heure de travail : 240h

# Instructions pour le déploiement

# Pour lancer le DApp , il faut suivre les instructions suivantes
Pour lancer ce Dapp, il faut avoir installer node, npm, ganache et aussi metamask

## 1- pour le Smart contrat 
    on lance un terminal et se postionne dans le repertoire FruitMarket, 
        - ganache pour le noeud de la BlockChain ETH
        - truffle compile pour compiler le contrat
        - truffle test pour lancer les tests unitaires
        - truffle migrate --reset

    Apres le deploiement du contrat, il faut copier le contrat compiler que se trouve dans "FruitMarket/build/contracts/FruitMarketplace.json", et le copier dans le front dans le repertoire "FruitMarket/frontend/src/abi"

    copier l'addresse du contrat généré que se trouve dans le contrat copié prćedement et le coller dans le fichier "FruitMarket/frontend/src/utils/contract.js"

## 2- pour le front, on se positionne fans le repertoire FruitMarket/frontend, 
    on tape ces commandes sur un terminal
        npm install
        ensuite, npm start

    pour faire les achats et ajouter un fruit, il faudra prendre une clé et créer un compte dans metamask pour faire la transaction désirée.
## Pour créer les comptes sur le portefeuille MetaMask, 
    Dans le terminal ou on a lancé ganache, copier les clé privées qui s'y trouvent pour créer les comptes Metamask

