import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../components/ui/radio-group";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Building = {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  type: string;
  wheelchairAccessible: boolean;
  rampsAvailable: boolean;
  elevators: boolean;
};

const allBuildings: Building[] = [
  {
    id: "1",
    name: "Business Leadership Building",
    address: "123 University Ave, Campus City",
    description: "Labs, Classrooms, Research Facilities",
    image: "https://cob.unt.edu/_files/college/_blb.jpg",
    type: "academic",
    wheelchairAccessible: true,
    rampsAvailable: true,
    elevators: true,
  },
  {
    id: "2",
    name: "University Library",
    address: "456 Knowledge Blvd, Campus City",
    description: "Reading Rooms, Study Pods, Archives",
    image: "https://library.unt.edu/assets/images/spaces/banners/sycamore.jpg?v=1661541149",
    type: "libraries",
    wheelchairAccessible: true,
    rampsAvailable: true,
    elevators: true,
  },
  {
    id: "3",
    name: "Science Hall",
    address: "789 Discovery Way, Campus City",
    description:
      "Chemistry Labs, Lecture Halls, Faculty Offices",
    image: "https://tse2.mm.bing.net/th/id/OIP.hXrK3vFcoKZhGuAHpMWaMwHaEz?rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "academic",
    wheelchairAccessible: true,
    rampsAvailable: true,
    elevators: true,
  },
  {
    id: "4",
    name: "Student Union",
    address: "101 Gathering Point, Campus City",
    description: "Dining Hall, Event Spaces, Student Services",
    image: "https://tse1.mm.bing.net/th/id/OIP.8EwRPI4pTthIiNqFNoQBLwHaFR?rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "studentServices",
    wheelchairAccessible: true,
    rampsAvailable: true,
    elevators: true,
  },
  {
    id: "5",
    name: "Arts & Humanities Center",
    address: "202 Creative Lane, Campus City",
    description:
      "Art Studios, Performance Theaters, Classrooms",
    image: "https://tse1.mm.bing.net/th/id/OIP.oxcWdUgT-tL2DMTnM4kjRQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "academic",
    wheelchairAccessible: false,
    rampsAvailable: false,
    elevators: false,
  },
  {
    id: "6",
    name: "DATCU Stadium",
    address: "303 Victory Drive, Campus City",
    description: "Gymnasium, Pool, Fitness Center, Fields",
    image: "https://northtexan.unt.edu/sites/default/files/23-0502_datcu-stadium_0060_banner.jpg",
    type: "recreational",
    wheelchairAccessible: true,
    rampsAvailable: true,
    elevators: true,
  },
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || "",
  );

  // Filters
  const [buildingTypes, setBuildingTypes] = useState<string[]>([
    "academic",
    "libraries",
  ]);
  const [wheelchairAccessible, setWheelchairAccessible] =
    useState(false);
  const [rampsAvailable, setRampsAvailable] = useState(false);
  const [elevators, setElevators] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const toggleBuildingType = (type: string) => {
    setBuildingTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type],
    );
  };

  const filteredBuildings = allBuildings.filter((building) => {
    const matchesSearch = building.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      buildingTypes.length === 0 ||
      buildingTypes.includes(building.type);
    const matchesWheelchair =
      !wheelchairAccessible || building.wheelchairAccessible;
    const matchesRamps =
      !rampsAvailable || building.rampsAvailable;
    const matchesElevators = !elevators || building.elevators;

    return (
      matchesSearch &&
      matchesType &&
      matchesWheelchair &&
      matchesRamps &&
      matchesElevators
    );
  });

  const sortedBuildings = [...filteredBuildings].sort(
    (a, b) => {
      if (sortBy === "name-az")
        return a.name.localeCompare(b.name);
      if (sortBy === "name-za")
        return b.name.localeCompare(a.name);
      if (sortBy === "distance") return 0; // Would calculate actual distance
      return 0; // relevance
    },
  );

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-8">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Filters
                </h2>

                {/* Building Type */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Building Type
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="academic"
                        checked={buildingTypes.includes(
                          "academic",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("academic")
                        }
                      />
                      <Label
                        htmlFor="academic"
                        className="text-sm cursor-pointer"
                      >
                        Academic Buildings
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="libraries"
                        checked={buildingTypes.includes(
                          "libraries",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("libraries")
                        }
                      />
                      <Label
                        htmlFor="libraries"
                        className="text-sm cursor-pointer"
                      >
                        Libraries
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="administrative"
                        checked={buildingTypes.includes(
                          "administrative",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("administrative")
                        }
                      />
                      <Label
                        htmlFor="administrative"
                        className="text-sm cursor-pointer"
                      >
                        Administrative Offices
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="studentServices"
                        checked={buildingTypes.includes(
                          "studentServices",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("studentServices")
                        }
                      />
                      <Label
                        htmlFor="studentServices"
                        className="text-sm cursor-pointer"
                      >
                        Student Services
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="dining"
                        checked={buildingTypes.includes(
                          "dining",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("dining")
                        }
                      />
                      <Label
                        htmlFor="dining"
                        className="text-sm cursor-pointer"
                      >
                        Dining & Cafeterias
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="recreational"
                        checked={buildingTypes.includes(
                          "recreational",
                        )}
                        onCheckedChange={() =>
                          toggleBuildingType("recreational")
                        }
                      />
                      <Label
                        htmlFor="recreational"
                        className="text-sm cursor-pointer"
                      >
                        Recreational Facilities
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Accessibility Features */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Accessibility Features
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="wheelchair"
                        checked={wheelchairAccessible}
                        onCheckedChange={(checked) =>
                          setWheelchairAccessible(
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor="wheelchair"
                        className="text-sm cursor-pointer"
                      >
                        Wheelchair Accessible
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="ramps"
                        checked={rampsAvailable}
                        onCheckedChange={(checked) =>
                          setRampsAvailable(checked === true)
                        }
                      />
                      <Label
                        htmlFor="ramps"
                        className="text-sm cursor-pointer"
                      >
                        Ramps Available
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="elevators"
                        checked={elevators}
                        onCheckedChange={(checked) =>
                          setElevators(checked === true)
                        }
                      />
                      <Label
                        htmlFor="elevators"
                        className="text-sm cursor-pointer"
                      >
                        Elevators
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Sort by
                  </h3>
                  <RadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="relevance"
                        id="relevance"
                      />
                      <Label
                        htmlFor="relevance"
                        className="text-sm cursor-pointer"
                      >
                        Relevance
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="distance"
                        id="distance"
                      />
                      <Label
                        htmlFor="distance"
                        className="text-sm cursor-pointer"
                      >
                        Distance
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="name-az"
                        id="name-az"
                      />
                      <Label
                        htmlFor="name-az"
                        className="text-sm cursor-pointer"
                      >
                        Building Name (A-Z)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="name-za"
                        id="name-za"
                      />
                      <Label
                        htmlFor="name-za"
                        className="text-sm cursor-pointer"
                      >
                        Building Name (Z-A)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button className="w-full bg-[#00853E] hover:bg-[#006E34] text-white">
                  Apply Filters
                </Button>
              </div>
            </aside>

            {/* Main Content - Search Results */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Engineering Building"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSearch()
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Results Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-sm text-gray-600">
                  Displaying {sortedBuildings.length} results
                </p>
              </div>

              {/* Results Grid */}
              {sortedBuildings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedBuildings.map((building) => (
                    <div
                      key={building.id}
                      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <ImageWithFallback
                          src={building.image}
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {building.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {building.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          {building.description}
                        </p>
                        <Button
                          onClick={() => navigate(`/navigator?destination=${encodeURIComponent(building.name)}`)}
                          className="w-full bg-[#00853E] hover:bg-[#006E34] text-white"
                        >
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">
                    No matching building found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}