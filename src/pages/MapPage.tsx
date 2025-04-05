
import PageLayout from "@/components/Layout/PageLayout";
import { Card } from "@/components/ui/card";
import { mockIssues } from "@/data/mockData";

const MapPage = () => {
  return (
    <PageLayout>
      <div className="civic-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Issue Map</h1>
          <p className="text-gray-600">
            View all reported issues on the map to see what's happening in your area.
          </p>
        </div>
        
        <Card className="p-4 rounded-lg shadow-md border border-gray-200">
          {/* Placeholder for map component */}
          <div className="bg-gray-100 w-full h-[600px] rounded flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-2">Map View Coming Soon</h3>
              <p className="text-gray-600">
                In a future update, this area will display an interactive map showing all reported issues in your community.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MapPage;
