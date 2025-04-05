
import { useState, useEffect } from "react";
import { Issue, IssueCategory, IssueStatus, IssuePriority } from "@/types";
import IssueCard from "./IssueCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryOptions, statusOptions, priorityOptions } from "@/data/mockData";
import { indianStates, districtsByState, citiesByDistrict, villagesByDistrict } from "@/data/indiaLocations";
import { IndianState } from "@/types/location";
import { MapPin } from "lucide-react";

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList = ({ issues }: IssuesListProps) => {
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
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesList;
