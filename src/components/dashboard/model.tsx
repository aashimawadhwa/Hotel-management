import React, { useState } from "react";

interface RoomFormProps {
  onSubmit: (formData: RoomFormData) => void;
}

interface RoomFormData {
  roomNo: string;
  roomType: string;
  noOfBeds: number;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    roomNo: "",
    roomType: "",
    noOfBeds: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="roomNo" className="block text-sm font-medium text-gray-600">
          Room Number
        </label>
        <input
          type="text"
          id="roomNo"
          name="roomNo"
          value={formData.roomNo}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="101D"
          required
        />
      </div>

      <div>
        <label htmlFor="roomType" className="block text-sm font-medium text-gray-600">
          Room Type
        </label>
        <input
          type="text"
          id="roomType"
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Deluxe"
          required
        />
      </div>

      <div>
        <label htmlFor="noOfBeds" className="block text-sm font-medium text-gray-600">
          Number of Beds
        </label>
        <input
          type="number"
          id="noOfBeds"
          name="noOfBeds"
          value={formData.noOfBeds}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="1"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Add Room
      </button>
    </form>
  );
};

export default RoomForm;
