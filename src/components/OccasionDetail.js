import { useEffect, useState } from "react";
import close from "../assets/close.svg";
import { ethers } from "ethers";

const OccasionDetail = ({ occasion, setShowDetail, tokenMaster, provider }) => {
  const [seatsBought, setSeatsBought] = useState([]);

  const getSeatsBought = async () => {
    try {
      const signer = await provider.getSigner();
      const seatsTaken = await tokenMaster.connect(signer).getSeatsTaken(occasion.id);

      const seatsBought = await Promise.all(
        seatsTaken.map(async (seatNumber) => {
          const userAddress = await tokenMaster.connect(signer).seatTaken(occasion.id, seatNumber);
          return { seatNumber, userAddress };
        })
      );

      setSeatsBought(seatsBought);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSeatsBought();
  }, [occasion.id, provider, tokenMaster]);

  return (
    <div className="occasion">
      <div className="occasion__seating bg-gradient-to-b from-gray-900 via-blue-950 to-violet-950 border-gray-800 border-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{occasion.name} - Detail</h1>
          <button onClick={() => setShowDetail(false)} className="occasion__close rounded-full">
            <img src={close} alt="Close" />
          </button>
        </div>
        <div className="my-4 leading-loose text-gray-300">
          <p>
            <strong>Name:</strong> {occasion.name}
          </p>
          <p>
            <strong>Owner:</strong> {occasion.owner}
          </p>
          <p>
            <strong>Total Tickets:</strong> {occasion.maxTickets.toString()}
          </p>
          <p>
            <strong>Tickets Available:</strong>{" "}
            {occasion.maxTickets.toString() - occasion.tickets.toString()}
          </p>
          <p>
            <strong>Price Per Ticket:</strong>{" "}
            {ethers.utils.formatUnits(occasion.cost.toString(), "ether")} ETH
          </p>
          <p>
            <strong>Date:</strong> {occasion.date}
          </p>
          <p>
            <strong>Time:</strong> {occasion.time}
          </p>
        </div>
        <div className="my-4 text-gray-300">
          <h2 className="text-xl font-bold mb-2 text-gray-200">Seats Bought</h2>
          <table className="table-auto border-collapse border border-gray-600 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Seat Number</th>
                <th className="border border-gray-400 px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {seatsBought.map(({ seatNumber, userAddress }, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 text-center px-4 py-2">{seatNumber.toString()}</td>
                  <td className="border border-gray-400 text-center px-4 py-2">{userAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OccasionDetail;