"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AgentSidebar from "@/components/sidebars/AgentSidebar";

function PropertyCard({ property }) {
  const router = useRouter();

  const handleViewProperty = () => {
    // Navigate to property details page
    router.push(`/dashboard/agent/properties/${property.id}`);
  };

  const handleEditProperty = () => {
    // Navigate to property edit page
    router.push(`/dashboard/agent/properties/${property.id}/edit`);
  };

  return (
    <div className="rounded-[10px] flex-1 min-w-64 max-w-[20rem] h-96 bg-[#80808014]">
      <div className="h-full flex flex-col p-2.5">
        {/* Property Image */}
        <div
          className="relative w-full rounded-[10px] overflow-hidden flex-shrink-0 mb-2"
          style={{
            height: "165px",
          }}
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="flex flex-col flex-1 justify-between">
          {/* Price and Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span
                className="font-semibold"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "18.19px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#0B0B0B",
                }}
              >
                ${property.price}
              </span>
              <span className="text-[10px] text-neutral-500">/ month</span>
            </div>
            <div
              className="font-semibold flex items-center justify-center"
              style={{
                width:
                  property.status === "Vacant"
                    ? "56.84px"
                    : property.status === "Occupied"
                      ? "77px"
                      : "auto",
                height:
                  property.status === "Vacant"
                    ? "21.98px"
                    : property.status === "Occupied"
                      ? "23.26px"
                      : "auto",
                borderRadius:
                  property.status === "Vacant"
                    ? "11.37px"
                    : property.status === "Occupied"
                      ? "12.03px"
                      : "8px",
                backgroundColor:
                  property.status === "Vacant"
                    ? "#FFF8E1"
                    : property.status === "Occupied"
                      ? "#E8F5E9"
                      : "#f5f5f5",
                color:
                  property.status === "Vacant"
                    ? "#F59E0B"
                    : property.status === "Occupied"
                      ? "#10B981"
                      : "#737373",
                fontSize: "9px",
                padding:
                  property.status === "Vacant"
                    ? "0 7.58px"
                    : property.status === "Occupied"
                      ? "0 8.02px"
                      : "0 7.58px",
              }}
            >
              {property.status}
            </div>
          </div>

          {/* Title and Address */}
          <div className="mb-2">
            <h3
              className="font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
                width: "165.21px",
                height: "16px",
                color: "#0B0B0B",
              }}
            >
              {property.title}
            </h3>
            <p className="text-[9px] text-neutral-500">{property.address}</p>
          </div>

          {/* Property Features */}
          <div
            className="flex items-center text-[10px] text-neutral-600 mb-2"
            style={{
              width: "100%",
              height: "15.91px",
              gap: "30.31px",
            }}
          >
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">{property.beds} bd</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <span className="font-medium">{property.units} units</span>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <span className="font-medium">{property.size} ft</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[8px]">
            <button
              onClick={handleViewProperty}
              className="flex-1 bg-white text-neutral-900 rounded-[10px] font-semibold hover:bg-black hover:text-white transition-colors"
              style={{
                width: "220px",
                height: "32px",
                border: "1.5px solid #00A34C57",
                fontFamily: "Montserrat",
                fontWeight: 600,
                fontSize: "12.13px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              View Properties
            </button>
            <button
              onClick={handleEditProperty}
              className="bg-white rounded-[10px] hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-0.5 group"
              style={{
                width: "70px",
                height: "32px",
                border: "1.5px solid #00A34C57",
              }}
            >
              <svg
                className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span
                className="font-semibold text-neutral-900 group-hover:text-white transition-colors"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "12.13px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                }}
              >
                Edit
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyBank() {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/properties");
      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load properties");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.status.toLowerCase().includes(searchLower) ||
      property.price.includes(searchQuery)
    );
  });

  return (
    <div className="flex gap-4 justify-center max-w-screen px-4">
      {/* Left side: Header + Property Grid */}
      <div className="flex-1 min-w-0">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-semibold text-neutral-900"
            style={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: "14.93px",
              lineHeight: "100%",
              letterSpacing: "0%",
              width: "139px",
              height: "18px",
            }}
          >
            My Property Bank
          </h2>

          {/* Search Bar */}
          <div className="relative w-[702px] h-[32px]">
            <svg
              className="absolute left-[19.69px] top-1/2 -translate-y-1/2 w-[13.29px] h-[13.29px] text-neutral-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, address, status, or price..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-[44px] pr-[19.69px] text-sm rounded-[9.85px] focus:outline-none focus:ring-0 bg-white text-neutral-900 placeholder:text-neutral-400"
              style={{
                borderWidth: "0.98px",
                borderColor: "#d1d5db",
                borderStyle: "solid",
              }}
            />
          </div>
        </div>

        {/* Property Grid with Border */}
        <div
          className="border border-neutral-200 rounded-2xl"
          style={{ height: "700px" }}
        >
          <div className="h-full overflow-y-auto scrollbar-hide p-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-sm text-neutral-500">
                    Loading properties...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <button
                    onClick={fetchProperties}
                    className="text-sm text-emerald-600 underline hover:text-emerald-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-sm text-neutral-500">
                    No properties found
                  </p>
                  {searchQuery && (
                    <p className="text-xs text-neutral-400 mt-2">
                      Try adjusting your search
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="gap-3 flex flex-wrap justify-evenly">
                {/**grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">**/}
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="mt-[50px] w-fit">
        <AgentSidebar />
      </div>
    </div>
  );
}
