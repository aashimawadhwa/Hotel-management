import React from "react";

const AnimatedCard = ({ title, description, animationDelay }:any) => {
  return (
    <div
      className={`bg-white shadow-material p-6 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105 transition delay-${animationDelay}`}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AnimatedCardList = () => {
  const cards = [
    {
      title: "Room Types",
      description: "Explore our variety of room types to suit your preferences.",
      animationDelay: 0,
    },
    {
      title: "Amenities",
      description: "Enjoy our exceptional amenities for a comfortable stay.",
      animationDelay: 100,
    },
    {
      title: "Services",
      description: "Experience top-notch services from our dedicated staff.",
      animationDelay: 200,
    },
  ];

  return (
    <div className=" flex space-x-4">
      {cards.map((card, index) => (
        <AnimatedCard key={index} {...card} />
      ))}
    </div>
  );
};

const AnimatedCardsPage = () => {
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-4xl font-bold mb-8">Discover Our Offerings</h1>
      <AnimatedCardList />
    </div>
  );
};

export default AnimatedCardsPage;
