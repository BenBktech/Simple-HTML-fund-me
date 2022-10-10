import { ethers } from "./ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById('connectButton')
const balanceButton = document.getElementById('balanceButton')
const fundButton = document.getElementById('fundButton')
const ethAmount = document.getElementById('ethAmount')
const withdrawButton = document.getElementById('withdraw')

connectButton.onclick = connect 
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if(typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!";
    }
    else {
        connectButton.innerHTML = "Please install Metamask!";
    }
}

// fund function
async function fund() {
    console.log('funding');
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const ethAmountInput = ethAmount.value;
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmountInput)}) 
            // Wait for this transaction to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        }
        catch(e) {
            console.log(e);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    return new Promise((resolve, reject) => {
        //Resolve once the transactionResponse.hash is received
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}

async function getBalance() {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// withdraw
async function withdraw() {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw() 
            // Wait for this transaction to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        }
        catch(e) {
            console.log(e);
        }
    }
}