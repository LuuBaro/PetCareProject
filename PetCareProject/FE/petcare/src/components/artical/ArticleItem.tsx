import React from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

export default function ArticleItem({
  image,
  title,
  content,
  author,
  authorImage,
}) {
  return (
    <>
      <div className="w-full flex justify-between flex-col p-5 rounded-md border bg-white shadow">
        <img src={image} alt="" className="rounded-md" />
        <div className="flex items-start flex-col">
          <h1 className="font-bold text-lg pt-3 pb-2 w-full tracking-wide text-ellipsis whitespace-nowrap overflow-hidden">
            {title}
          </h1>
          <p className="text-sm line-clamp-2 text-[#787878]">{content}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="flex items-center justify-center bg-[#00b7c0] text-white px-4 py-2 pl-5 text-sm rounded-3xl font-medium">
            Đọc thêm <ArrowForwardOutlinedIcon sx={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>
    </>
  );
}
