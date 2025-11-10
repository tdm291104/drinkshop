"use client";

import TopNavbar from "./TopNavbar";
import MainNavbar from "./MainNavbar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <TopNavbar />
      <MainNavbar />
    </header>
  );
};

export default Header;
