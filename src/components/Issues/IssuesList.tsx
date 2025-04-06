import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Issue, IssueCategory, IssueStatus, IssuePriority } from "@/types";
import IssueCard from "./IssueCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryOptions, statusOptions, priorityOptions } from "@/data/mockData";
import { indianStates, districtsByState, citiesByDistrict, villagesByDistrict } from "@/data/indiaLocations";
import { IndianState } from "@/types/location";
import { MapPin } from "lucide-react";
import { onValue, ref, get } from "firebase/database"; // Add Firebase imports
import { db } from "@/lib/utils"; // Import Firebase db

const IssuesList = ({ issues: propIssues }: { issues?: Issue[] }) => {
  const [issues, setIssues] = useState<Issue[]>(propIssues || []);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | IssueCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IssueStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | IssuePriority>("all");
  const [stateFilter, setStateFilter] = useState<"all" | IndianState>("all");
  const [districtFilter, setDistrictFilter] = useState<"all" | string>("all");
  const [cityFilter, setCityFilter] = useState<"all" | string>("all");
  const [villageFilter, setVillageFilter] = useState<"all" | string>("all");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch issues from Firebase on component mount
  useEffect(() => {
    if (!propIssues) {
      const fetchIssues = async () => {
        setLoading(true);
        
        try {
          // Get the Firebase issues
          const issuesRef = ref(db, "issues");
          
          if (!db) {
            throw new Error("Firebase database is not initialized");
          }
          
          const snapshot = await get(issuesRef);
          let formattedIssues: Issue[] = [];
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            
            formattedIssues = Object.entries(data).map(([id, issueData]: [string, any]) => {
              // Extract location data
              const location = issueData.location || '';
              
              // Convert to valid IndianState type
              let state: IndianState = "Unknown";
              if (location.includes("Maharashtra") || location.toLowerCase().includes("maharashtra")) {
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
                upvotes: issueData.upvotes || 0,
                comments: []
              };
            });
          }
          
          // Only set real data from Firebase, don't include mock data
          setIssues(formattedIssues);
        } catch (error) {
          console.error('Error fetching issues:', error);
          // Show an empty list if there's an error
          setIssues([]);
        } finally {
          setLoading(false);
        }
      };

      fetchIssues();
    }
  }, [propIssues]);

  // Add a real-time listener for upvotes changes in Firebase
  useEffect(() => {
    // Only set up listeners if issues are loaded and db is initialized
    if (issues.length === 0 || loading || !db) return;
    
    // Get all Firebase issue IDs
    const firebaseIssueIds = issues.map(issue => issue.id);
    
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
      }, (error) => {
        console.error(`Error listening to upvotes for issue ${issueId}:`, error);
      });
    });
    
    // Clean up listeners on unmount
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe && unsubscribe());
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

  // Apply all filters
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    const matchesState = stateFilter === "all" || issue.location.state === stateFilter;
    const matchesDistrict = districtFilter === "all" || issue.location.district === districtFilter;
    const matchesCity = cityFilter === "all" || issue.location.city === cityFilter;
    const matchesVillage = villageFilter === "all" || issue.location.village === villageFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority &&
           matchesState && matchesDistrict && matchesCity && matchesVillage;
  });

  // Navigate to issue details
  const handleIssueClick = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search filter */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Issues</Label>
          <Input
            id="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as "all" | IssueCategory)}
          >
            <SelectTrigger>
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
        
        {/* Status filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | IssueStatus)}
          >
            <SelectTrigger>
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
        
        {/* Priority filter */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as "all" | IssuePriority)}
          >
            <SelectTrigger>
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
      </div>
      
      {/* Location filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            State
          </Label>
          <Select
            value={stateFilter}
            onValueChange={(value) => setStateFilter(value as "all" | IndianState)}
          >
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <Label>District</Label>
          <Select
            value={districtFilter}
            onValueChange={setDistrictFilter}
            disabled={stateFilter === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Districts" />
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
        
        <div className="space-y-2">
          <Label>City</Label>
          <Select
            value={cityFilter}
            onValueChange={setCityFilter}
            disabled={districtFilter === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
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
        
        <div className="space-y-2">
          <Label>Village</Label>
          <Select
            value={villageFilter}
            onValueChange={setVillageFilter}
            disabled={districtFilter === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Villages" />
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
      
      {/* Results section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[300px] animate-pulse" />
          ))
        ) : filteredIssues.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No issues found matching your filters. Try adjusting your search criteria.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} onClick={() => handleIssueClick(issue.id)}>
              <IssueCard issue={issue} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesList;
