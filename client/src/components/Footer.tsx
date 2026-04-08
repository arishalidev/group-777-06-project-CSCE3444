import { useState } from 'react';
import { X } from 'lucide-react';

export function Footer() {
  const [showCampusMap, setShowCampusMap] = useState(false);

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">RESOURCES</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowCampusMap(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 text-left"
                  >
                    Campus Map PDF
                  </button>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Transportation Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Permit Information
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">SUPPORT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Report an Issue
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Feedback Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">LEGAL</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Campus Safety
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
            © 2026 Campus Navigator. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Campus Map Modal */}
      {showCampusMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">UNT Campus Map</h2>
              <button
                onClick={() => setShowCampusMap(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src="https://transportation.unt.edu/images/081224_parking_map.png"
                alt="UNT Campus Map"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}