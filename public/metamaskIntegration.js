// MetaMask Integration - Full Script for DYM (udym) token transactions

// Function to connect to MetaMask and get accounts
async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access from MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("MetaMask Connected.");
      console.log("Account Address:", accounts[0]);
      alert("MetaMask connected: " + accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Error connecting to MetaMask.");
    }
  } else {
    console.log("MetaMask is not installed.");
    alert("MetaMask is not installed.");
  }
}

// Function to send a token transfer transaction using MetaMask
async function sendTransaction() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access if not already connected
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      // Define the transaction parameters
      // This transaction sends 500 udym (500 in decimal = 0x1f4 in hexadecimal)
      const transactionParameters = {
        to: "0xReceiverAddress", // REPLACE with the actual receiver address
        from: account,
        value: "0x1f4", // 500 udym in hexadecimal (replace as needed)
        gas: "0x5208"  // 21000 gas limit in hexadecimal
      };

      // Send the transaction via MetaMask
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Transaction sent! Hash:", txHash);
      alert("Transaction sent! Hash: " + txHash);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed.");
    }
  } else {
    alert("MetaMask is not installed!");
  }
}

// Add event listeners to the buttons
document.getElementById("connectMetaMaskButton").addEventListener("click", connectMetaMask);
document.getElementById("sendTransactionButton").addEventListener("click", sendTransaction);
