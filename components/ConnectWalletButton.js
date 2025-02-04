import React, { useState } from 'react';

const ConnectWalletButton = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // MetaMask'tan hesapları iste
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User rejected connection", error);
        alert("Connection rejected");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <div style={styles.container}>
      {account ? (
        <span style={styles.accountText}>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      ) : (
        <button style={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#F6851B', // MetaMask turuncusu
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  accountText: {
    color: 'black',
    fontSize: '16px',
  },
};

export default ConnectWalletButton;
