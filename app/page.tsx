"use client";
import React, { useEffect, useState } from "react";
import apiCalls from "@/graphql";
import {
  ShipsQuery,
  MissionsQuery,
  MissionsQueryVariables,
} from "@/util/types/graphql";
import { useQuery, useLazyQuery } from "@apollo/client";

export default function Home() {
  const [activeShipIndex, setActiveShipIndex] = useState<null | number>(null);
  const [missionsData, setMissionsData] = useState<Record<string, any>>({});

  const { data } = useQuery<ShipsQuery>(apiCalls.queries.ships, {
    variables: {
      input: {
        pagination: {
          limit: 1,
          offset: 0,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [getMissions, { data: missionsQueryData }] = useLazyQuery<
    MissionsQuery,
    MissionsQueryVariables
  >(apiCalls.queries.mission);

  useEffect(() => {
    const fetchMissions = async () => {
      if (data?.ships) {
        for (const ship of data.ships) {
          if (ship?.id) {
            try {
              await getMissions({
                variables: { shipId: ship.id },
                onCompleted: (missionsResult) => {
                  if (typeof ship.id === "string") {
                    setMissionsData((prevMissionsData) => ({
                      ...prevMissionsData,
                      [ship.id]: missionsResult.missions,
                    }));
                  }
                },
              });
            } catch (error) {
              console.error("Error fetching missions", error);
            }
          }
        }
      }
    };

    fetchMissions();
  }, [data, getMissions]);

  const toggleShipDetail = (index: number) => {
    setActiveShipIndex(activeShipIndex === index ? null : index);
  };

  return (
    <main className="flex justify-center min-h-screen p-14">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.ships?.map((ship, index) => {
          return (
            <div
              key={index}
              className="flex md:flex-row bg-white shadow-lg rounded-lg overflow-hidden"
              onClick={() => toggleShipDetail(index)}
            >
              {ship?.image && (
                <img
                  src={ship.image}
                  alt={`Ship ${ship?.name || ""}`}
                  className="w-48 h-48 md:w-56 md:h-56 object-cover cursor-pointer"
                />
              )}
              {activeShipIndex === index && (
                <div className="p-4">
                  <h2 className="text-lg font-bold">{ship?.name}</h2>
                  <p>{ship?.active ? "Active" : "Inactive"}</p>
                  <p>Class: {ship?.class}</p>
                  <p>ID: {ship?.id}</p>
                  {typeof ship?.id === "string" && missionsData[ship?.id] && (
                    <div>
                      <h3 className="text-md font-bold">Missions:</h3>
                      {missionsData[ship?.id].map(
                        (mission: any, missionIndex: any) => (
                          <div key={missionIndex}>
                            <p>
                              <b>Name:</b> {mission.name}
                            </p>
                            <p>
                              <b>Destination:</b> {mission.destination}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
