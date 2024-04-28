// Assets
import React, { useState } from "react";
import { ethers } from "ethers";

const Sort = ({ tokenMaster, provider, updateOccasions }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);

    try {
      const constInEth = ethers.utils.parseUnits(cost.toString(), "ether");
      const signer = await provider.getSigner();
      const transaction = await tokenMaster
        .connect(signer)
        .list(name, constInEth, maxTickets, date, time, location);
      await transaction.wait();

      const total = await tokenMaster.totalOccasions();
      const newOccasion = await tokenMaster.getOccasion(total);
      updateOccasions(newOccasion);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-12 max-w-[850px] gap-4 mx-auto items-end my-8 p-8 border border-gray-500 rounded"
    >
      <div className="col-span-3">
        <label className="block" htmlFor="name">
          Event Name
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div className="col-span-3">
        <label className="block" htmlFor="tickets">
          Total tickets
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="number"
          name="tickets"
          value={maxTickets}
          onChange={(e) => setMaxTickets(e.target.value)}
        ></input>
      </div>
      <div className="col-span-3">
        <label className="block" htmlFor="cost">
          Cost per ticket(wei)
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="number"
          name="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        ></input>
      </div>
      <div className="col-span-3">
        <label className="block" htmlFor="date">
          Date
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
      </div>
      <div className="col-span-3">
        <label className="block" htmlFor="time">
          Time
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        ></input>
      </div>

      <div className="col-span-6">
        <label className="block" htmlFor="location">
          Location
        </label>
        <input
          className="h-10 px-4 py-2 w-full border rounded text-gray-950 bg-gray-200"
          type="text"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        ></input>
      </div>
      <button
        type="submit"
        className="rounded col-span-3 h-10 bg-blue-600 hover:bg-blue-800 transition-colors duration-300 text-white"
      >
        Add New Event
      </button>
    </form>
  );
};

export default Sort;
