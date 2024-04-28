import { ethers } from "ethers";
import { useState, useEffect  } from "react";
import close from "../assets/close.svg";

const Navigation = ({ account, setAccount, tokenMaster, provider  }) => {
  const [showTickets, setShowTickets] = useState(false);
  const [userTickets, setUserTickets] = useState([]);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    await fetchUserTickets(account);
  };

  const fetchUserTickets = async () => {
    try {
      console.log("Fetching user tickets");
      const signer = await provider.getSigner();
      const ticketData = [];

      for (let i = 1; i <= await tokenMaster.totalOccasions(); i++) {
        const occasion = await tokenMaster.getOccasion(i);
        const seatsBought = await tokenMaster
          .connect(signer)
          .getSeatsTaken(occasion.id, account);

        if (seatsBought.length > 0) {
          ticketData.push({
            occasionId: occasion.id.toString(),
            occasionName: occasion.name,
            seatsBought: seatsBought.map((seat) => seat.toString()),
          });
        }
      }
      console.log(ticketData);
      setUserTickets(ticketData);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTickets = () => {
    setShowTickets(!showTickets);
  };

  useEffect(() => {
    if (account) {
      fetchUserTickets();
    }
  }, [account, provider, tokenMaster]);

  return (
    <nav className="bg-gray-900 flex flex-row gap-4">
      <div className="nav__brand">
        <h1 className="text-white">tokenmaster</h1>

        {/* <input className='nav__search' type="text" placeholder='Find millions of experiences' /> */}

        {/* <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul> */}
      </div>

      <span className="flex-auto"></span>

      <button
        type="button"
        className="nav__connect bg-gray-700 hover:bg-blue-600 transition-colors duration-300"
        onClick={() => toggleTickets()}
      >
        My Tickets
      </button>

      {account ? (
        <button type="button" className="nav__connect bg-blue-600">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className="nav__connect bg-gray-700 hover:bg-blue-600 transition-colors duration-300"
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
     {showTickets && (
        <div className="occasion z-10">
          <div className="occasion__seating bg-gradient-to-b from-gray-900 via-blue-950 to-violet-950 border-gray-800 border-8">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-white">My tickets</h1>
              <button onClick={() => toggleTickets()} className="occasion__close rounded-full">
                <img src={close} alt="Close" />
              </button>
            </div>
            {userTickets.map((ticket, index) => (
              <div key={index} className="my-4 mx-8 text-white">
                <h2 className="text-lg font-semibold">{ticket.occasionName}</h2>
                <p>Occasion ID: {ticket.occasionId}</p>
                <p>Seats: {ticket.seatsBought.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
