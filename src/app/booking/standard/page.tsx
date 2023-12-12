"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/authContext/authContext";
import { useHotel } from "@/context/hotelContext/hotelContext";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/components/header";
import Link from "next/link";

import emailjs from "@emailjs/browser";
import { InterfaceBooking } from "@/utils/types/types";

const HotelManagementPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<any>();

  const { user, token, loading } = useAuth();
  const { roomStats, bookRoom, hotelData, rooms } = useHotel();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("children");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const handleDateChange = (date: any) => {
    // Assuming startDate is always set
    if (!endDate || date < endDate) {
      setStartDate(date);
    } else {
      setStartDate(endDate);
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  const handleBookNow = () => {
    if ((!token || !user) && !loading) {
      router.push("/auth/signin");
      return;
    }
    if (!rooms) {
      alert("No rooms available");
      return;
    }

    const room: any = rooms.find(
      (room: any) => room?.roomType === "standard" && room?.available
    );
    // if (!room) {
    //   return;
    // }
    // const room = hotelData?.rooms.find((room: any) => room.id === roomId);
    if (!room || !room?.id || room?.price === undefined) {
      alert("No rooms available");
      return;
    }
    if (!endDate || !startDate) {
      alert("Please select check-in and check-out dates");
      return;
    }
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const bookingData: InterfaceBooking = {
      user: user?.uid as unknown as string,
      bookingId: uuidv4() as unknown as string,
      roomId: room.id,
      bookedOn: new Date(),
      bookedFrom: startDate,
      bookedTill: endDate,
      paymentId: uuidv4() as unknown as string,
      paymentDate: new Date(),
      paid: true,
      price: numberOfDays * room.price,
      hotelId: room?.hotelId,
      bookingStatus: "booked",
    };
    bookRoom(bookingData, room?.hotelId);

    // Send email
    const templateParams = {
      to_name: user?.username,
      to_email: user?.email,
      bookingStatus: bookingData.bookingStatus,
      bookedOn: bookingData.bookedOn,
      paymentDate: bookingData.paymentDate,
      bookingId: bookingData.bookingId,
      paymentStatus: bookingData.paid ? "Paid" : "Not Paid",
      bookedFrom: bookingData.bookedFrom,
      bookedTill: bookingData.bookedTill,
      paymentId: bookingData.paymentId,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID as string
      )
      .then((response) => {
        console.log("SUCCESSFULLY SENT EMAIL", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED SENDING EMAIL", err);
      });

    alert("Booking Successful");
  };

  const images = [
    "https://images.pexels.com/photos/7598115/pexels-photo-7598115.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2134224/pexels-photo-2134224.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/279805/pexels-photo-279805.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];
  return (
    <div className="container mx-auto ">
      <Header />
      <div className="mb-8 mt-32">
        <header className="text-white text-center relative">
          <div className="container mx-auto relative">
            <img
              src="/stan.jpeg"
              alt="Hotel Banner"
              className="w-full h-96 mb-4 rounded-lg object-cover opacity-50"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
              <h1 className="text-4xl font-bold text-rose-900">
                Standard Rooms
              </h1>
              <p className="mt-2 text-rose-900">
                The Standard Room is a cozy haven with modern amenities, ideal
                for solo or couple travelers. Enjoy a comfortable stay with
                essential conveniences in a well-designed space
              </p>
            </div>
          </div>
        </header>{" "}
      </div>

      {/* Amenities */}
      <div className="mt-8 mb-8 flex space-x-4">
        <div>
          <label
            htmlFor="startDatePicker"
            className="block text-lg font-bold mb-2"
          >
            Select Check-in Date:
          </label>
          <DatePicker
            id="startDatePicker"
            selected={startDate}
            onChange={handleDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="endDatePicker"
            className="block text-lg font-bold mb-2"
          >
            Select Check-out Date:
          </label>
          <DatePicker
            id="endDatePicker"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="p-2 border rounded"
          />
        </div>
      </div>
      <div className="overflow-x-hidden mt-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Room Gallery</h2>

        <div className="flex space-x-4 animate-marquee">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Gallery Image ${index + 1}`}
              className="block h-[300px] w-auto max-w-lg rounded-lg object-cover object-center animate-fade-in"
            />
          ))}
        </div>
      </div>
      {/* Amenities */}
      <div className="flex space-x-8">
        <div className="bg-black rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-white">Highlights</h2>
          {/* Sample Amenities (Replace with your data) */}
          <div className=" flex flex-row justify-evenly text-white">
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Free Wi-Fi
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Balcony/terrace
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Air conditioning
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Mini bar
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Free Wi-Fi
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Balcony/terrace
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Air conditioning
              </div>
              <div className="flex items-center">
                <img
                  src="/tick.svg" // Replace with the path to your Wi-Fi icon
                  alt="Wi-Fi Icon"
                  className="mr-2 w-6 h-6" // Adjust the width and height accordingly
                />
                Mini bar
              </div>
            </div>
          </div>
        </div>

        <div className="border border-black rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-black">Services</h2>
          {/* Sample Amenities (Replace with your data) */}
          <div className="space-y-4 text-black">
            <div className="flex items-center">
              <img
                src="/tick-01.svg" // Replace with the path to your Wi-Fi icon
                alt="Wi-Fi Icon"
                className="mr-2 w-6 h-6" // Adjust the width and height accordingly
              />
              Laundry
            </div>
            <div className="flex items-center">
              <img
                src="/tick-01.svg" // Replace with the path to your Wi-Fi icon
                alt="Wi-Fi Icon"
                className="mr-2 w-6 h-6" // Adjust the width and height accordingly
              />
              Spa
            </div>
            <div className="flex items-center">
              <img
                src="/tick-01.svg" // Replace with the path to your Wi-Fi icon
                alt="Wi-Fi Icon"
                className="mr-2 w-6 h-6" // Adjust the width and height accordingly
              />
              Concierge
            </div>
            <div className="flex items-center">
              <img
                src="/tick-01.svg" // Replace with the path to your Wi-Fi icon
                alt="Wi-Fi Icon"
                className="mr-2 w-6 h-6" // Adjust the width and height accordingly
              />
              Room Service
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-4 border border-green-500 bg-green-100 py-2 text-black text-center rounded rounded-lg">
        <p className="text-sm font-semibold">
          {roomStats.totalAvailableRooms === 0 ||
          roomStats.availableStandardRooms === 0
            ? "No Rooms available"
            : `${roomStats.availableStandardRooms} out of ${roomStats.totalStandardRooms} Rooms Available - Book Now!`}
        </p>
      </div>

      <div className="shadow-material p-4 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Property Policies</h2>

        {/* Tab Navigation */}
        <div className="flex mb-4">
          <button
            className={`mr-4 focus:outline-none ${
              activeTab === "children"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("children")}
          >
            Children and Extra Beds
          </button>
          <button
            className={`mr-4 focus:outline-none ${
              activeTab === "checkInOut"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("checkInOut")}
          >
            Check-in/Check-out
          </button>
          <button
            className={`focus:outline-none ${
              activeTab === "announcements"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick("announcements")}
          >
            Property Announcements
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "children" && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Children and Extra Beds
            </h3>
            <p className="mb-2">All children are welcome.</p>
            <p className="mb-2">
              When booking more than 5 rooms, different policies and additional
              supplements may apply.
            </p>
            <p>
              Extra beds, if available, are dependent on the room you choose.
              Please ask the property for more details.
            </p>
          </div>
        )}

        {activeTab === "checkInOut" && (
          <div className="mb-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Check-in/Check-out</h3>
              <p className="mb-2">Check-in from: 02:00 PM</p>
              <p className="mb-2">Check-in until: 11:00 PM</p>
              <p className="mb-2">Check-out from: 08:00 AM</p>
              <p>Check-out until: 11:00 AM</p>
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Property Announcements
              </h3>
              <p className="mb-2">
                Please note that any changes in tax structure due to government
                policies will result in revised taxes, which will be applicable
                to all reservations and will be charged additionally during
                check out.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Booking Button */}
      <Link href="/payment">
        {" "}
        <div className="mt-8 mb-8">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              roomStats.totalAvailableRooms === 0 ||
              roomStats.availableStandardRooms === 0
            }
          >
            <Link href="/payment"> Pay Now</Link>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default HotelManagementPage;
