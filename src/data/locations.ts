export interface Location {
  country: string;
  states: {
    name: string;
    cities: string[];
  }[];
}

export const LOCATIONS: Location[] = [
  {
    country: 'United Arab Emirates',
    states: [
      { name: 'Dubai', cities: ['Dubai', 'Jebel Ali', 'Hatta', 'Al Qusais', 'Deira'] },
      { name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Madinat Zayed', 'Ruwais'] },
      { name: 'Sharjah', cities: ['Sharjah', 'Khor Fakkan', 'Dibba Al-Hisn'] },
      { name: 'Ajman', cities: ['Ajman'] },
      { name: 'Ras Al Khaimah', cities: ['Ras Al Khaimah', 'Al Jazirah Al Hamra'] },
      { name: 'Fujairah', cities: ['Fujairah', 'Dibba Al-Fujairah'] },
      { name: 'Umm Al Quwain', cities: ['Umm Al Quwain'] }
    ]
  },
  {
    country: 'India',
    states: [
      { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'] },
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
      { name: 'Delhi', cities: ['New Delhi', 'Central Delhi', 'South Delhi'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
      { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad'] },
      { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] }
    ]
  },
  {
    country: 'United Kingdom',
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] },
      { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn'] }
    ]
  },
  {
    country: 'Saudi Arabia',
    states: [
      { name: 'Riyadh', cities: ['Riyadh', 'Al Kharj', 'Al Muzahmiyah'] },
      { name: 'Makkah', cities: ['Jeddah', 'Makkah', 'Taif'] },
      { name: 'Ash Sharqiyah', cities: ['Dammam', 'Al Khobar', 'Jubail'] },
      { name: 'Al Madinah', cities: ['Madinah', 'Yanbu'] }
    ]
  },
  {
    country: 'Qatar',
    states: [
      { name: 'Doha', cities: ['Doha', 'Al Rayyan', 'Al Wakrah'] },
      { name: 'Al Khor', cities: ['Al Khor', 'Al Thakhira'] }
    ]
  },
  {
    country: 'Oman',
    states: [
      { name: 'Muscat', cities: ['Muscat', 'Seeb', 'Sohar'] },
      { name: 'Dhofar', cities: ['Salalah', 'Mirbat'] }
    ]
  },
  {
    country: 'Kuwait',
    states: [
      { name: 'Kuwait', cities: ['Kuwait City', 'Al Farwaniyah', 'Hawalli'] },
      { name: 'Jahra', cities: ['Jahra', 'Wafra'] }
    ]
  },
  {
    country: 'Bahrain',
    states: [
      { name: 'Capital', cities: ['Manama', 'Juffair', 'Sanabis'] },
      { name: 'Muharraq', cities: ['Muharraq', 'Al Hadd'] }
    ]
  },
  {
    country: 'United States',
    states: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio'] },
      { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'] }
    ]
  },
  {
    country: 'Singapore',
    states: [
      { name: 'Singapore', cities: ['Singapore', 'Jurong', 'Woodlands', 'Tampines'] }
    ]
  },
  {
    country: 'Australia',
    states: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast'] }
    ]
  }
];

export const DEFAULT_COUNTRY = 'United Arab Emirates';
export const DEFAULT_STATE = 'Dubai';
export const DEFAULT_CITY = 'Dubai';
export const DEFAULT_NATIONALITY = 'Indian';
export const DEFAULT_MOBILE_PREFIX = '+971';

export function getStatesForCountry(country: string): { name: string; cities: string[] }[] {
  const location = LOCATIONS.find(l => l.country === country);
  return location?.states || [];
}

export function getCitiesForState(country: string, state: string): string[] {
  const location = LOCATIONS.find(l => l.country === country);
  const stateData = location?.states.find(s => s.name === state);
  return stateData?.cities || [];
}
