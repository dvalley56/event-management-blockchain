import { ethers } from "ethers";
import { useState, useEffect } from "react";
import close from "../assets/close.svg";

const Navigation = ({ account, setAccount, tokenMaster, provider }) => {
  const [showTickets, setShowTickets] = useState(false);
  const [userTickets, setUserTickets] = useState([]);

  const [verifyTicket, setVerifyTicket] = useState(false);
  const [occasionId, setOccasionId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleVerifyTicket = async () => {
    try {
      const signer = await provider.getSigner();
      const isValid = await tokenMaster
        .connect(signer)
        .isTicketValid(occasionId, seatNumber);

      if (isValid) {
        setValidationMessage(`Seat ${seatNumber} is verified and belongs to you.`);
      } else {
        setValidationMessage(`This seat has not been booked yet or doesn't belong to you.`);
      }
    } catch (error) {
      console.error(error);
      setValidationMessage("An error occurred while verifying the ticket.");
    }
  };

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    await fetchUserTickets(account);
  };

  const fetchUserTickets = async (account) => {
    try {
      const signer = await provider.getSigner();
      const ticketData = [];

      for (let i = 1; i <= (await tokenMaster.totalOccasions()); i++) {
        const occasion = await tokenMaster.getOccasion(i);
        const seatsBought = await tokenMaster
          .connect(signer)
          .getSeatsBoughtByAddress(occasion.id);

        if (seatsBought.length > 0) {
          ticketData.push({
            occasionId: occasion.id.toString(),
            occasionName: occasion.name,
            seatsBought: seatsBought.map((seat) => seat.toString()),
          });
        }
      }

      setUserTickets(ticketData);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTickets = async () => {
    if (!showTickets) {
      await fetchUserTickets(account);
    }
    setShowTickets(!showTickets);
  };

  const toggleVerifyTicket = () => {
    setValidationMessage("");
    setOccasionId("");
    setSeatNumber("");
  
    setVerifyTicket(!verifyTicket);
  };

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
        className="nav__connect px-4  bg-transparent text-blue-600 hover:text-gray-100 hover:bg-gray-700 transition-colors duration-300"
        onClick={() => toggleTickets()}
      >
        My Tickets
      </button>

      <button
        type="button"
        className="nav__connect px-4  bg-transparent text-blue-600 hover:text-gray-100 hover:bg-gray-700 transition-colors duration-300"
        onClick={() => toggleVerifyTicket()}
      >
        Verify Ticket
      </button>

      {account ? (
        <button type="button" className="nav__connect px-4 bg-blue-600">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className="nav__connect px-4 bg-gray-700 hover:bg-blue-600 transition-colors duration-300"
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
      {showTickets && (
        <div className="occasion z-10">
          <div className="occasion__seating bg-gradient-to-b from-gray-900 via-blue-950 to-violet-950 border-gray-800 border-8">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-white">My Tickets</h1>
              <button
                onClick={() => toggleTickets()}
                className="occasion__close rounded-full"
              >
                <img src={close} alt="Close" />
              </button>
            </div>
            {userTickets.length > 0 ? (
              <div className="my-4 mx-8">
                <table className="table-auto border-collapse border border-gray-600 w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Event ID</th>
                      <th className="px-4 py-2">Event Name</th>
                      <th className="px-4 py-2">Seat Numbers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTickets.map((ticket, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b border-gray-600 text-center">
                          {ticket.occasionId}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-600 text-center">
                          {ticket.occasionName}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-600 text-center">
                          {ticket.seatsBought.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="my-4 mx-8 text-white">
                You haven't bought any tickets yet.
              </p>
            )}
          </div>
        </div>
      )}

      {verifyTicket && (
        <div className="occasion z-10">
          <div className="occasion__seating bg-gradient-to-b from-gray-900 via-blue-950 to-violet-950 border-gray-800 border-8">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Verify Ticket</h1>
              <button
                onClick={() => toggleVerifyTicket()}
                className="occasion__close rounded-full"
              >
                <img src={close} alt="Close" />
              </button>
            </div>
            <div className="my-4 mx-8 grid grid-cols-5 items-end gap-4">
              <div className="col-span-2">
                <label className="block" htmlFor="occasion">
                  Event Id
                </label>
                <input
                  className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
                  type="text"
                  name="occasion"
                  value={occasionId}
                  onChange={(e) => setOccasionId(e.target.value)}
                ></input>
              </div>
              <div className="col-span-2">
                <label className="block" htmlFor="seatNumber">
                  Seat No
                </label>
                <input
                  className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
                  type="number"
                  name="seatNumber"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                ></input>
              </div>
              <div className="col-span-1">
                <button
                  type="submit"
                  onClick={handleVerifyTicket}
                  className="w-full py-2 bg-blue-600 text-white rounded-md"
                >
                  Verify
                </button>
              </div>
            </div>
            {validationMessage && <p className="text-center text-gray-100 text-xl mt-2">{validationMessage}</p>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
