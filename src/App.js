import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Sort from "./components/Sort";
import Card from "./components/Card";
import SeatChart from "./components/SeatChart";
import OccasionDetail from "./components/OccasionDetail";

// ABIs
import TokenMaster from "./abis/TokenMaster.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);

  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  // on clicking card show detail  view of the event
  const [showDetail, setShowDetail] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const tokenMaster = new ethers.Contract(
      config[network.chainId].TokenMaster.address,
      TokenMaster,
      provider
    );
    setTokenMaster(tokenMaster);

    const totalOccasions = await tokenMaster.totalOccasions();
    const occasions = [];

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await tokenMaster.getOccasion(i);
      occasions.push(occasion);
    }
    console.log(occasions);
    setOccasions(occasions);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  const updateOccasions = (newOccasion) => {
    const index = occasions.findIndex(
      (occasion) => occasion.id.toString() === newOccasion.id.toString()
    );

    if (index !== -1) {
      occasions[index] = newOccasion;
      setOccasions([...occasions]);
    } else {
      setOccasions([...occasions, newOccasion]);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="bg-gray-950 text-white">
      <header className="bg-gradient-to-r from-blue-950 via-gray-950 to-gray-950">
        <Navigation account={account} setAccount={setAccount} tokenMaster={tokenMaster} provider={provider}/>

        <h2 className="header__title">
          <strong>Event</strong> Tickets
        </h2>
      </header>

      <Sort
        provider={provider}
        tokenMaster={tokenMaster}
        updateOccasions={updateOccasions}
      />

      <div className="cards">
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            tokenMaster={tokenMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
          updateOccasions={updateOccasions}
        />
      )}
      {showDetail && (
        <OccasionDetail
          occasion={occasion}
          setShowDetail={setShowDetail}
          tokenMaster={tokenMaster}
          provider={provider}
        />
      )}
    </div>
  );
}

export default App;
