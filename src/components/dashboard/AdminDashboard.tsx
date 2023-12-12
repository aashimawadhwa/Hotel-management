import React, { use, useEffect } from "react";
import { useState } from "react";
import { useHotel } from "@/context/hotelContext/hotelContext";
import { useAuth } from "@/context/authContext/authContext";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import PageNotFound from "@/utils/ui/PageNotFound";
import RoomForm from "./model";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>({
    deluxe: null,
    standard: null,
  });
  const [showBooking, setShowBooking] = useState("");
  const [selectFromSideBar, setSelectFromSideBar] = useState("rooms");

  const {
    rooms,
    bookings,
    deleteRoom,
    addRoom,
    loading: hotelLoading,
    hotelData,
    changeBookingStatus,
  } = useHotel();
  const { token, loading } = useAuth();

  console.log(bookings);
  console.log("hotelData", hotelData);

  useEffect(() => {
    if (!token) {
      window.location.href = "/auth/signin";
    }
  }, [token]);

  useEffect(() => {
    setSelectedRoom({
      deluxe: null,
      standard: null,
    });
    setShowBooking("");
  }, [loading, hotelLoading]);

  const showBookingHandler = (id: string) => {
    if (showBooking === id) {
      setShowBooking("");
    } else {
      setShowBooking(id);
    }
  };

  const handleSelectChange = async (newStatus: string, bookingId: string) => {
    if (bookingId && newStatus) {
      await changeBookingStatus(bookingId, newStatus);
    }
  };

  const getRevenuePerMonth = (bookings: any) => {
    // Filter bookings with price and paymentDate
    const validBookings = bookings.filter(
      (booking: any) => booking.price && booking.paymentDate
    );

    // Group valid bookings by month
    const revenueByMonth = validBookings.reduce((acc: any, booking: any) => {
      const paymentDate = booking.paymentDate.toDate(); // Assuming paymentDate is a Firestore Timestamp
      const monthKey = `${paymentDate.getFullYear()}-${
        paymentDate.getMonth() + 1
      }`;

      acc[monthKey] = (acc[monthKey] || 0) + booking.price;
      return acc;
    }, {});

    // Convert grouped data to an array of revenue per month
    const revenueArray = Object.entries(revenueByMonth).map(
      ([monthKey, revenue]) => ({
        month: monthKey,
        revenue,
      })
    );

    return revenueArray;
  };

  const handleSelectSidebarChange = (select: string) => {
    setSelectFromSideBar(select);
  };

  console.log(getRevenuePerMonth(bookings));

  return (
    <>
      {token ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            handleOpenSelect={handleSelectSidebarChange}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden h-full w-full">
            <Header />

            {token && hotelLoading ? (
              <h1>Loading...</h1>
            ) : (
              <main className="mt-16">
                {selectFromSideBar === "rooms" && (
                  <div className="mx-auto w-full h-max p-4 md:p-6 2xl:p-10 text-black xl:flex flex-row justify-center">
                    <div className="flex flex-row">
                      <ul className="flex flex-col gap-4 p-8 w-max">
                        <div
                          onClick={() =>
                            <RoomForm onSubmit={(formData) => {
                              // You can call your addRoom function here with the form data
                              addRoom({
                                ...formData,
                                available: true,
                                price: 1699,
                                hotelId: hotelData?.id,
                              });
                            }} />
                          }
                        >
                          Add
                        </div>
                        {rooms ? (
                          rooms
                            .filter((room: any) => room?.roomType === "deluxe")
                            .map((room: any) => (
                              <li
                                className={`flex items-center justify-between bg-${
                                  !room.available ? "black" : "white"
                                } rounded-md w-[14rem] h-16 p-2 cursor-pointer shadow-sm ${
                                  room.available
                                    ? "hover:bg-slate-100"
                                    : "hover:bg-slate-700"
                                }`}
                                key={room.id}
                                onClick={() =>
                                  setSelectedRoom((prev: any) => ({
                                    ...prev,
                                    deluxe: room,
                                  }))
                                }
                              >
                                <div
                                  className={`text-${
                                    !room.available ? "white" : "inherit"
                                  }`}
                                >
                                  <p
                                    className={`font-bold text-${
                                      room.available ? "slate-500" : "white"
                                    } text-[1.1rem]`}
                                  >
                                    {room.roomNo}
                                  </p>
                                  <p
                                    className={`font-${
                                      room.available ? "thin" : "medium"
                                    } capitalize text-[0.9rem]`}
                                  >
                                    {room.roomType}
                                  </p>
                                </div>
                                <div
                                  className={`capitalize ${
                                    room.available ? "bg-rose-400" : "bg-white"
                                  }  text-${
                                    room.available ? "white" : "black"
                                  } px-4 py-2 font-semibold rounded-md cursor-pointer hover:bg-rose-500`}
                                  onClick={() => deleteRoom(room.id)}
                                >
                                  delete
                                </div>
                              </li>
                            ))
                        ) : (
                          <div className="flex items-center justify-between bg-white rounded-md w-[14rem] h-16 p-2 cursor-pointer shadow-sm hover:bg-slate-100 capitalize">
                            no rooms
                          </div>
                        )}
                      </ul>
                      {selectedRoom && selectedRoom.deluxe && (
                        <div className="p-4 w-[18rem] flex flex-col bg-slate-100 m-8 rounded-md font-bold text-slate-500">
                          <p className="text-[1.1rem] text-center">
                            Room No:&nbsp;{selectedRoom?.deluxe?.roomNo}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            Room Type:&nbsp;{selectedRoom?.deluxe?.roomType}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            No of beds:&nbsp;{selectedRoom?.deluxe?.noOfBeds}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            Booking:&nbsp;
                            {selectedRoom?.deluxe?.available
                              ? "available"
                              : "booked"}
                          </p>
                          <div className="bg-blue-300 w-min m-auto px-4 py-2 rounded-md text-white">
                            ₹&nbsp;{selectedRoom?.deluxe?.price}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row">
                      <ul className="flex flex-col gap-4 p-8 w-max">
                        {rooms ? (
                          rooms
                            .filter(
                              (room: any) => room?.roomType === "standard"
                            )
                            .map((room: any) => (
                              <li
                                className={`flex items-center justify-between bg-${
                                  !room.available ? "black" : "white"
                                } rounded-md w-[14rem] h-16 p-2 cursor-pointer shadow-sm ${
                                  room.available
                                    ? "hover:bg-slate-100"
                                    : "hover:bg-slate-700"
                                }`}
                                key={room.id}
                                onClick={() =>
                                  setSelectedRoom((prev: any) => ({
                                    ...prev,
                                    standard: room,
                                  }))
                                }
                              >
                                <div
                                  className={`text-${
                                    !room.available ? "white" : "inherit"
                                  }`}
                                >
                                  <p
                                    className={`font-bold text-${
                                      room.available ? "slate-500" : "white"
                                    } text-[1.1rem]`}
                                  >
                                    {room.roomNo}
                                  </p>
                                  <p
                                    className={`font-${
                                      room.available ? "thin" : "medium"
                                    } capitalize text-[0.9rem]`}
                                  >
                                    {room.roomType}
                                  </p>
                                </div>
                                <div
                                  className={`capitalize ${
                                    room.available ? "bg-rose-400" : "bg-white"
                                  }  text-${
                                    room.available ? "white" : "black"
                                  } px-4 py-2 font-semibold rounded-md cursor-pointer hover:bg-rose-500`}
                                  onClick={() => deleteRoom(room.id)}
                                >
                                  delete
                                </div>
                              </li>
                            ))
                        ) : (
                          <div className="flex items-center justify-between bg-white rounded-md w-[14rem] h-16 p-2 cursor-pointer shadow-sm hover:bg-slate-100 capitalize">
                            no rooms
                          </div>
                        )}
                      </ul>
                      {selectedRoom && selectedRoom.standard && (
                        <div className="p-4 w-[18rem] flex flex-col bg-slate-100 m-8 rounded-md font-bold text-slate-500">
                          <p className="text-[1.1rem] text-center">
                            Room No:&nbsp;{selectedRoom?.standard?.roomNo}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            Room Type:&nbsp;{selectedRoom?.standard?.roomType}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            No of beds:&nbsp;{selectedRoom?.standard?.noOfBeds}
                          </p>
                          <p className="text-[0.9rem] capitalize font-medium mt-4">
                            Booking:&nbsp;
                            {selectedRoom?.standard?.available
                              ? "available"
                              : "booked"}
                          </p>
                          <div className="bg-blue-300 w-min m-auto px-4 py-2 rounded-md text-white">
                            ₹&nbsp;{selectedRoom?.standard?.price}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <ul></ul>
                    </div>
                  </div>
                )}
                {selectFromSideBar === "booking" && (
                  <div className="mx-auto w-full h-full p-4 border-t-[1px] md:p-6 2xl:p-10 text-black">
                    <div className="flex flex-row">
                      <ul className="flex flex-col gap-4 p-8 w-full">
                        {bookings ? (
                          (bookings as any).map((booking: any) => (
                            <li
                              className="flex flex-col items-center justify-between bg-white w-full border-b-2 h-max p-2 cursor-pointer hover:bg-slate-100"
                              key={booking.id}
                              onClick={() => showBookingHandler(booking.id)}
                            >
                              <div className="flex flex-col md:flex-row gap-2 md:gap-0 mditems-center justify-between w-full">
                                <div>
                                  <p className="font-bold text-slate-500 text-[1.1rem]">
                                    {booking.bookingId}
                                  </p>
                                  <p className="font-thin capitalize text-[0.9rem]">
                                    {new Date(
                                      booking.bookedOn.seconds * 1000
                                    ).toDateString()}
                                  </p>
                                </div>
                                {booking && booking.bookingStatus && (
                                  <select
                                    value={booking.bookingStatus}
                                    name="bookingStatus"
                                    onChange={(e) =>
                                      handleSelectChange(
                                        e.target.value,
                                        booking.id
                                      )
                                    }
                                    className="p-4 rounded-md bg-transparent border-[1px] border-slate-300"
                                  >
                                    <option value="booked">Booked</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="checkedin">CheckedIn</option>
                                    <option value="checkedout">
                                      CheckedOut
                                    </option>
                                  </select>
                                )}
                              </div>
                              {booking.id === showBooking && (
                                <div className="flex flex-col mt-3 w-full">
                                  <div className="p-2 rounded-sm bg-blue-100 w-full flex flex-col md:flex-row justify-between">
                                    <p className="capitalize">
                                      <b>Name:</b>&nbsp;
                                      {booking?.user?.username}
                                    </p>
                                    <p className="capitalize">
                                      <b>Email:</b>&nbsp;
                                      <span className="lowercase">
                                        {booking?.user?.email}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="p-2 mt-2 rounded-sm bg-blue-50 w-full flex flex-col">
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        Room Type
                                      </span>
                                      <span className="font-thin capitalize text-[0.9rem]">
                                        {booking?.room?.roomType}
                                      </span>
                                    </p>
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        Booked On:
                                      </span>
                                      <span className="font-bold text-slate-500 text-[1.1rem]">
                                        {new Date(
                                          booking?.bookedOn?.seconds
                                        ).toDateString()}
                                      </span>
                                    </p>
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        From
                                      </span>
                                      <span className="font-bold text-slate-500 text-[1.1rem]">
                                        {new Date(
                                          booking?.bookedFrom?.seconds
                                        ).toDateString()}
                                      </span>
                                    </p>
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        To
                                      </span>
                                      <span className="font-bold text-slate-500 text-[1.1rem]">
                                        {new Date(
                                          booking?.bookedTill?.seconds
                                        ).toDateString()}
                                      </span>
                                    </p>
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        Payment
                                      </span>
                                      <span className="font-bold text-slate-500 text-[1.1rem]">
                                        {booking?.paid ? "Paid" : "Not Paid"}
                                      </span>
                                    </p>
                                    <p className="flex justify-between text-slate-500 border-b-[2px] border-white mb-2">
                                      <span className="font-bold capitalize">
                                        Payment Date
                                      </span>
                                      <span className="font-bold text-slate-500 text-[1.1rem]">
                                        {new Date(
                                          booking?.paymentDate?.seconds
                                        ).toDateString()}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))
                        ) : (
                          <div className="flex items-center justify-between bg-white rounded-md w-[14rem] h-16 p-2 cursor-pointer shadow-sm hover:bg-slate-100 capitalize">
                            no bookings
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </main>
            )}
          </div>
        </div>
      ) : (
        <PageNotFound />
      )}
    </>
  );
}
