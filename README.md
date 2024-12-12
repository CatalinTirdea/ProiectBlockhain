# ProiectBlockhain
![Screenshot From 2024-12-12 16-25-43](https://github.com/user-attachments/assets/e1e356e6-ea40-4410-983a-68790ab82038)

#### Daca schimbi fisierul .sol trebuie compilat: 
npx hardhat compile

apoi in hardhat/artifacts/contracts/fonduri.sol/Funds.json trb sa iei valoarea de la "abi" si sa o pui in api/abi.txt
#### Rulare hardhat:
cd hardhat

npx hardhat node

npx hardhat run scripts/deploy.js --network localhost
#### Rulare frontend:
cd client/funds

npm run dev
