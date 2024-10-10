import React from "react";
import PolicyItem from "./PolicyItem";

export default function Policy() {
  const policies = [
    {
      imgSrc: "/src/assets/tc1.png",
      title: "Giao hàng miễn phí",
      description: "Với đơn hàng trên 500.000đ"
    },
    {
      imgSrc: "/src/assets/tc2.png",
      title: "Thanh toán dễ dàng",
      description: "Hỗ trợ thanh toán online"
    },
    {
      imgSrc: "/src/assets/tc3.png",
      title: "Đổi trả miễn phí",
      description: "Trong vòng 7 ngày"
    },
    {
      imgSrc: "/src/assets/tc4.png",
      title: "Bảo hành 12 tháng",
      description: "Bảo hành tận nơi"
    }
  ];

  return (
    <div className="bg-[#00b7c0] my-5">
      <div className="grid grid-cols-4 gap-10 mx-32">
        {policies.map((policy, index) => (
          <PolicyItem
            key={index}
            imgSrc={policy.imgSrc}
            title={policy.title}
            description={policy.description}
          />
        ))}
      </div>
    </div>
  );
}
