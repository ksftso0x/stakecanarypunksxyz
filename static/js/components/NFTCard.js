import React, { useState, useEffect } from "react";
import styled from "styled-components";
import stakingabi from "../assets/abi/stakingabi.json";
import abi1 from "../assets/abi/cgld_abi.json";
import config from "../config/config";

const ethers = require("ethers");

const CardContainer = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  border-radius: 20px;
  padding: 20px;
  gap: 5px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  border: 3px solid white;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 50px;
  border: 3px solid #fff;
  padding: 5px 20px;
  text-transform: uppercase;
  background-color: #ffffff;
`;

const NFTCard = ({ tokenId , staked , balance , src , tier }) => {
  // useState provider null
  const [provider, setProvider] = useState(null);
  const [provider1, setProvider1] = useState(null);
  // useState contract null
  const [contract, setContract] = useState(null);
  const [contract1, setContract1] = useState(null);
  // useState signer null
  const [signer, setSigner] = useState(null);
  const [signer1, setSigner1] = useState(null);

  // usestate currentTier 0
  const [currentTier, setCurrentTier] = useState(0);

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum) ;
    let tempSigner = tempProvider.getSigner() ;
    let tempContract = new ethers.Contract(config.SCTAddress, stakingabi, tempSigner) ;
    setProvider(tempProvider) ;
    setSigner(tempSigner) ;
    setContract(tempContract) ;

    let tempProvider1 = new ethers.providers.Web3Provider(window.ethereum) ;
    let tempSigner1 = tempProvider.getSigner() ;
    let tempContract1 = new ethers.Contract(config.TokenAdress, abi1, tempSigner) ;
    setProvider1(tempProvider1) ;
    setSigner1(tempSigner1) ;
    setContract1(tempContract1) ;
  };

  const stake = async () => {
    await contract.stake(tokenId, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload();
      });
    });
  };

  const unstake = async () => {
    await contract.unstake(tokenId, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload();
      });
    });
  };

  const harvest = async () => {
    console.log(tokenId)
    await contract.harvest(tokenId).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload();
      });
    });
  };

  const upgrade = async () => {
    // await contract1.approve(contract.address, ethers.utils.parseEther("30")).then((tx) => {
    //   tx.wait().then(() => {
    //     console.log("cgld Approved");
    //   });
    // });
    await contract
      .upgradeTokenRewardTier(tokenId, { gasLimit: 1000000 })
      .then((tx) => {
        tx.wait().then(() => {
          window.location.reload() ;
        });
      });
  };

  const upgradetomax = async () => {
    // await contract1.approve(contract.address, ethers.utils.parseEther("30")).then((tx) => {
    //   tx.wait().then(() => {
    //     console.log("cgld Approved");
    //   });
    // });
    await contract
      .upgradeTokenRewardTierToMax(tokenId, { gasLimit: 1000000 })
      .then((tx) => {
        tx.wait().then(() => {
          window.location.reload() ;
        });
      });
  };

  useEffect(() => {
    updateEthers();
  }, []);

  if (staked) {
    if (tier < 4) {
      return (
        <CardContainer>
          <Image src={`./images${src}`} />
          <h1 style={{color:'gold'}}>#{tokenId}</h1>
          <p style={{color:'gold'}}>
            {balance} {config.symbol}
          </p>
          <p style={{color:'gold'}}>LVL : {tier}</p>
          <Button style={{background:'#00adef'}} onClick={unstake}>Unstake</Button>
          <Button style={{background:'#00adef'}} onClick={harvest}>
            Claim {balance} {config.symbol}
          </Button>
          <Button style={{background:'#00adef'}} onClick={upgrade}>Upgrade</Button>
          <Button style={{background:'#00adef'}} onClick={upgradetomax}>UpgradeToMax</Button>
        </CardContainer>
      );
    } else {
      return (
        <CardContainer>
            <Image src={`./images${src}`} />
            <h1 style={{color:'gold'}}>#{tokenId}</h1>
            <p style={{color:'gold'}}>
              {balance} {config.symbol}
            </p>
            <p style={{color:'gold'}}>LVL : {tier}</p>
            <Button style={{background:'#00adef'}} onClick={unstake}>Unstake</Button>
            <Button style={{background:'#00adef'}} onClick={harvest}>
              Claim {balance} {config.symbol}
            </Button>
          </CardContainer>
      );
    }
  } else {
    return (
      <CardContainer>
        <Image src={`./images${src}`} />
        <h1 style={{color:'gold'}}>#{tokenId}</h1>
        <Button style={{background:'#00adef'}} onClick={stake}>stake</Button>
      </CardContainer>
    );
  }
};

export default NFTCard;
