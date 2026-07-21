"use client";
import { useState, useEffect } from "react";

const FooterYear = () => {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  return (
    <div className="text-center md:text-right space-y-1">
      <p className="text-gray-300 text-sm">&copy;{currentYear} All Rights Reserved</p>
      <i>~ Flico is awesome, don't you think ^_~ </i>
    </div>
  );
};

export default FooterYear;
