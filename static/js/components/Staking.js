import React, { useState, useEffect } from "react";
import styled from "styled-components";
import banner from "../assets/images/1banner.png";
import config from "../config/config";
import cgld_abi from "../assets/abi/cgld_abi.json";
import abi from "../assets/abi/cpnk.json";
import abi2 from "../assets/abi/stakingabi.json";
import NFTCard from "./NFTCard";
import Modal from 'react-modal';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 20,
    }}
    spin
  />
);
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    fontSize: '30px',
    right: 'auto',
    bottom: 'auto',
    overflow: 'none',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent ',
    display: 'flex'
  },
};

const ethers = require("ethers");

const StakingContainer = styled.div`
  display: flex;
  z-index: 1 ;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
  color:red ;
 
`;

const Title = styled.h1`
  text-align: center;
`;

const Image = styled.div`
  background-image: url(${banner});
  background-size: contain;
  background-repeat: no-repeat;
  width: 500px;
  height: 400px;
`;

const StakingWrapper = styled.div`
  margin: 20px;
  gap: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const InfoPanel = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  min-height: 600px;
  border-radius: 20px;
  border: "5px solid white" ;
  padding: 20px;
`;

const Button = styled.button`
padding: 10px;
border-radius: 50px;
border: none;
background-color: #ffffff;
padding: 10px;
font-weight: bold;
color: red;
width: 150px;
cursor: pointer;
box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
-webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
-moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
  box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ffffff, 0 0 40px #ffffff, 0 0 50px #ffffff, 0 0 60px #ffffff, 0 0 70px #ffffff;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
}
`;

const Splitter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TokenContainer = styled.div`
  width: 87%;
  margin: 0px 50px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  border: 5px solid black;
  padding: 20px;
  border-radius: 20px;
`;

const TokenGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  gap: 20px;
  color: red;
