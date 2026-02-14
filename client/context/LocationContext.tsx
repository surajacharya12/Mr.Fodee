"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Coords {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  coords: Coords | null;
  address: string;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState("Detecting...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setAddress("New York, NY");
      setIsLoading(false);
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
          );
          const data = await response.json();

          // Build a more readable but precise address
          const addr = data.address;
          const specificName = addr.amenity || addr.building || addr.house_number || "";
          const neighborhood = addr.neighbourhood || addr.suburb || addr.village || "";
          const road = addr.road || "";
          const city = addr.city || addr.town || "";

          let preciseAddress = "";
          if (specificName) preciseAddress += `${specificName}, `;
          if (neighborhood) preciseAddress += `${neighborhood}, `;
          if (road) preciseAddress += `${road}, `;
          if (city) preciseAddress += city;

          // Fallback to display_name if our custom string is empty
          setAddress(preciseAddress || data.display_name.split(',').slice(0, 3).join(',') || "Unknown Location");
        } catch (error) {
          console.error("Error fetching location address:", error);
          setAddress("New York, NY");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setAddress("New York, NY");
        setIsLoading(false);
        setError(error.message);
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ coords, address, isLoading, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
