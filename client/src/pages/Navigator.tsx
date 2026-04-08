import { useState, useEffect } from 'react';
import { MapPin, Navigation as NavigationIcon, X, Clock, AlertTriangle, Phone } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Label } from '../components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '../components/ui/radio-group';

export function Navigator() {
  const [searchParams] = useSearchParams();
  const [startLocation, setStartLocation] = useState('Student Union Building');
  const [destination, setDestination] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [transportMode, setTransportMode] = useState('walking');
  const [showDirections, setShowDirections] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eta, setEta] = useState('');
  const [weatherWarning, setWeatherWarning] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  // FR-08: Pre-fill destination from search results
  useEffect(() => {
    const dest = searchParams.get('destination');
    const addr = searchParams.get('address');
    if (dest) {
      setDestination(dest);
    }
    if (addr) {
      setDestinationAddress(addr);
    }
  }, [searchParams]);

  const directions = [
    'Enter from entrance 2, nearest parking lot',
    'Walk straight, past the library sign until you see the E wing',
    'Turn right past the water fountains',
    'Continue until you see the room on the left.',
  ];

  // FR-14: Calculate ETA based on transport mode
  const calculateETA = () => {
    const baseMinutes = 15;
    let minutes = baseMinutes;
    
    if (transportMode === 'walking') {
      minutes = baseMinutes;
    } else if (transportMode === 'biking') {
      minutes = Math.floor(baseMinutes / 2);
    } else if (transportMode === 'driving') {
      minutes = Math.floor(baseMinutes / 3);
    }
    
    setEta(`${minutes} min`);
    return minutes;
  };

  // FR-03: Check weather conditions
  const checkWeather = () => {
    // Mock weather check - in real app would use weather API
    const random = Math.random();
    setWeatherWarning(random > 0.7); // 30% chance of weather warning
  };

  // UC-01: Route confirmation before navigation
  const handleConfirmRoute = () => {
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    
    calculateETA();
    checkWeather();
    setShowConfirmation(true);
  };

  const handleStartNavigation = () => {
    setShowDirections(true);
    setShowConfirmation(false);
  };

  const handleClearNavigation = () => {
    setStartLocation('');
    setDestination('');
    setRoomNumber('');
    setShowDirections(false);
    setShowConfirmation(false);
    setWeatherWarning(false);
  };

  // FR-13: Report emergency to UNT police
  const handleEmergencyReport = () => {
    setShowReportDialog(true);
  };

  const submitEmergencyReport = () => {
    alert('Emergency reported to UNT Police. Help is on the way. Stay safe!');
    setShowReportDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Left Sidebar - Navigation Controls */}
            <aside className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Navigation</h2>

                {/* Start Location */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="size-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Start Location</label>
                  </div>
                  <Input
                    type="text"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="Student Union Building"
                    className="w-full"
                  />
                </div>

                {/* Destination */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <NavigationIcon className="size-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Destination</label>
                  </div>
                  <Input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Engineering Hall Room 301"
                    className="w-full"
                  />
                </div>

                {/* Room Number */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <NavigationIcon className="size-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Room Number</label>
                  </div>
                  <Input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="301"
                    className="w-full"
                  />
                </div>

                {/* Transport Mode */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Transport Mode</Label>
                  <RadioGroup
                    value={transportMode}
                    onValueChange={setTransportMode}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="walking" id="walking" />
                      <Label htmlFor="walking" className="text-sm cursor-pointer">Walking</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="biking" id="biking" />
                      <Label htmlFor="biking" className="text-sm cursor-pointer">Biking</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="driving" id="driving" />
                      <Label htmlFor="driving" className="text-sm cursor-pointer">Driving</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <Button
                    onClick={handleConfirmRoute}
                    className="flex-1 bg-[#00853E] hover:bg-[#006E34] text-white"
                  >
                    Start Navigation
                  </Button>
                  <Button
                    onClick={handleClearNavigation}
                    variant="outline"
                    className="flex-1 bg-[#F2C94C] hover:bg-[#e0b840] text-[#1B4F72] border-[#F2C94C]"
                  >
                    Clear Navigation
                  </Button>
                </div>

                {/* Directions */}
                {showDirections && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Turn-by-turn Directions</h3>
                    <ol className="space-y-3">
                      {directions.map((direction, index) => (
                        <li key={index} className="text-sm text-gray-600 flex gap-2">
                          <span className="font-semibold text-blue-600">{index + 1}.</span>
                          <span>{direction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content - Navigation View */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
              {showDirections ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Navigating to {destination}
                      </h2>
                      <p className="text-gray-600">From {startLocation}</p>
                    </div>
                    {/* FR-13: Emergency Report Button */}
                    <Button
                      onClick={handleEmergencyReport}
                      variant="outline"
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                    >
                      <Phone className="size-4 mr-2" />
                      Report Emergency
                    </Button>
                  </div>

                  {/* FR-14: ETA Display */}
                  {eta && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <Clock className="size-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estimated Time of Arrival</p>
                        <p className="text-lg font-bold text-green-600">{eta}</p>
                      </div>
                    </div>
                  )}

                  {/* FR-03: Weather Warning */}
                  {weatherWarning && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Weather Advisory</p>
                        <p className="text-sm text-amber-800">High UV index detected. Please wear sunscreen and stay hydrated during your journey.</p>
                      </div>
                    </div>
                  )}

                  {/* FR-15: Room Information */}
                  {roomNumber && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">Room Information</p>
                      <p className="text-sm text-gray-700">Room {roomNumber} is located on Floor {Math.floor(parseInt(roomNumber) / 100) || 1}</p>
                    </div>
                  )}

                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1667273704848-32df02bd29f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGlicmFyeSUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzcyODE2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Navigation guidance"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <div className="bg-teal-600 text-white px-4 py-2 rounded-lg inline-block">
                      <h3 className="text-lg font-semibold">Discovery Park Library</h3>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-full p-3">
                        <NavigationIcon className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Next Step</h3>
                        <p className="text-gray-700">{directions[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : showConfirmation ? (
                /* UC-01: Route Confirmation Preview */
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Confirm Your Route
                    </h2>
                    <p className="text-gray-600">Please review your navigation details</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">From</p>
                        <p className="text-lg font-semibold text-gray-900">{startLocation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">To</p>
                        <p className="text-lg font-semibold text-gray-900">{destination}</p>
                        {destinationAddress && (
                          <p className="text-sm text-gray-600 mt-1">{destinationAddress}</p>
                        )}
                      </div>
                    </div>

                    {roomNumber && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Room Number</p>
                        <p className="text-lg font-semibold text-gray-900">{roomNumber}</p>
                        <p className="text-sm text-gray-600 mt-1">Located on Floor {Math.floor(parseInt(roomNumber) / 100) || 1}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-500">Transport Mode</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{transportMode}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-center gap-3">
                        <Clock className="size-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                          <p className="text-xl font-bold text-green-600">{eta}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Warning in Confirmation */}
                  {weatherWarning && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Weather Advisory</p>
                        <p className="text-sm text-amber-800">Severe weather conditions detected. Please proceed with caution.</p>
                        <p className="text-xs text-amber-700 mt-1">High UV index. Wear sunscreen and stay hydrated.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartNavigation}
                      className="flex-1 bg-[#00853E] hover:bg-[#006E34] text-white"
                    >
                      Confirm & Start Navigation
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      className="flex-1 bg-[#DFF5E1] hover:bg-[#c8e6ca] text-[#00853E] border-[#DFF5E1]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <MapPin className="size-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Navigation images will appear here
                  </h3>
                  <p className="text-gray-600">
                    Enter your start location and destination, then click "Start Navigation" to begin your journey!
                  </p>
                </div>
              )}

              {/* FR-13: Emergency Report Dialog */}
              {showReportDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Report Emergency</h3>
                        <p className="text-sm text-gray-600 mt-1">Contact UNT Police</p>
                      </div>
                      <button
                        onClick={() => setShowReportDialog(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-900">Emergency Contact</p>
                        <p className="text-lg font-bold text-red-600 mt-1">UNT Police: 940-565-3000</p>
                        <p className="text-xs text-red-700 mt-2">Your current location will be shared</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Description (Optional)</Label>
                        <textarea
                          className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                          rows={4}
                          placeholder="Describe the emergency..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={submitEmergencyReport}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Phone className="size-4 mr-2" />
                          Send Alert
                        </Button>
                        <Button
                          onClick={() => setShowReportDialog(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
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