`;

const Staking = () => {


  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  // usestate isConnected false
  const [isConnected, setIsConnected] = useState(false);
  // usestate isStartStaking false
  const [isStartStaking, setIsStartStaking] = useState(false);
  // usestate defaultAccount null
  const [defaultAccount, setDefaultAccount] = useState(null);
  // usestate totalStaked 0
  const [totalStaked, setTotalStaked] = useState(0);
  // usestate isUserStaked false
  const [isUserStaked, setIsUserStaked] = useState(false);
  // usestate loading false
  const [loading, setLoading] = useState(false);
  // startedStaking false
  const [startedStaking, setStartedStaking] = useState(false);
  // usestate totalRewards 0
  const [totalRewards, setTotalRewards] = useState(0);
  // usestate sctBalance 0
  const [sctBalance, setSctBalance] = useState(0);

  // usestate has stakedNFTs false
  const [hasStakedNFTs, setHasStakedNFTs] = useState(false);
  // usestate has unstakedNFTs false
  const [hasUnstakedNFTs, setHasUnstakedNFTs] = useState(false);

  // usestate stakedNFTs []
  const [stakedNFTs, setStakedNFTs] = useState([]);
  // usestate unstakedNFTs []
  const [unstakedNFTs, setUnstakedNFTs] = useState([]);

  // usestate provider null
  const [provider, setProvider] = useState(null);
  // usestate contract null
  const [contract, setContract] = useState(null);
  // usestate signer null
  const [signer, setSigner] = useState(null);

  // usestate provider null
  const [provider2, setProvider2] = useState(null);
  const [provider3, setProvider3] = useState(null);
  // usestate contract null
  const [contract2, setContract2] = useState(null);
  const [contract3, setContract3] = useState(null);
  // usestate signer null
  const [signer2, setSigner2] = useState(null);
  const [signer3, setSigner3] = useState(null);

  let cntTime = 0;
  const [loadingFlg, setLoadingFlg] = useState(false);
  const selectedAccount = window.ethereum.selectedAddress;

  const connect = async () => {
    // console.log('dd');
    if (window.ethereum !== undefined) {
      let chain = config.chainId.toString();
      if (window.ethereum.networkVersion === chain) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((account) => {
            setIsConnected(true);
            accountChangedHandler(account[0]);
          });
      }
    } else {
      setIsConnected(false);
    }
  };

  const accountChangedHandler = (account) => {
    setDefaultAccount(account);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);
    let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
    setProvider2(tempProvider2);
    let tempProvider3 = new ethers.providers.Web3Provider(window.ethereum);
    setProvider3(tempProvider3);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);
    let tempSigner2 = tempProvider2.getSigner();
    setSigner2(tempSigner2);
    let tempSigner3 = tempProvider3.getSigner();
    setSigner3(tempSigner3);

    let tempContract = new ethers.Contract(config.NFTAddress, abi, tempSigner);
    setContract(tempContract);

    let tempContract2 = new ethers.Contract(
      config.SCTAddress,
      abi2,
      tempSigner2
    );
    setContract2(tempContract2);

    let tempContract3 = new ethers.Contract(
      config.TokenAdress,
      cgld_abi,
      tempSigner3
    );
    setContract3(tempContract3);
  };

  const startStaking = async () => {
    let stakedTokens = [];
    let unstakedTokens = [];
    let sortedStakedNFTs = [];
    setLoading(true);

    await contract2.stakedNFTSByUser(defaultAccount).then((staked) => {
      for (let i = 0; i < staked.length; i++) {
        if (Number(staked[i].toString()) !== 0) {
          let claimable = 0;
          contract2.pendingRewards(staked[i].toString()).then((reward) => {
            let unrounded = ethers.utils.formatEther(reward.toString());
            claimable = parseFloat(unrounded).toFixed(2);
            contract2.currentTier(staked[i].toString()).then((tier) => {
              stakedTokens.push({
                tokenId: Number(staked[i].toString()),
                staked: true,
                balance: Number(claimable),
                src: config.baseURI + "/" + staked[i].toString() + ".png",
                tier: Number(tier.toString()),
              });
            });
          });
        }
      }
    });

    await contract3.balanceOf(defaultAccount).then((balance) => {
      let unrounded = ethers.utils.formatEther(balance.toString());
      let balance2 = parseFloat(unrounded).toFixed(2);
      setSctBalance(balance2);
      // console.log(balance2,'balance2');
    });
    // setSctBalance('20');
    let total = 0;
    await contract2.totalPendingRewards().then((result) => {
      total = result.toString();
    });
    setTotalRewards(parseFloat(ethers.utils.formatEther(total)).toFixed(2));

    await contract.walletOfOwner(defaultAccount).then((wallet) => {
      for (let i = 0; i < wallet.length; i++) {
        unstakedTokens.push({
          tokenId: Number(wallet[i].toString()),
          staked: false,
          balance: 0,
          src: config.baseURI + "/" + wallet[i].toString() + ".png",
        });
      }
    });

    sortedStakedNFTs = sortStakedNFTs(stakedTokens);
    setStakedNFTs(sortedStakedNFTs);
    setUnstakedNFTs(unstakedTokens);
    setLoading(false);
    setIsStartStaking(true);
    setStartedStaking(true);
  };

  const sortStakedNFTs = (tokens) => {
    var temp = [];
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].tier == 0) {
        temp.push(tokens[i]);
      }
    }
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].tier == 1) {
        temp.push(tokens[i]);
      }
    }
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].tier == 2) {
        temp.push(tokens[i]);
      }
    }
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].tier == 3) {
        temp.push(tokens[i]);
      }
    }
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].tier == 4) {
        temp.push(tokens[i]);
      }
    }
    return temp;
  }

  const harvest = async () => {
    contract2.harvestBatch(defaultAccount).then((tx) => {
      tx.wait().then(() => {
        setIsOpen(true);
        setTimeout(() => timeOutRefresh(), 30000);
      });
    });
  };

  const timeOutRefresh = () => {

    setIsOpen(false);
    window.location.reload();

  }

  const stakeAll = async () => {
    console.log(contract2)
    contract2.stakeBatch({ gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        setIsOpen(true);
        setTimeout(() => timeOutRefresh(), 30000);

      });
    });
  };

  const unstakeAll = async () => {
    contract2.unstakeBatch({ gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        setIsOpen(true);
        setTimeout(() => timeOutRefresh(), 30000);
      });
    });
  };

  const approve = async () => {
    let approve_nft = localStorage.getItem('approve_nft');
    let approve_token = localStorage.getItem('approve_token');
    await contract.setApprovalForAll(contract2.address, true).then((tx) => {
      tx.wait().then(() => {
        console.log("punk Approved");
        localStorage.setItem('approve_nft', true);
      });
    });
    await contract3.approve(contract2.address, ethers.utils.parseEther("10000")).then((tx) => {
      tx.wait().then(() => {
        console.log("cgld Approved");
        localStorage.setItem('approve_token', true);
      });
    });
  };

  return (
    <>
      <video autoPlay muted loop id="myVideo" style={{ position: 'fixed', right: '0', top: '0', zIndex: '0', minHeight: '100%' }}>
        <source src="1.mp4" type="video/mp4"></source>

      </video>

      <StakingContainer >

        <h1 style={{ fontSize: '28px' }} ><center style={{ fontWeight: 'bolder', color: 'gold' }}>Stake your Canary Punks and earn our projects main utility SGB token, Canary Gold ($CGLD)</center></h1><br />

        <h6><center style={{ color: 'white' }}>
          By default, every Punk starts on level 0, levels can be upgraded by spending $CGLD</center></h6><br />
        <h6><center style={{ color: 'white' }}>
          Punks earn different rewards based on their staking level
        </center></h6><br />
        <h6><center style={{ color: 'white' }}>
          The higher your staking level, the higher your staking rewards
        </center></h6><br />
        <h6><center style={{ color: 'white' }}>
          Staking Levels are reset when unstaked
        </center></h6><br />
        <h1 style={{ fontSize: '28px' }}><center style={{ fontWeight: 'bolder', color: 'gold' }}>
          Staking Levels, Upgrade Costs & Reward Rates
        </center></h1><br />
        <p style={{ color: 'white' }}>- Level 0 - Earns 0.5 $CGLD per day</p>
        <p style={{ color: 'white' }}>- Level 0 to level 1 costs 10 $CGLD = Level 1 - Earns 1 $CGLD per day<br />
          - Level 1 to level 2 costs 15 $CGLD = Level 2 - Earns 1.5 $CGLD per day<br />
          - Level 2 to level 3 costs 20 $CGLD = Level 3 - Earns 2 $CGLD per day<br />
          - Level 3 to level 4 costs 25 $CGLD = Level 4 - Earns 2.5 $CGLD per day<br /></p>
        {/* <h3> ***NFT Rarity (stars) remain unchanged from this upgrade***</h3> */}
        <StakingWrapper>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              height: "400px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={banner}
              alt="banner"
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              // height: "316px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "20px",
              border: "5px solid white",
              padding: "20px",
            }}
          >
            {!isConnected ? (
              <>
                <h1 style={{ color: 'gold' }}>Connect Your Wallet</h1> <br />
                <Button style={{ background: '#00adef' }} onClick={connect}><h1 >Connect</h1></Button>
              </>
            ) : (
              <>
                {loading ? (
                  <h1 style={{ color: 'gold' }}> Gathering info - loading </h1>
                ) : (
                  <>
                    {startedStaking ? (
                      <>
                        <Splitter>
                          <h1 style={{ color: 'gold' }}>{stakedNFTs.length / 5001}%  Staked</h1><br />
                          <br />
                          <h1 style={{ color: 'gold' }}>{stakedNFTs.length} / 5001</h1>
                        </Splitter>
                        <Splitter>
                          <h1 style={{ color: 'gold' }}>My CGLD  Balance :</h1>
                          <h1 style={{ color: 'gold' }}>{sctBalance}</h1>
                        </Splitter>
                        <br />
                        <p>
                          Connected to :{" "}
                          {defaultAccount.slice(0, 6) +
                            "..." +
                            defaultAccount.slice(-4)}
                        </p> <br />
                        <h1
                          style={{
                            textAlign: "center",
                            color: 'gold'
                          }}
                        >
                          You have staked {stakedNFTs.length} Canary Punks and {" "}
                          <br />
                          {unstakedNFTs.length} Canary Punks available to stake.
                        </h1>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "20px",

                        }}
                      >
                        <p
                          style={{
                            textAlign: "center",
                          }}
                        >
                          You need to approve first in order to stake your
                          Canary Punks.
                        </p>
                        <Button style={{ background: '#00adef' }} onClick={approve}>
                          <h1>Approve</h1>
                        </Button>
                        <Button style={{ width: '200px', background: '#00adef' }} onClick={startStaking}>
                          <h1>Start Staking</h1>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </StakingWrapper>
        {isStartStaking ? (
          <StakingWrapper>
            {stakedNFTs.length === 0 ? (
              ""
            ) : (
              <InfoPanel>
                <h1 style={{ fontSize: '28px' }} ><center style={{ fontWeight: 'bolder', color: 'gold' }}>Staked NFTs</center></h1>
                <Splitter>
                  <Button onClick={harvest} style={{ background: '#00adef', color: 'black' }}>Harvest All</Button>
                  <h5 style={{ color: 'gold' }}>Total : {totalRewards} </h5>
                  <Button style={{ background: '#00adef', color: 'black' }} onClick={unstakeAll}>Unstake All</Button>
                </Splitter>
                <TokenGrid>
                  {stakedNFTs.map((token) => {
                    return (
                      <NFTCard
                        tokenId={token.tokenId}
                        staked={token.staked}
                        balance={token.balance}
                        src={token.src}
                        tier={token.tier}
                        key={token.tokenId}
                      />
                    );
                  })}
                </TokenGrid>
              </InfoPanel>
            )}
            {unstakedNFTs.length === 0 ? (
              ""
            ) : (
              <InfoPanel>
                <h1 style={{ fontSize: '28px' }} ><center style={{ fontWeight: 'bolder', color: 'gold' }}>Unstaked NFTs</center></h1>
                <Splitter
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Button style={{ background: '#00adef', color: 'black' }} onClick={stakeAll}>Stake All</Button>
                </Splitter>
                <TokenGrid>
                  {/* {console.log(unstakedNFTs,'unstakedNFTs')} */}
                  {unstakedNFTs.map((token) => {
                    return (
                      <NFTCard
                        tokenId={token.tokenId}
                        staked={token.staked}
                        balance={token.balance}
                        src={token.src}
                        key={token.tokenId}
                      />
                    );
                  })}
                </TokenGrid>
              </InfoPanel>
            )}
          </StakingWrapper>
        ) : (
          ""
        )}
      </StakingContainer>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
      // contentLabel="Exampleddddddddddddddddddddddddddddddddddd Modal"
      >

        <Spin className="stakeLoading" indicator={antIcon} /> <div>Loading.. please wait..It takes within one min.</div>
      </Modal>
    </>
  );
};

export default Staking;
