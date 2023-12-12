"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import AnimatedCardsPage from "./offerings";
import Header from "@/components/header";
import Footer from "./footer";
import { useAuth } from "@/context/authContext/authContext";

const Home: React.FC = () => {
  const { user, token } = useAuth();
  useEffect(() => {
    if (user?.userType === "admin") {
      window.location.href = "/admin/dashboard";
    }
  }, [user, token]);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Header />
      <header className="text-white text-center relative mt-32">
        <div className="container mx-auto relative">
          <img
            src="/landing.jpeg"
            alt="Hotel Banner"
            className="w-full h-60 mb-4 rounded-lg object-cover opacity-50"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
            <h1 className="text-5xl font-bold text-black">
              Welcome to Hotel Yark
            </h1>
            <p className="mt-2 text-2xl text-black">
              Experience luxury and comfort during your stay with us.
            </p>
          </div>
        </div>
      </header>

      {/* Amenities Card Section */}
      <section className="shadow-material bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-black">WHY US?!</h2>
        <div className="flex justify-center space-x-4">
          {/* Icon 1 */}
          <div className="flex items-center">
            <img src="/icon-01.svg" alt="Icon 2" className="w-8 h-8 mr-2" />
            <span className="text-black">24/7 support</span>
          </div>

          {/* Icon 2 */}
          <div className="flex items-center">
            <img src="/icon-01.svg" alt="Icon 2" className="w-8 h-8 mr-2" />
            <span className="text-black">Best Discounts</span>
          </div>
          <div className="flex items-center">
            <img src="/icon-01.svg" alt="Icon 2" className="w-8 h-8 mr-2" />
            <span className="text-black">Trained Staff</span>
          </div>
        </div>
      </section>
      <AnimatedCardsPage />
      {/* Black Strip with Moving "Book Now" Text */}
      <div className="bg-black py-2 overflow-hidden mt-4">
        <div className="animate-marquee whitespace-nowrap flex space-x-4 text-white">
          {/* Repeated "Book Now" spans */}
          {Array.from({ length: 100 }).map((_, index) => (
            <span key={index}>Book Now</span>
          ))}
        </div>
      </div>

      <section className="bg-gray-100 py-24 mt-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">
            Book Rooms for Yourself
          </h2>

          <div className="flex justify-center space-x-4">
            {/* Card 1 */}
            <div className="max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-black">
                Standard Room
              </h3>
              <p className="text-gray-600 mb-4">
                Comfortable accommodations with essential amenities, suitable
                for a relaxing stay.{" "}
              </p>
              <p className="text-red-600 font-bold mb-4">from Rs.1099/only</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                <Link href="/booking/standard">Book Now</Link>
              </button>
            </div>

            {/* Card 2 */}
            <div className="max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-black">Deluxe Room</h3>
              <p className="text-gray-600 mb-2">
                Luxurious and spacious rooms featuring additional amenities and
                premium comforts for an elevated experience.{" "}
              </p>
              <p className="text-red-600 font-bold mb-4">from Rs.1699/only</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                <Link href="/booking/delux">Book Now</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />

    </>
  );
};

export default Home;
