import React from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

export default function Footer() {
  return (
    <>
      <div className="mx-32">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <img src="/src/assets/logo.png" className="h-[80px]" alt="" />
            <form className="ml-5">
              <label
                htmlFor="input-group-1"
                className="block mb-1 mt-3 text-sm font-medium text-gray-900 dark:text-white">
                Nhận thông tin khuyến mãi
              </label>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="input-group-1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="youremail@gmail.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-3/6 border bg-[#00b7c0] py-2 pl-2 flex items-center justify-center rounded-lg font-medium text-white hover:text-black">
                Đăng ký
                <ArrowForwardOutlinedIcon
                  sx={{ fontSize: "20px", marginLeft: "5px" }}
                />
              </button>
            </form>
          </div>
          <div className="p-5">
            <h2 className="text-xl text-[#00b7c0] font-semibold mb-3">
              Sản phẩm của chúng tôi
            </h2>
            <ul className="">
              <li className="py-3 font-base">Sản phẩm bán chạy</li>
              <li className="py-3 font-base">Sản phẩm cho mèo</li>
              <li className="py-3 font-base">Sản phẩm cho cún</li>
              <li className="py-3 font-base">Tin tức</li>
            </ul>
          </div>
          <div className="p-5">
            <h2 className="text-xl text-[#00b7c0] font-semibold mb-3">
              Dịch vụ của chúng tôi
            </h2>
            <ul>
              <li className="py-3 font-base">Shop thú cưng</li>
              <li className="py-3 font-base">Chăm sóc thú cưng</li>
              <li className="py-3 font-base">Đặt lịch thăm khám</li>
              <li className="py-3 font-base">Dịch vụ khác</li>
            </ul>
          </div>
          <div className="p-5">
            <h2 className="text-xl text-[#00b7c0] font-semibold mb-3">
              Liên hệ với chúng tôi
            </h2>
            <ul>
              <li className="py-2 font-base text-sm">
                <FmdGoodOutlinedIcon /> Thành phố Cần Thơ
              </li>
              <li className="py-2 font-base text-sm">
                <LocalPhoneOutlinedIcon /> 0123456789 - 0987654321
              </li>
              <li className="py-2 font-base text-sm">
                <MarkEmailReadOutlinedIcon /> Duyenttmpc08066@fpt.edu.vn
              </li>
              <li className="py-2 font-base flex gap-2">
                <a href="">
                  <img src="/src/assets/fb.png" alt="" />
                </a>
                <a href="">
                  <img src="/src/assets/youtube.png" alt="" />
                </a>
                <a href="">
                  <img src="/src/assets/insta.png" alt="" />
                </a>
                <a href="">
                  <img src="/src/assets/tiktok.png" alt="" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center p-3 text-base font-medium border-t-[1px] border-[#00b7c0]">
          Designed by Duyen
        </div>
      </div>
    </>
  );
}
