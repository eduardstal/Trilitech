This is a Demo dApp that allows you to manage your NFT's using EtherLink, a EVM compatible blockchain. 

The dApp is built using Next.js, TypeScript, Tailwind CSS, and Hardhat.

Within this repository, you will find a folder for the frontend and a folder for smart contract deployment using hardhat. 

Current features include: 
- Connecting your MetaMask wallet
- Minting NFTs with custom names, descriptions, and images
- Transferring NFTs to other wallets 
- View all NFT's that you own using the EtherLink testnet explorer API

Future planned features: 
- Adding all variables to .env
- NFT transfer pop-up, should include some details about the NFT being transferred. 
- Adding image storage to IPFS. 
- Adding wallet connection using WalletConnect alongside MetaMask. 
- Adding burn functionality to the contract.

A live demo of the dApp can be found at: https://trilitech-theta.vercel.app 

Faucet tokens for the testnet can be requested from: https://faucet.etherlink.com 
___
### Install prerequisites

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

##### Clone the repository
```bash
git clone https://github.com/eduardstal/Trilitech .
```
___
### 1. Setup instructions for contracts

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
### 2. Setup instructions for the frontend

```bash
cd Trilitech/front_end
```
```bash
npm install
npm run dev
```
Locally, the frontend will be available at `http://localhost:3000`

___
### 1. Usage instructions for the client.
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

##### Transfer NFTs 
1. Click on any of the NFTs displayed in the gallery. A form will open up.
2. Fill in the address to which you want to transfer the NFT, and click on the "Confirm Transfer" button.
3. Confirm the transaction that opens up in MetaMask.

### Troubleshooting
###### Deploying the contract does not fail, but it does not finish either. It's stuck.
Use the verbose flag to see where specifically the deployment fails, but the most common issue is that the hardhat.config.ts file is not configured correctly. 
Make sure that the RPC and chain ID are correctly configured. 
```ts
etherlink: {
    url: "https://node.ghostnet.etherlink.com",
    chainId: 128123,
},
```
If from the verbose output you see that the point at which the deployment is stuck is `hardhat:core:hre Creating provider for network etherlink +26ms` then make sure that enough funds are in the wallet to cover the gas fees.
You can request testnet tokens from the faucet at https://faucet.etherlink.com.
###### Deploying the contract fails due to the gas limit being exceeded. 
Set the gas price to 2_000_000_000 and the gas limit to 30_000_000 or lower in the hardhat.config.ts file. 
```ts
etherlink: {
    gas: 30_000_000,
    gasPrice: 2_000_000_000,
},
```
###### Deploying the contract fails with a "Invalid account error". Make sure that the private key is correctly placed in the .env file, or if you are using the unsecure method, make sure that the private key is added to the hardhat.config.ts file.
```ts
etherlink: {
    accounts: ["YOUR_PRIVATE_KEY"],
},
```
###### What functions are available in the contract? 
The contract extends an ERC721 contract and implements the following: 
- mint function - Allows minting of new tokens. 
- tokenURI function - Returns the metadata URI associated with a specific token ID.
- nextTokenId function - Public state variable that returns the next token ID to be minted.

###### The frontend is not displaying any NFTs for my account. 
The UI gathers it's data from the EtherLink testnet explorer API. If you have just minted the NFT, it may take a few minutes for the transaction to be indexed and available in the API. 
For additional testing, you can call the API directly in order to see if any NFTs are being returned. 

```curl
curl -X GET "https://testnet.explorer.etherlink.com/api/v2/addresses/0xYOUR_WALLET_GOES_HERE/nft" -H "accept: application/json"
```
If nothing is returned, then the issue may be with the EtherLink explorer API.

###### I cannot transfer my NFT to the 0x000...000 address. 
The contract does not allow transferring to the 0x000...000 address as burning is not implemented. The 0x000...000 address is reserved for burning tokens.

###### I'm using React 19, and certain components do not function as expected. 
The current implementation of the dApp is not compatible with React 19 due to availability of certain versions of the OpenZeppelin contracts. Use react 18 instead, and leave the package.json as is. 

###### My NFT's image cannot be rendered properly in the frontend. It crashes the app.
Next.js loads images from trusted sources only. If the domain where the image is hosted can not be found in the `next.config.js` file, the image will not be rendered, and the app will crash. 
You can configure additional domains as such: 
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
  },
};
```
###### When transferring an NFT, the following error is displayed: "Please enter a valid EVM address." 
This happens due to a failed validation of the address. Either the checksum address is invalid, or the address is not a valid EVM address at all. To be safe, you can use the lowercase address format to avoid checksum issues.


