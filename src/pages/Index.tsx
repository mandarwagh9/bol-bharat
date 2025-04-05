import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/Layout/PageLayout";
import IssueCard from "@/components/Issues/IssueCard";
import { fetchIssues } from "@/data/mockData";
import { MapPin, Camera, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Issue } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIssues = async () => {
      try {
        setLoading(true);
        const fetchedIssues = await fetchIssues();
        
        // Convert fetched issues to match our Issue type
        const formattedIssues = fetchedIssues.map((issue: any, index: number) => {
          const id = issue.id || Object.keys(fetchedIssues)[index];
          return {
            id: id,
            title: issue.title,
            description: issue.description,
            category: issue.category,
            status: issue.status || "reported", // Default status
            priority: issue.priority || "medium", // Default priority
            location: {
              lat: 0, // Default coordinates
              lng: 0,
              address: issue.location
            },
            reportedBy: issue.reportedBy || "anonymous",
            reportedAt: new Date(issue.timestamp || Date.now()),
            // Fix image paths by removing the leading slash
            images: issue.image ? [issue.image] : ["placeholder.svg"],
            duration: issue.duration || "Unknown",
            upvotes: issue.upvotes || 0,
            comments: []
          };
        });
        
        setIssues(formattedIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getIssues();
  }, []);

  // Get 3 recent issues for the preview section
  const recentIssues = [...issues].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  ).slice(0, 3);

  return (
    <PageLayout className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF7722] to-[#FF7722] text-white py-16 md:py-24">
        <div className="civic-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Report Civic Issues & Improve Your Community
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Help your local government identify and resolve issues faster with our easy-to-use reporting platform.
              </p>
              {/* Ensure buttons are visible and styled correctly */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-civic-blue hover:bg-white/90 shadow-md font-bold">
                  <Link to="/report" className="w-full">Report an Issue</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/logo-hindi.png" alt="Community reporting" className="w-full max-w-lg mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="civic-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Report civic issues in three simple steps and help make your community better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-civic-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-civic-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Take a Photo</h3>
                <p className="text-gray-600">
                  Capture the issue with your device's camera to provide visual context.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-civic-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-civic-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Location</h3>
                <p className="text-gray-600">
                  Provide the location details so officials can find and fix the issue.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-civic-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-civic-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Submit Report</h3>
                <p className="text-gray-600">
                  Add details and submit your report. Track progress as it's addressed.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-civic-blue hover:bg-civic-blue/90 font-bold shadow-md">
              <Link to="/report" className="px-6">Report an Issue Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="py-16">
        <div className="civic-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Reports</h2>
            <Button asChild variant="outline" className="group border-civic-blue text-civic-blue hover:bg-civic-blue/10">
              <Link to="/issues" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No issues reported yet. Be the first to report an issue!</p>
                <Button asChild className="mt-4 bg-civic-blue hover:bg-civic-blue/90">
                  <Link to="/report">Report an Issue</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-civic-dark py-16 text-white">
        <div className="civic-container text-center">
          <h2 className="text-3xl font-bold mb-4">Make Your Voice Heard</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Together we can build better communities. Start reporting issues today.
          </p>
          <Button asChild size="lg" className="bg-civic-teal hover:bg-civic-teal/90">
            <Link to="/report">Report an Issue</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
