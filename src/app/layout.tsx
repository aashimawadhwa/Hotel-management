import { AuthProvider } from "@/context/authContext/authContext";
import { Inter } from "next/font/google";
import "./globals.css";
import { HotelProvider } from "@/context/hotelContext/hotelContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HotelProvider>{children}</HotelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
