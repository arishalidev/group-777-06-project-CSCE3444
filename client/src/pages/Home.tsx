import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const popularDestinations = [
  {
    name: 'University Library',
    description: 'The main academic hub, offering extensive research resources, study spaces, and technology access. Home to various subject-specific collections.',
    image: 'https://library.unt.edu/assets/images/spaces/banners/sycamore.jpg?v=1661541149',
    address: '',
  },
  {
    name: 'Student Union',
    description: 'A vibrant community center with dining options, recreational facilities, and student organization offices. A popular spot for socializing, events, and studying.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.8EwRPI4pTthIiNqFNoQBLwHaFR?rs=1&pid=ImgDetMain&o=7&rm=3',
    address: '1155 Union Circle, Denton, TX 76203',
  },
  {
    name: 'Business Leadership Building',
    description: 'A place to attend class, study, eat, hold group meetings, use a computer lab and network with top business leaders all under one roof!',
    image: 'https://cob.unt.edu/_files/college/_blb.jpg',
    address: '',
  },
  {
    name: 'Science Complex',
    description: 'Houses state-of-the-art science labs for biology, chemistry, and physics. Features research facilities, observation decks, and interactive learning spaces.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.hXrK3vFcoKZhGuAHpMWaMwHaEz?rs=1&pid=ImgDetMain&o=7&rm=3',
    address: '1511 W Sycamore St, Denton, TX 76201',
  },
  {
    name: 'Arts & Humanities Building',
    description: 'Home to creative studios, performance spaces, and seminar rooms for arts, literature, and philosophy. A nurturing environment for artistic expression.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.oxcWdUgT-tL2DMTnM4kjRQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    address: '',
  },
  {
    name: 'DATCU Stadium',
    description: 'Home to the University of North Texas Mean Green football team, watch them play and take on other teams!',
    image: 'https://northtexan.unt.edu/sites/default/files/23-0502_datcu-stadium_0060_banner.jpg',
    address: '',
  },
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Your Way on Campus</h1>
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Search for buildings or rooms (e.g., 'Library', 'Room 201')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12 text-base"
              />
              <Button
                onClick={handleSearch}
                className="bg-[#00853E] hover:bg-[#006E34] text-white px-8 h-12"
              >
                <Search className="size-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Campus Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((destination) => (
                <div
                  key={destination.name}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{destination.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                    <Button
                      onClick={() => {
                        const params = new URLSearchParams({
                          destination: destination.name,
                          ...(destination.address && { address: destination.address })
                        });
                        navigate(`/navigator?${params.toString()}`);
                      }}
                      variant="outline"
                      className="w-full bg-[#DFF5E1] hover:bg-[#c8e6ca] text-[#00853E] border-[#DFF5E1]"
                    >
                      Navigate
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}