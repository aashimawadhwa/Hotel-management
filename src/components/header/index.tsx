import React from "react";
import UserDropdown from "./UserDropDown";
import { useAuth } from "@/context/authContext/authContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { token } = useAuth();
  const router = useRouter();
  const clickHandler = () => {
    router.push("/auth/signin");
  };
  return (
    <header className="absolute mb-32 top-0 left-0 z-999 flex justify-between items-center font-bold text-black px-8 py-2 w-full bg-white drop-shadow-lg">
      <p>Hotel</p>
      {token ? (
        <UserDropdown />
      ) : (
        <div
          className="bg-blue-500 rounded-md px-4 py-2 text-white cursor-pointer"
          onClick={clickHandler}
        >
          Login
        </div>
      )}
    </header>
  );
};

export default Header;
