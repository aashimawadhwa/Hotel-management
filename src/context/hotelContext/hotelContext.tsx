"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import {
  InterfaceBooking,
  InterfaceHotel,
  InterfaceRoom,
} from "@/utils/types/types";

interface HotelContextProps {
  hotelData: any | null;
  rooms: String[] | null;
  getHotelData: () => Promise<void>;
  getRooms: () => Promise<void>;
  addRoom: (roomData: InterfaceRoom) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  bookRoom: (bookingData: InterfaceBooking, hotel: string) => Promise<void>;
  changeBookingStatus: (id: string, newStatus: string) => Promise<void>;
  roomStats: {
    totalRooms: number;
    totalAvailableRooms: number;
    totalDeluxeRooms: number;
    totalStandardRooms: number;
    availableDeluxeRooms: number;
    availableStandardRooms: number;
  };
  bookings: any;
  loading: boolean;
}

const HotelContext = createContext<HotelContextProps | undefined>(undefined);

const HotelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hotelData, setHotelData] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    totalAvailableRooms: 0,
    totalDeluxeRooms: 0,
    totalStandardRooms: 0,
    availableDeluxeRooms: 0,
    availableStandardRooms: 0,
  });
  const [bookings, setBookings] = useState<any>([]);

  const getHotelData = async () => {
    setLoading(true);
    try {
      const hotelCollection = collection(db, "hotel");
      const hotelSnapshot = await getDocs(hotelCollection);
      const hotelData = await Promise.all(
        hotelSnapshot.docs.map(async (doc) => {
          const hotel: any = {
            id: doc.id,
            ...doc.data(),
          };

          if (!hotel) {
            throw new Error("Hotel not found");
          }

          // Fetch rooms
          let rooms: any;
          if (hotel?.rooms) {
            const roomsCollection = collection(db, "rooms");
            const roomSnapshot = await getDocs(roomsCollection);
            rooms = roomSnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((room) => hotel?.rooms.includes(room.id));
          } else {
            rooms = [];
          }

          // Fetch bookings
          if (!hotel?.bookings) {
            return {
              ...hotel,
              rooms,
            };
          }
          const bookingsCollection = collection(db, "bookings");
          const bookingSnapshot = await getDocs(bookingsCollection);
          const bookings = bookingSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((booking) => hotel?.bookings.includes(booking.id));

          return {
            ...hotel,
            rooms,
            bookings,
          };
        })
      );

      const hotel = hotelData[0];
      setHotelData(hotel);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setLoading(false);
    }
  };

  const getRooms = async () => {
    setLoading(true);
    try {
      // Fetch rooms data from Firestore
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);

      const roomsData = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set the rooms data
      setRooms(roomsData);

      // Calculate room statistics
      const totalRooms = roomsData.length;
      const totalAvailableRooms = roomsData.filter(
        (room: any) => room.available
      ).length;
      const totalDeluxeRooms = roomsData.filter(
        (room: any) => room.roomType === "deluxe"
      ).length;
      const totalStandardRooms = roomsData.filter(
        (room: any) => room.roomType === "standard"
      ).length;
      const availableDeluxeRooms = roomsData.filter(
        (room: any) => room.available && room.roomType === "deluxe"
      ).length;
      const availableStandardRooms = roomsData.filter(
        (room: any) => room.available && room.roomType === "standard"
      ).length;

      setRoomStats({
        totalRooms,
        totalAvailableRooms,
        totalDeluxeRooms,
        totalStandardRooms,
        availableDeluxeRooms,
        availableStandardRooms,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      setLoading(false);
    }
  };

  const addRoom = async (roomData: InterfaceRoom) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        throw new Error("Unauthorised");
      }
      const isAdmin = user?.userType === "admin";
      if (!isAdmin) {
        throw new Error("Unauthorised");
      }

      const roomsCollection = collection(db, "rooms");
      const roomDocRef = await addDoc(roomsCollection, roomData);

      const hotelDocRef = doc(db, "hotel", roomData?.hotelId);
      await updateDoc(hotelDocRef, {
        rooms: arrayUnion(roomDocRef.id),
      });

      getRooms();
      setLoading(false);
    } catch (error) {
      console.error("Error adding room:", error);
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      // Reference to the room document
      const roomRef = doc(db, "rooms", roomId);

      // Get the room document
      const roomDoc = await getDoc(roomRef);
      const roomData = roomDoc.data();
      const hotelId = roomData?.hotelId;

      // Delete the room document
      await deleteDoc(roomRef);

      // Remove the room ID from the hotel's array of rooms
      if (hotelId) {
        const hotelDocRef = doc(db, "hotel", hotelId);
        await updateDoc(hotelDocRef, {
          rooms: arrayRemove(roomId),
        });
      }

      // Fetch updated rooms data
      getRooms();

      setLoading(false);
    } catch (error) {
      console.error("Error deleting room:", error);
      setLoading(false);
    }
  };

  const bookRoom = async (bookingData: InterfaceBooking, hotelId: string) => {
    try {
      console.log("Booking in progress...");
      const bookingsCollection = collection(db, "bookings");
      const bookingDocRef = await addDoc(bookingsCollection, bookingData);

      // Step 2: Update the room document with booking details
      const roomDocRef = doc(db, "rooms", bookingData.roomId);
      await updateDoc(roomDocRef, {
        available: false,
        bookingId: bookingDocRef.id,
      });

      // Step 3: Update the hotel document with the booking ID and revenue
      const hotelDocRef = doc(db, "hotel", hotelId);
      await updateDoc(hotelDocRef, {
        bookings: arrayUnion(bookingDocRef.id),
        revenue: increment(bookingData.price),
      });

      // Step 4: Update the user document with the booking ID
      const userDocRef = doc(db, "users", bookingData.user);
      await updateDoc(userDocRef, {
        bookings: arrayUnion(bookingDocRef.id),
      });

      // Fetch updated rooms data
      getRooms();
      getHotelData();

      // Booking successful
      console.log("Booking successful!");
    } catch (error) {
      // Handle errors
      console.error("Error making booking:", error);
    }
  };

  const getBookings = async () => {
    setLoading(true);
    try {
      const bookingsCollection = collection(db, "bookings");
      const bookingSnapshot = await getDocs(bookingsCollection);

      const bookingData = await Promise.all(
        bookingSnapshot.docs.map(async (document) => {
          const { user } = document.data();
          const booking: any = {
            id: document.id,
            ...document.data(),
          };

          const roomDocRef = doc(db, "rooms", booking.roomId);
          const roomDoc = await getDoc(roomDocRef);
          if (roomDoc.exists()) {
            booking.room = roomDoc.data();
          }

          const userDocRef = doc(db, "users", user);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            booking.user = userDoc.data();
          }

          return booking;
        })
      );

      setBookings(bookingData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      setLoading(false);
    }
  };

  const changeBookingStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const bookingRef = doc(db, "bookings", id);
      const bookingDoc = await getDoc(bookingRef);
      const bookingData = bookingDoc.data();
      const roomId = bookingData?.roomId;

      // Update the booking status
      await updateDoc(bookingRef, {
        bookingStatus: newStatus.toLowerCase(),
      });

      // Update the room status
      if (newStatus === "cancelled") {
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
          available: true,
          bookingId: "",
        });
      }

      // Update the user document
      const userRef = doc(db, "users", bookingData?.user);
      await updateDoc(userRef, {
        bookings: arrayRemove(id),
      });

      // Fetch updated bookings data
      getBookings();

      // Fetch updated rooms data
      getRooms();

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    getHotelData();
    getRooms();
    getBookings();
  }, []);

  // Define the context value
  const contextValue: HotelContextProps = {
    hotelData,
    rooms,
    getHotelData,
    getRooms,
    addRoom,
    deleteRoom,
    bookRoom,
    changeBookingStatus,
    roomStats,
    bookings,
    loading,
  };

  return (
    <HotelContext.Provider value={contextValue}>
      {children}
    </HotelContext.Provider>
  );
};

const useHotel = (): HotelContextProps => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};

export { HotelProvider, useHotel };
