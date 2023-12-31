const express = require('express');
const app = express();
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const cors = require('cors');

app.use(cors({
    origin: 'https://members.wsab.dev'  // replace with your frontend domain so no one outside your domain can hit this api
}));
// Initialize Web3 with your preferred provider (e.g., Infura)
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// Set up your private key and sender address
const privateKey = '' //// here you need to put your key
const senderAddress = '0xb3b6F71A72a47A6EE7deF98381c1035cB1187B82';

// Define the ERC-20 token contract address and ABI
const tokenContractAddress = '0x9ceEAa2C9d33783d6B9B8288a94E40cd405c34E2';
const tokenContractAddressUSDT = '0x55d398326f99059fF775485246999027B3197955';


const tokenContractABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
// Define the recipient address

// Initialize the ERC-20 token contract
const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

const tokenContractUSDT = new web3.eth.Contract(tokenContractABI, tokenContractAddressUSDT);

// const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

app.get('/transferERC20USDT', async (req, res) => {
  console.log("here")
  try {
const recipientAddress = req.query.add;
const amount = req.query.amount;
console.log(recipientAddress,amount)

    const data = tokenContractUSDT.methods.transfer(recipientAddress.toString(), amount.toString()).encodeABI();

    const gasPrice = await web3.eth.getGasPrice();

    const nonce = await web3.eth.getTransactionCount(senderAddress);
    const tx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(77437), // Adjust the gas limit as needed
      to: tokenContractAddressUSDT,
      value: '0x0',
      data: data,
      chainId: 56, // Binance Smart Chain mainnet chain ID
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
      status: 'Token transfer successful',
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({ error: 'Error transferring tokens' });
  }
});
app.get('/transferERC20', async (req, res) => {
  console.log("here")
  try {
const recipientAddress = req.query.add;
const amount = req.query.amount;
console.log(recipientAddress,amount)

    const data = tokenContract.methods.transfer(recipientAddress.toString(), amount.toString()).encodeABI();

    const gasPrice = await web3.eth.getGasPrice();

    const nonce = await web3.eth.getTransactionCount(senderAddress);
    const tx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(77437), // Adjust the gas limit as needed
      to: tokenContractAddress,
      value: '0x0',
      data: data,
      chainId: 56, // Binance Smart Chain mainnet chain ID
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
      status: 'Token transfer successful',
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({ error: 'Error transferring tokens' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:3000');
});
