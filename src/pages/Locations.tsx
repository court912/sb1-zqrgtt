import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLocations, deleteLocation } from '../api/locations';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, Plus, Edit, Trash, Filter } from 'lucide-react';

type GroupByOption = 'none' | 'type' | 'state' | 'notesStatus';

const Locations: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByOption>(() => {
    const savedGroupBy = localStorage.getItem('locationGroupBy');
    return (savedGroupBy as GroupByOption) || 'none';
  });

  const queryClient = useQueryClient();

  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  useEffect(() => {
    localStorage.setItem('locationGroupBy', groupBy);
  }, [groupBy]);

  const sortedLocations = useMemo(() => {
    if (!locations) return [];
    let sortableItems = [...locations];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [locations, sortConfig]);

  const filteredAndGroupedLocations = useMemo(() => {
    let filtered = sortedLocations.filter(location =>
      Object.entries(location).some(([key, value]) => 
        key !== 'documents' && 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (groupBy === 'none') {
      return { 'All Locations': filtered };
    }

    return filtered.reduce((groups, location) => {
      const key = location[groupBy] || 'Unspecified';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(location);
      return groups;
    }, {});
  }, [sortedLocations, searchTerm, groupBy]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    }
    return null;
  };

  const handleDelete = (city: string, state: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteMutation.mutate({ city, state });
    }
  };

  const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupBy(e.target.value as GroupByOption);
  };

  if (isLoading) return <div>Loading locations...</div>;
  if (error) return <div>Error loading locations</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Locations</h1>
        <Link
          to="/locations/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Location
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gray-400" />
          <select
            value={groupBy}
            onChange={handleGroupByChange}
            className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">No Grouping</option>
            <option value="type">Group by Type</option>
            <option value="state">Group by State</option>
            <option value="notesStatus">Group by Status</option>
          </select>
        </div>
      </div>
      {Object.entries(filteredAndGroupedLocations).map(([group, groupLocations]) => (
        <div key={group} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{group}</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {locations && locations.length > 0 && Object.keys(locations[0]).filter(key => key !== 'documents').map((key) => (
                    <th
                      key={key}
                      onClick={() => requestSort(key)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{key}</span>
                        <SortIcon columnKey={key} />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupLocations.map((location, index) => (
                  <tr key={index}>
                    {Object.entries(location).filter(([key]) => key !== 'documents').map(([key, value]) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value?.toString()}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/locations/${location.city}/${location.state}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button onClick={() => handleDelete(location.city, location.state)} className="text-red-600 hover:text-red-900">
                        <Trash className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Locations;