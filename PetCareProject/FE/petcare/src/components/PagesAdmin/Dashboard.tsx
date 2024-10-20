import React from "react";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarMenu";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import TopProducts from "../TopProducts";


const Dashboard = () => {
    const visitorData = {
      // your data here...
    };
  
    const targetRealityData = {
      // your data here...
    };
  
    const topProducts = [
      { id: 1, name: 'Home Decor Range', popularity: 75, color: '#1E88E5' },
      // more products...
    ];
  
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <SidebarMenu />
          <div className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-2 gap-6">
              <LineChart data={visitorData} />
              <BarChart data={targetRealityData} />
            </div>
            <TopProducts products={topProducts} />
          </div>
        </div>
      </div>
    );
  };
export default Dashboard  