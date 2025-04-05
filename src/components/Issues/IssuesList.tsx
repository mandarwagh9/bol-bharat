import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Issue, IssueCategory, IssueStatus, IssuePriority } from "@/types";
import IssueCard from "./IssueCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryOptions, statusOptions, priorityOptions, mockIssues } from "@/data/mockData";
import { indianStates, districtsByState, citiesByDistrict, villagesByDistrict } from "@/data/indiaLocations";
import { IndianState } from "@/types/location";
import { MapPin } from "lucide-react";
import { onValue, ref } from "firebase/database"; // Add Firebase imports
import { db } from "@/lib/utils"; // Import Firebase db

const IssuesList = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "upvotes">("newest");

  // Location filters
  const [stateFilter, setStateFilter] = useState<IndianState | "all">("all");
  const [districtFilter, setDistrictFilter] = useState<string | "all">("all");
  const [cityFilter, setCityFilter] = useState<string | "all">("all");
  const [villageFilter, setVillageFilter] = useState<string | "all">("all");
  
  // Available districts based on selected state
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Fetch real data from Firebase
        const response = await fetch('https://bolbharat-a24dc-default-rtdb.firebaseio.com/issues.json');
        const data = await response.json();
        
        // Process real data
        let formattedIssues: Issue[] = [];
        if (data) {
          formattedIssues = Object.entries(data).map(([id, issueData]: [string, any]) => {
            // Determine state based on location string
            let state: IndianState = "Unknown";
            const location = issueData.location || '';
            
            if (location.includes("Baramati") || location.includes("Pune")) {
              state = "Maharashtra";
            } else if (location.includes("Mumbai")) {
              state = "Maharashtra";
            }
            
            // Convert Firebase format to our app format
            return {
              id,
              title: issueData.title || '',
              description: issueData.description || '',
              category: issueData.category || 'other',
              status: issueData.status || 'reported',
              priority: issueData.priority || 'medium',
              location: {
                lat: 0,
                lng: 0,
                address: location,
                state: state,
                district: location.includes("Baramati") ? "Pune" : 
                         location.includes("Pune") ? "Pune" : 
                         location.includes("Mumbai") ? "Mumbai" : "",
                city: location.includes("Baramati") ? "Baramati" : 
                      location.includes("Pune") ? "Pune" : 
                      location.includes("Mumbai") ? "Mumbai" : "",
                village: ""
              },
              reportedBy: 'user1',
              reportedAt: new Date(issueData.timestamp || Date.now()),
              images: issueData.image ? [issueData.image] : [],
              duration: issueData.duration || '',
              upvotes: issueData.upvotes || 0, // Make sure to get upvotes from Firebase
              comments: []
            };
          });
        }
        
        // Add mock data to the list
        const combinedIssues = [...formattedIssues, ...mockIssues];
        setIssues(combinedIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
        // If fetch fails, at least show mock data
        setIssues(mockIssues);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Add a real-time listener for upvotes changes in Firebase
  useEffect(() => {
    // Only set up listeners if issues are loaded
    if (issues.length === 0 || loading) return;
    
    // Get all Firebase issue IDs (not mock issues)
    const firebaseIssueIds = issues
      .filter(issue => !mockIssues.some(mockIssue => mockIssue.id === issue.id))
      .map(issue => issue.id);
    
    // Set up listeners for each Firebase issue
    const unsubscribers = firebaseIssueIds.map(issueId => {
      const upvotesRef = ref(db, `issues/${issueId}/upvotes`);
      
      return onValue(upvotesRef, (snapshot) => {
        const newUpvotes = snapshot.val() || 0;
        
        // Update the specific issue's upvotes
        setIssues(prevIssues => 
          prevIssues.map(issue => 
            issue.id === issueId ? { ...issue, upvotes: newUpvotes } : issue
          )
        );
      });
    });
    
    // Clean up listeners on unmount
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [issues, loading]);

  // Update available districts when state changes
  useEffect(() => {
    if (stateFilter !== "all") {
      setAvailableDistricts(districtsByState[stateFilter] || []);
      setDistrictFilter("all");
      setCityFilter("all");
      setVillageFilter("all");
    } else {
      setAvailableDistricts([]);
      setDistrictFilter("all");
    }
  }, [stateFilter]);

  // Update available cities when district changes
  useEffect(() => {
    if (districtFilter !== "all") {
      setAvailableCities(citiesByDistrict[districtFilter] || []);
      setCityFilter("all");
      setVillageFilter("all");
    } else {
      setAvailableCities([]);
      setCityFilter("all");
    }
  }, [districtFilter]);

  // Update available villages when district changes
  useEffect(() => {
    if (districtFilter !== "all") {
      setAvailableVillages(villagesByDistrict[districtFilter] || []);
      setVillageFilter("all");
    } else {
      setAvailableVillages([]);
      setVillageFilter("all");
    }
  }, [districtFilter]);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    
    // Location filtering
    const matchesState = stateFilter === "all" || issue.location.state === stateFilter;
    const matchesDistrict = districtFilter === "all" || issue.location.district === districtFilter;
    const matchesCity = cityFilter === "all" || issue.location.city === cityFilter;
    const matchesVillage = villageFilter === "all" || issue.location.village === villageFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && 
           matchesState && matchesDistrict && matchesCity && matchesVillage;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  const handleIssueClick = (id: string) => {
    const issueExists = issues.some((issue) => issue.id === id);
    if (!issueExists) {
      alert('The issue has been deleted.');
    } else {
      navigate(`/issues/${id}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading issues...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 lg:col-span-4">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as IssueCategory | "all")}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as IssueStatus | "all")}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as IssuePriority | "all")}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "upvotes")}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="upvotes">Most Upvotes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Location filters section */}
      <div className="bg-[#FFF5E6] p-4 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-5 w-5 text-[#FF7722] mr-2" />
          <h3 className="text-lg font-semibold text-[#1E3A4F]">Location Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={stateFilter}
              onValueChange={(value) => setStateFilter(value as IndianState | "all")}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="district">District</Label>
            <Select
              value={districtFilter}
              onValueChange={(value) => setDistrictFilter(value)}
              disabled={stateFilter === "all"}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder={stateFilter === "all" ? "Select State First" : "All Districts"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Select
              value={cityFilter}
              onValueChange={(value) => setCityFilter(value)}
              disabled={districtFilter === "all" || availableCities.length === 0}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder={districtFilter === "all" ? "Select District First" : "All Cities"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="village">Village</Label>
            <Select
              value={villageFilter}
              onValueChange={(value) => setVillageFilter(value)}
              disabled={districtFilter === "all" || availableVillages.length === 0}
            >
              <SelectTrigger id="village">
                <SelectValue placeholder={districtFilter === "all" ? "Select District First" : "All Villages"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {availableVillages.map((village) => (
                  <SelectItem key={village} value={village}>
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {sortedIssues.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">No issues found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIssues.map((issue) => (
            <div key={issue.id} onClick={() => handleIssueClick(issue.id)}>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesList;
