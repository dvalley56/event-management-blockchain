import { ethers } from "ethers";
import { useState, useEffect } from "react";

const Card = ({ occasion, toggle, setToggle, setOccasion, showDetail, setShowDetail }) => {

  const toggleView = () => {
    setOccasion(occasion);
    showDetail ? setShowDetail(false) : setShowDetail(true);
  }

  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div className="card py-2 text-gray-300">
      <div className="grid grid-cols-12 items-center gap-4 text-left transition-all duration-300 ease-linear">
        <div className="col-span-2 leading-3">
          <p className="text-lg font-semibold">{occasion.date}</p>
          <br />
          <p>{occasion.time}</p>
        </div>

        <div className="col-span-4">
          <h3 className="text-xl font-bold cursor-pointer underline hover:text-white" onClick={() => toggleView()}>{occasion.name}</h3>
          <p className="">{occasion.location}</p>
        </div>

        <div className="col-span-2 leading-3">
          <p className="card__tickets">
            <strong>{occasion.tickets.toString()}</strong>
          </p>
          <br />
          <p>
            Tickets Available
          </p>
        </div>

        <div className="col-span-2">
          <p className="card__cost">
            <strong>
              {ethers.utils.formatUnits(occasion.cost.toString(), "ether")}
            </strong>
            ETH
          </p>
        </div>

        <div className="col-span-2">
        {occasion.tickets.toString() === "0" ? (
          <button type="button" className="card__button bg-gray-700" disabled>
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className="card__button bg-blue-600 hover:bg-blue-800 transition-colors duration-300"
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Card;
