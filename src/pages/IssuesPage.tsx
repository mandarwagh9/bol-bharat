
import PageLayout from "@/components/Layout/PageLayout";
import IssuesList from "@/components/Issues/IssuesList";
import { mockIssues } from "@/data/mockData";

const IssuesPage = () => {
  return (
    <PageLayout>
      <div className="civic-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Issues - BOL BHARAT</h1>
          <p className="text-gray-600">
            Browse, filter, and find the latest reported issues in your community.
          </p>
        </div>
        
        <IssuesList issues={mockIssues} />
      </div>
    </PageLayout>
  );
};

export default IssuesPage;
