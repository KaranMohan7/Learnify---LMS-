import React, { useContext } from "react";
import { assets } from "../../assets/assets/assets";
import { appcontext } from "../../context/Appcontext";
import { Link } from "react-router-dom";

const Coursecard = ({ item }) => {
  const { currency, calculaterating } = useContext(appcontext);

  return (
    <Link to={`/course-details/${item._id}`}>
      <div className=" border-[1px] border-zinc-200 w-80 h-70 rounded-md overflow-hidden">
        <img src={item.courseThumbnail} alt="" />
        <div className="flex flex-col justify-start px-3 py-1">
          <p className="font-semibold">{item.courseTitle}</p>
          <p>{item.educator.name}</p>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{calculaterating(item)}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculaterating(item))
                      ? assets.star
                      : assets.star_blank
                  }
                />
              ))}
            </div>
            <p className="text-zinc-500 ">({item.courseRatings.length})</p>
          </div>
          <p className="font-semibold">
            {currency}{" "}
            {(
              item.coursePrice -
              (item.discount * item.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Coursecard;
