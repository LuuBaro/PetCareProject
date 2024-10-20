import React from "react";
import CountdownTimer from "./CountdownTimer";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
export default function FlashSale() {
  const initialTime = 86400 * 2;

  return (
    <>
      <div className="flex items-center justify-between gap-6 mx-32 p-5 m-2 rounded-md border bg-white shadow">
        <div className="flex items-center justify-between w-[32%]">
          <img src="/src/assets/flashsale.svg" alt="" />
          <div className="flex items-center justify-beetween">
            <span className="pr-3 font-bold">Kết thúc trong: </span>
            <CountdownTimer initialTime={initialTime} />
          </div>
        </div>
        <div>
          <a
            href=""
            className="font-semibold text-[#00b7c0] underline hover:text-black transition ease-out duration-200">
            Xem tất cả <ArrowForwardOutlinedIcon />
          </a>
        </div>
      </div>
    </>
  );
}
