export interface InterfaceRoom {
  hotelId: string;
  roomNo: string;
  roomType: string;
  noOfBeds: number;
  available: boolean;
  // bookedBy?: string;
  // bookedFrom?: Date | null;
  // bookedTill?: Date | null;
  bookingId?: string;
  price: number;
}

export interface InterfaceUser {
  username: string;
  email: string;
  bookings?: InterfaceBooking[];
  userType: "user" | "admin";
  uid?: string;
}

export interface InterfaceBooking {
  bookingId: string;
  roomId: string;
  user: string;
  bookedOn: Date;
  bookedFrom: Date | null;
  bookedTill: Date | null;
  paymentId: string;
  paymentDate: Date | null;
  paid: boolean;
  price: number;
  hotelId: string;
  bookingStatus: "booked" | "cancelled" | "checkedIn" | "checkedOut";
}

export interface InterfaceHotel {
  id: string;
  name: string;
  bookings: string[];
  rooms: string[];
  revenue: number;
}
