import React from "react";
import { assets } from "../../assets/assets/assets";

const Footer = () => {
  return (
    <div className="bg-[#111827] w-full min-h-72 text-zinc-100">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8 m-auto place-items-start lg:place-items-center ">
  <div className="flex flex-col items-center ">
    <img className="w-36 md:w-40 lg:w-40 place-self-start" src={assets.logo} />
    <p className="w-80 pt-3">
    Learnify is a smart and flexible Learning Management System that lets you
    explore, learn, and grow at your own pace — anytime, anywhere.
    </p>
  </div>

  <div className="flex flex-col justify-center">
    <h1 className="font-bold text-lg">Company</h1>
    <ul className="mt-5">
      <li>Home</li>
      <li>About us</li>
      <li>Delivery</li>
      <li>Privacy Policy</li>
    </ul>
  </div>
  <div className="flex flex-col justify-center">
    <h1 className="font-bold text-lg">Get in Touch</h1>
    <ul className="mt-5 ">
      <li>+0-000-000-000</li>
      <li>karanmohan44@gmail.com</li>
    </ul>
  </div>
  
</div>
<hr className="m-auto border-t-[1px] border-zinc-200  w-[90%]"/>
<p className="text-center py-5 font-semibold">Copyright 2025 @KaranMohanTalwar - All Rights Reserved</p>
</div>
  ) 
};

export default Footer;
