import { useEffect, useState } from "react";

// Import Components
import Seat from "./Seat";

// Import Assets
import close from "../assets/close.svg";

const SeatChart = ({
  occasion,
  tokenMaster,
  provider,
  setToggle,
  updateOccasions,
}) => {
  const [seatsTaken, setSeatsTaken] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id);
    setSeatsTaken(seatsTaken);
  };

  const buyHandler = async (_seat) => {
    setHasSold(false);

    const signer = await provider.getSigner();
    const transaction = await tokenMaster
      .connect(signer)
      .mint(occasion.id, _seat, { value: occasion.cost });
    await transaction.wait();

    setHasSold(true);

    const newTickets = await tokenMaster.getOccasion(occasion.id);
    console.log(newTickets.tickets.toString());
    updateOccasions(newTickets);
  };

  useEffect(() => {
    getSeatsTaken();
  }, [hasSold]);

  return (
    <div className="occasion">
      <div className="occasion__seating grid gap-[5px] grid-cols-12 text-gray-300  bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-blue-950 via-gray-950 to-blue-950 backdrop-blur-3xl border-gray-800 border-8">
        <h1 className="text-2xl font-bold text-white">{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close rounded-full">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__stage bg-gray-900 border-4 border-gray-800">
          <strong>STAGE</strong>
        </div>

        {seatsTaken &&
          Array(25)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={1}
                columnStart={0}
                maxColumns={5}
                rowStart={2}
                maxRows={5}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}

        <div className="occasion__spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken &&
          Array(Number(occasion.maxTickets) - 50)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={26}
                columnStart={6}
                maxColumns={15}
                rowStart={2}
                maxRows={15}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken &&
          Array(25)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={Number(occasion.maxTickets) - 24}
                columnStart={22}
                maxColumns={5}
                rowStart={2}
                maxRows={5}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}
      </div>
    </div>
  );
};

export default SeatChart;
