// Mock location data
const mockLocations = [
  {
    city: "New York",
    state: "NY",
    market: "Existing",
    lead: "John Doe",
    source: "Referral",
    revenue: 1200,
    ebitda: 300,
    ebitdaPercentage: 25,
    revenuePerProvider: 400,
    ev: 3600,
    revenueMultiple: 3,
    ebitdaMultiple: 12,
    equityRollPercentage: 20,
    cashAtClose: 2880,
    debtDrawAmount: 720,
    closeDate: "2023-06-15",
    integrationBurden: "Medium",
    otherKeyDealTerms: "None",
    notesStatus: "In progress",
    datePassedDead: "",
    type: "",
    reason: "",
    logo: "https://example.com/newyork-logo.png",
    managerName: "Alice Johnson",
    managerPhone: "(212) 555-1234",
    managerEmail: "alice@newyorklocation.com"
  },
  {
    city: "Los Angeles",
    state: "CA",
    market: "New",
    lead: "Jane Smith",
    source: "Direct",
    revenue: 900,
    ebitda: 180,
    ebitdaPercentage: 20,
    revenuePerProvider: 300,
    ev: 2250,
    revenueMultiple: 2.5,
    ebitdaMultiple: 12.5,
    equityRollPercentage: 15,
    cashAtClose: 1912.5,
    debtDrawAmount: 337.5,
    closeDate: "2023-07-01",
    integrationBurden: "Low",
    otherKeyDealTerms: "Performance bonus",
    notesStatus: "Due diligence",
    datePassedDead: "",
    type: "",
    reason: "",
    logo: "https://example.com/losangeles-logo.png",
    managerName: "Bob Williams",
    managerPhone: "(310) 555-5678",
    managerEmail: "bob@lalocation.com"
  },
  {
    city: "Chicago",
    state: "IL",
    market: "Existing",
    lead: "Mike Johnson",
    source: "Broker",
    revenue: 1500,
    ebitda: 450,
    ebitdaPercentage: 30,
    revenuePerProvider: 500,
    ev: 5400,
    revenueMultiple: 3.6,
    ebitdaMultiple: 12,
    equityRollPercentage: 25,
    cashAtClose: 4050,
    debtDrawAmount: 1350,
    closeDate: "2023-08-15",
    integrationBurden: "High",
    otherKeyDealTerms: "Earnout clause",
    notesStatus: "Negotiation",
    datePassedDead: "",
    type: "",
    reason: "",
    logo: "https://example.com/chicago-logo.png",
    managerName: "Carol Brown",
    managerPhone: "(312) 555-9012",
    managerEmail: "carol@chicagolocation.com"
  }
];

// Initialize locations in local storage if not present
if (!localStorage.getItem('locations')) {
  localStorage.setItem('locations', JSON.stringify(mockLocations));
}

export const fetchLocations = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  return locations;
};

export const addLocation = async (newLocation) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  locations.push(newLocation);
  localStorage.setItem('locations', JSON.stringify(locations));
  return newLocation;
};

export const updateLocation = async (updatedLocation) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  const index = locations.findIndex(location => location.city === updatedLocation.city && location.state === updatedLocation.state);
  if (index !== -1) {
    locations[index] = updatedLocation;
    localStorage.setItem('locations', JSON.stringify(locations));
    return updatedLocation;
  }
  throw new Error('Location not found');
};

export const deleteLocation = async ({ city, state }) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  const updatedLocations = locations.filter(location => !(location.city === city && location.state === state));
  localStorage.setItem('locations', JSON.stringify(updatedLocations));
  return { success: true };
};