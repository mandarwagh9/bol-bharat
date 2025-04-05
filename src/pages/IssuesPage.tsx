
import PageLayout from "@/components/Layout/PageLayout";
import IssuesList from "@/components/Issues/IssuesList";
import { mockIssues } from "@/data/mockData";
import { Megaphone } from "lucide-react";

const IssuesPage = () => {
  return (
    <PageLayout>
      <div className="civic-container py-8">
        <div className="mb-8 bg-gradient-to-r from-[#FF7722] to-[#FF9F5A] p-8 rounded-lg text-white">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white rounded-full p-3">
              <img 
                src="/lovable-uploads/8316e3e4-2d31-4954-9239-ca4fa46be0cc.png" 
                alt="BOL BHARAT Logo" 
                className="h-16 w-16" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Issues - BOL BHARAT</h1>
              <p className="text-white/90">
                Browse, filter, and find the latest reported issues in your local area. Use the location filters to narrow down issues in your state, district, city, or village.
              </p>
            </div>
          </div>
        </div>
        
        <IssuesList issues={mockIssues} />
      </div>
    </PageLayout>
  );
};

export default IssuesPage;
