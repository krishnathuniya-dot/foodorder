import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

export default function Admin() {
  const [stats, setStats] = useState({
    totalOrder: 0,
    newOrder: 0,
    confirmedOrder: 0,
    preparingOrder: 0,
    outForDelivery: 0,
    delivered: 0,
    users: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await Promise.all([
        fetch("http://localhost:2340/api/order/orderss/count").then(r => r.json()),
        fetch("http://localhost:2340/api/orderss/pendinglist/count").then(r => r.json()),
        fetch("http://localhost:2340/api/orderss/accepted-list/count").then(r => r.json()),
        fetch("http://localhost:2340/api/orderss/preparinglist/count").then(r => r.json()),
        fetch("http://localhost:2340/api/orderss/outfordeliverylist/count").then(r => r.json()),
        fetch("http://localhost:2340/api/orderss/deliveredlist/count").then(r => r.json()),
        fetch("http://localhost:2340/api/reguser/user/count").then(r => r.json()),
      ]);

      setStats({
        totalOrder: res[0]?.count || 0,
        newOrder: res[1]?.count || 0,
        confirmedOrder: res[2]?.count || 0,
        preparingOrder: res[3]?.count || 0,
        outForDelivery: res[4]?.count || 0,
        delivered: res[5]?.count || 0,
        users: res[6]?.count || 0,
      });

    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const data = [
    { title: "TOTAL ORDER", value: stats.totalOrder, link: "/orderdata" },
    { title: "NEW ORDER", value: stats.newOrder, link: "/new" },
    { title: "CONFIRMED ORDER", value: stats.confirmedOrder, link: "/confirm" },
    { title: "FOOD BEING PREPARED", value: stats.preparingOrder, link: "/prepare" },
    { title: "FOOD PICKUP", value: stats.outForDelivery, link: "/out" },
    { title: "TOTAL DELIVERED", value: stats.delivered, link: "/deliver" },
    { title: "TOTAL USERS", value: stats.users, link: "/users" },
  ];

  return (
    <div className="dash-container">
      <div className="mainnn">

        <div className="topbarrr">
          <h2>Food Ordering System</h2>
          <span>New: <Link to={"/new"} className="new-badge ">{stats.newOrder}</Link></span>
        </div>

        <div className="card-griddd">
          {data.map((item, i) => (
            <Link to={item.link} className="carddd" key={i}>
              <h4>{item.title}</h4>
              <h1>{item.value}</h1>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}