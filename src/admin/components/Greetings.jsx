import { useEffect, useState } from "react";

const Greeting = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval); 
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="flex items-center justify-center mt-52">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-800">
          Hello, Admin! {getGreeting()}!
        </h1>
        <p className="text-2xl text-gray-600">
          {formatDate(currentTime)} • {formatTime(currentTime)}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
