This is a Demo dApp that allows you to manage your NFT's using EtherLink, a EVM compatible blockchain. 

The dApp is built using Next.js, TypeScript, Tailwind CSS, and Hardhat.

Within this repository, you will find a folder for the frontend and a folder for smart contract deployment using hardhat. 

Current features include: 
- Connecting your MetaMask wallet
- Minting NFTs with custom names, descriptions, and images
- Transferring Minted NFTs to other wallets 
- Viewing all NFT's that you own

A live demo of the dApp can be found at: https://trilitech-theta.vercel.app 

Faucet tokens for the testnet can be requested from: https://faucet.etherlink.com 
___
##### Install prerequisites

You will need to install the following prerequisites:
- Node.js v22.15.0 or higher 
- Npm v10.9.2 or higher
- Git

On Ubuntu: 
```bash
sudo apt update && sudo apt upgrade -y
```
```bash
sudo apt install nodejs npm git 
```
On Windows: 
Download and install Git from https://git-scm.com/downloads
Download and install Node.js from https://nodejs.org

On Mac:
```bash
brew install node git
```
Once Node.js and Npm are installed on the system, we can move on to customising and deplotying the smart contract and the frontend.

###### Clone the repository
```bash
git clone https://github.com/eduardstal/Trilitech .
```
___
#### 1. Setup instructions for contracts

```bash
cd Trilitech/contracts
```

❗If you are using Windows , you need to unlock running scripts from the PowerShell, as deploying using hardhat requires running a deploy script.
```bash
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```
Finally, deploy the contract. You can find the contract address in the console output. Additionally, the ABI for the deployed contract can be found in `/contracts/artifacts/contracts/EtherLinkNFT.sol/EtherLinkNFT.json`
```bash
npx hardhat run scripts/deploy.ts --network etherlink --verbose 
```
It is highly recommended to create a `.env` file to store the private key of the wallet that is deploying the contract. Do not follow my example, as it's not secure at all. A `.env.example` file can be found in the `/contracts` folder. 
___
#### 2. Setup instructions for the frontend

```bash
cd Trilitech/front_end
```
```bash
npm install
npm run dev
```
Locally, the frontend will be available at `http://localhost:3000`

___
#### 1. Usage instructions for the client.
##### Connect your wallet to the EtherLink testnet
1. Download and install MetaMask from https://metamask.io/download/
2. Create a new wallet or import an existing one. 
3. Add the custom RPC for EtherLink testnet, this will allow MetaMask to connect to the EtherLink testnet.
3.1 In the top left corner, open the dropdown menu for networks and select "Add a custom network" 
3.2 Fill in the following details: 
```
Network Name: Etherlink Testnet
Network RPC URL: https://node.ghostnet.etherlink.com
Chain ID: 128123
Currency Symbol: XTZ
Block Explorer URL: https://testnet.explorer.etherlink.com/
```
4. Once the network is added, you can switch to it, and proceed to using the frontend.
##### Mint NFTs
1. Click on the "Create NFT" button in the middle of the header section. 
2. Fill in the form with the name, description, and image URL of the NFT you want to mint.
3. Click on the "Confirm Mint" button to mint the NFT. 
4. Confirm the transaction that opens up in MetaMask. 

#### Transfer NFTs 
1. Click on any of the NFTs displayed in the gallery. A form will open up.
2. Fill in the address to which you want to transfer the NFT, and click on the "Confirm Transfer" button.
3. Confirm the transaction that opens up in MetaMask.



## potential issues during setup




## Notes about EtherLink


## Potential improvements
Use react 18 !! 

