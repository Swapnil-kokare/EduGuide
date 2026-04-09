export interface StudentProfile {
  name: string;
  category: string;
  examType: "MHT-CET" | "JEE";
  score: number;
  percentile: number;
  preferredBranches: string[];
  preferredLocation: string;
  collegeType: string;
}

export interface CollegeResult {
  id: number | string;
  name: string;
  location: string;
  branch: string;
  cutoff: number;
  matchPercent: number;
  type: string;
  rating: number;
  matchBand?: string;
}

export interface CategoryOption {
  label: string;
  apiValue: "OPEN" | "EWS" | "OBC" | "DT_VJ" | "NT1" | "NT2" | "NT3" | "SBC" | "SEBC" | "SC" | "ST";
}

const collegeData: Omit<CollegeResult, "matchPercent">[] = [
  // COEP Pune
  { id: 1, name: "COEP Technological University", location: "Pune", branch: "Computer Engineering", cutoff: 99.2, type: "Government", rating: 4.8 },
  { id: 2, name: "COEP Technological University", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 96.0, type: "Government", rating: 4.6 },
  { id: 3, name: "COEP Technological University", location: "Pune", branch: "Mechanical Engineering", cutoff: 93.5, type: "Government", rating: 4.5 },
  { id: 4, name: "COEP Technological University", location: "Pune", branch: "Electrical Engineering", cutoff: 92.0, type: "Government", rating: 4.4 },
  { id: 5, name: "COEP Technological University", location: "Pune", branch: "Civil Engineering", cutoff: 88.0, type: "Government", rating: 4.2 },
  { id: 6, name: "COEP Technological University", location: "Pune", branch: "Information Technology", cutoff: 97.5, type: "Government", rating: 4.7 },

  // VJTI Mumbai
  { id: 7, name: "VJTI Mumbai", location: "Mumbai", branch: "Computer Engineering", cutoff: 98.8, type: "Government", rating: 4.7 },
  { id: 8, name: "VJTI Mumbai", location: "Mumbai", branch: "Electronics Engineering", cutoff: 95.5, type: "Government", rating: 4.5 },
  { id: 9, name: "VJTI Mumbai", location: "Mumbai", branch: "Information Technology", cutoff: 96.8, type: "Government", rating: 4.6 },
  { id: 10, name: "VJTI Mumbai", location: "Mumbai", branch: "Mechanical Engineering", cutoff: 92.0, type: "Government", rating: 4.4 },
  { id: 11, name: "VJTI Mumbai", location: "Mumbai", branch: "Electrical Engineering", cutoff: 91.0, type: "Government", rating: 4.3 },
  { id: 12, name: "VJTI Mumbai", location: "Mumbai", branch: "Civil Engineering", cutoff: 86.0, type: "Government", rating: 4.1 },

  // Walchand Sangli
  { id: 13, name: "Walchand College of Engineering", location: "Sangli", branch: "Computer Engineering", cutoff: 97.5, type: "Government", rating: 4.5 },
  { id: 14, name: "Walchand College of Engineering", location: "Sangli", branch: "Computer Science", cutoff: 96.0, type: "Government", rating: 4.4 },
  { id: 15, name: "Walchand College of Engineering", location: "Sangli", branch: "Electronics & Telecommunication", cutoff: 91.0, type: "Government", rating: 4.2 },
  { id: 16, name: "Walchand College of Engineering", location: "Sangli", branch: "Mechanical Engineering", cutoff: 90.0, type: "Government", rating: 4.3 },
  { id: 17, name: "Walchand College of Engineering", location: "Sangli", branch: "Electrical Engineering", cutoff: 87.0, type: "Government", rating: 4.1 },
  { id: 18, name: "Walchand College of Engineering", location: "Sangli", branch: "Civil Engineering", cutoff: 82.0, type: "Government", rating: 3.9 },

  // GCE Aurangabad
  { id: 19, name: "Government College of Engineering", location: "Aurangabad", branch: "Computer Engineering", cutoff: 95.0, type: "Government", rating: 4.2 },
  { id: 20, name: "Government College of Engineering", location: "Aurangabad", branch: "Computer Science", cutoff: 93.5, type: "Government", rating: 4.1 },
  { id: 21, name: "Government College of Engineering", location: "Aurangabad", branch: "Mechanical Engineering", cutoff: 86.0, type: "Government", rating: 4.0 },
  { id: 22, name: "Government College of Engineering", location: "Aurangabad", branch: "Electrical Engineering", cutoff: 84.0, type: "Government", rating: 3.9 },
  { id: 23, name: "Government College of Engineering", location: "Aurangabad", branch: "Civil Engineering", cutoff: 78.0, type: "Government", rating: 3.8 },

  // PICT Pune
  { id: 24, name: "Pune Institute of Computer Technology", location: "Pune", branch: "Computer Engineering", cutoff: 96.5, type: "Private", rating: 4.4 },
  { id: 25, name: "Pune Institute of Computer Technology", location: "Pune", branch: "Information Technology", cutoff: 94.0, type: "Private", rating: 4.3 },
  { id: 26, name: "Pune Institute of Computer Technology", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 89.0, type: "Private", rating: 4.1 },

  // VIT Pune
  { id: 27, name: "Vishwakarma Institute of Technology", location: "Pune", branch: "Computer Engineering", cutoff: 93.0, type: "Private", rating: 4.1 },
  { id: 28, name: "Vishwakarma Institute of Technology", location: "Pune", branch: "Information Technology", cutoff: 90.0, type: "Private", rating: 4.0 },
  { id: 29, name: "Vishwakarma Institute of Technology", location: "Pune", branch: "Artificial Intelligence", cutoff: 91.5, type: "Private", rating: 4.1 },
  { id: 30, name: "Vishwakarma Institute of Technology", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 84.0, type: "Private", rating: 3.8 },

  // DJ Sanghvi Mumbai
  { id: 31, name: "DJ Sanghvi College of Engineering", location: "Mumbai", branch: "Computer Engineering", cutoff: 94.0, type: "Private", rating: 4.3 },
  { id: 32, name: "DJ Sanghvi College of Engineering", location: "Mumbai", branch: "Information Technology", cutoff: 91.5, type: "Private", rating: 4.2 },
  { id: 33, name: "DJ Sanghvi College of Engineering", location: "Mumbai", branch: "Artificial Intelligence", cutoff: 92.0, type: "Private", rating: 4.2 },
  { id: 34, name: "DJ Sanghvi College of Engineering", location: "Mumbai", branch: "Electronics & Telecommunication", cutoff: 85.0, type: "Private", rating: 4.0 },

  // KJ Somaiya Mumbai
  { id: 35, name: "KJ Somaiya College of Engineering", location: "Mumbai", branch: "Computer Engineering", cutoff: 93.0, type: "Private", rating: 4.2 },
  { id: 36, name: "KJ Somaiya College of Engineering", location: "Mumbai", branch: "Information Technology", cutoff: 92.0, type: "Private", rating: 4.2 },
  { id: 37, name: "KJ Somaiya College of Engineering", location: "Mumbai", branch: "Mechanical Engineering", cutoff: 82.0, type: "Private", rating: 3.9 },
  { id: 38, name: "KJ Somaiya College of Engineering", location: "Mumbai", branch: "Electronics & Telecommunication", cutoff: 84.0, type: "Private", rating: 4.0 },

  // SPIT Mumbai
  { id: 39, name: "Sardar Patel Institute of Technology", location: "Mumbai", branch: "Computer Engineering", cutoff: 93.5, type: "Private", rating: 4.2 },
  { id: 40, name: "Sardar Patel Institute of Technology", location: "Mumbai", branch: "Information Technology", cutoff: 91.0, type: "Private", rating: 4.1 },
  { id: 41, name: "Sardar Patel Institute of Technology", location: "Mumbai", branch: "Electronics & Telecommunication", cutoff: 86.0, type: "Private", rating: 4.0 },

  // Fr. CRCE Mumbai
  { id: 42, name: "Fr. CRCE Mumbai", location: "Mumbai", branch: "Computer Engineering", cutoff: 91.0, type: "Private", rating: 4.1 },
  { id: 43, name: "Fr. CRCE Mumbai", location: "Mumbai", branch: "Information Technology", cutoff: 88.0, type: "Private", rating: 4.0 },
  { id: 44, name: "Fr. CRCE Mumbai", location: "Mumbai", branch: "Mechanical Engineering", cutoff: 78.0, type: "Private", rating: 3.7 },

  // MIT WPU Pune
  { id: 45, name: "MIT World Peace University", location: "Pune", branch: "Computer Engineering", cutoff: 88.0, type: "Private", rating: 4.0 },
  { id: 46, name: "MIT World Peace University", location: "Pune", branch: "Artificial Intelligence", cutoff: 87.0, type: "Private", rating: 4.0 },
  { id: 47, name: "MIT World Peace University", location: "Pune", branch: "Computer Science", cutoff: 86.0, type: "Private", rating: 3.9 },
  { id: 48, name: "MIT World Peace University", location: "Pune", branch: "Mechanical Engineering", cutoff: 75.0, type: "Private", rating: 3.7 },

  // PCCOE Pune
  { id: 49, name: "PCCOE Pune", location: "Pune", branch: "Computer Engineering", cutoff: 90.0, type: "Private", rating: 4.0 },
  { id: 50, name: "PCCOE Pune", location: "Pune", branch: "Artificial Intelligence", cutoff: 89.0, type: "Private", rating: 4.0 },
  { id: 51, name: "PCCOE Pune", location: "Pune", branch: "Information Technology", cutoff: 87.0, type: "Private", rating: 3.9 },
  { id: 52, name: "PCCOE Pune", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 78.0, type: "Private", rating: 3.7 },

  // Sinhgad Pune
  { id: 53, name: "Sinhgad College of Engineering", location: "Pune", branch: "Computer Engineering", cutoff: 82.0, type: "Private", rating: 3.8 },
  { id: 54, name: "Sinhgad College of Engineering", location: "Pune", branch: "Information Technology", cutoff: 79.0, type: "Private", rating: 3.7 },
  { id: 55, name: "Sinhgad College of Engineering", location: "Pune", branch: "Mechanical Engineering", cutoff: 70.0, type: "Private", rating: 3.5 },
  { id: 56, name: "Sinhgad College of Engineering", location: "Pune", branch: "Civil Engineering", cutoff: 65.0, type: "Private", rating: 3.4 },

  // SGGS Nanded
  { id: 57, name: "SGGS IE&T Nanded", location: "Nanded", branch: "Computer Science", cutoff: 88.5, type: "Government", rating: 4.1 },
  { id: 58, name: "SGGS IE&T Nanded", location: "Nanded", branch: "Computer Engineering", cutoff: 87.0, type: "Government", rating: 4.0 },
  { id: 59, name: "SGGS IE&T Nanded", location: "Nanded", branch: "Electronics & Telecommunication", cutoff: 81.0, type: "Government", rating: 3.8 },
  { id: 60, name: "SGGS IE&T Nanded", location: "Nanded", branch: "Mechanical Engineering", cutoff: 78.0, type: "Government", rating: 3.7 },
  { id: 61, name: "SGGS IE&T Nanded", location: "Nanded", branch: "Electrical Engineering", cutoff: 76.0, type: "Government", rating: 3.6 },

  // GCE Amravati
  { id: 62, name: "Government College of Engineering", location: "Amravati", branch: "Computer Science", cutoff: 87.0, type: "Government", rating: 4.0 },
  { id: 63, name: "Government College of Engineering", location: "Amravati", branch: "Computer Engineering", cutoff: 85.5, type: "Government", rating: 3.9 },
  { id: 64, name: "Government College of Engineering", location: "Amravati", branch: "Electronics & Telecommunication", cutoff: 79.0, type: "Government", rating: 3.7 },
  { id: 65, name: "Government College of Engineering", location: "Amravati", branch: "Electrical Engineering", cutoff: 75.0, type: "Government", rating: 3.6 },

  // Thakur Mumbai
  { id: 66, name: "Thakur College of Engineering", location: "Mumbai", branch: "Computer Engineering", cutoff: 87.0, type: "Private", rating: 3.9 },
  { id: 67, name: "Thakur College of Engineering", location: "Mumbai", branch: "Information Technology", cutoff: 85.0, type: "Private", rating: 3.9 },
  { id: 68, name: "Thakur College of Engineering", location: "Mumbai", branch: "Artificial Intelligence", cutoff: 84.0, type: "Private", rating: 3.8 },
  { id: 69, name: "Thakur College of Engineering", location: "Mumbai", branch: "Mechanical Engineering", cutoff: 72.0, type: "Private", rating: 3.5 },

  // RIT Islampur
  { id: 70, name: "Rajarambapu Institute of Technology", location: "Islampur", branch: "Computer Engineering", cutoff: 84.0, type: "Private", rating: 3.9 },
  { id: 71, name: "Rajarambapu Institute of Technology", location: "Islampur", branch: "Computer Science", cutoff: 82.0, type: "Private", rating: 3.8 },
  { id: 72, name: "Rajarambapu Institute of Technology", location: "Islampur", branch: "Artificial Intelligence", cutoff: 81.0, type: "Private", rating: 3.8 },
  { id: 73, name: "Rajarambapu Institute of Technology", location: "Islampur", branch: "Mechanical Engineering", cutoff: 72.0, type: "Private", rating: 3.6 },

  // VNIT Nagpur
  { id: 74, name: "VNIT Nagpur", location: "Nagpur", branch: "Computer Science", cutoff: 98.5, type: "Government", rating: 4.7 },
  { id: 75, name: "VNIT Nagpur", location: "Nagpur", branch: "Electronics & Telecommunication", cutoff: 95.0, type: "Government", rating: 4.5 },
  { id: 76, name: "VNIT Nagpur", location: "Nagpur", branch: "Mechanical Engineering", cutoff: 92.0, type: "Government", rating: 4.4 },
  { id: 77, name: "VNIT Nagpur", location: "Nagpur", branch: "Electrical Engineering", cutoff: 91.0, type: "Government", rating: 4.3 },
  { id: 78, name: "VNIT Nagpur", location: "Nagpur", branch: "Civil Engineering", cutoff: 87.0, type: "Government", rating: 4.1 },

  // KKWIEER Nashik
  { id: 79, name: "KK Wagh Institute of Engineering", location: "Nashik", branch: "Computer Engineering", cutoff: 85.0, type: "Private", rating: 3.9 },
  { id: 80, name: "KK Wagh Institute of Engineering", location: "Nashik", branch: "Information Technology", cutoff: 82.0, type: "Private", rating: 3.8 },
  { id: 81, name: "KK Wagh Institute of Engineering", location: "Nashik", branch: "Mechanical Engineering", cutoff: 72.0, type: "Private", rating: 3.6 },
  { id: 82, name: "KK Wagh Institute of Engineering", location: "Nashik", branch: "Electronics & Telecommunication", cutoff: 74.0, type: "Private", rating: 3.6 },

  // GCOE Nagpur
  { id: 83, name: "Government College of Engineering", location: "Nagpur", branch: "Computer Science", cutoff: 92.0, type: "Government", rating: 4.2 },
  { id: 84, name: "Government College of Engineering", location: "Nagpur", branch: "Computer Engineering", cutoff: 90.0, type: "Government", rating: 4.1 },
  { id: 85, name: "Government College of Engineering", location: "Nagpur", branch: "Electronics & Telecommunication", cutoff: 83.0, type: "Government", rating: 3.9 },
  { id: 86, name: "Government College of Engineering", location: "Nagpur", branch: "Mechanical Engineering", cutoff: 80.0, type: "Government", rating: 3.8 },
  { id: 87, name: "Government College of Engineering", location: "Nagpur", branch: "Civil Engineering", cutoff: 74.0, type: "Government", rating: 3.6 },

  // Sandip Nashik
  { id: 88, name: "Sandip Institute of Technology", location: "Nashik", branch: "Computer Engineering", cutoff: 78.0, type: "Private", rating: 3.6 },
  { id: 89, name: "Sandip Institute of Technology", location: "Nashik", branch: "Artificial Intelligence", cutoff: 76.0, type: "Private", rating: 3.5 },
  { id: 90, name: "Sandip Institute of Technology", location: "Nashik", branch: "Mechanical Engineering", cutoff: 65.0, type: "Private", rating: 3.3 },

  // DYPCOE Pune
  { id: 91, name: "DY Patil College of Engineering", location: "Pune", branch: "Computer Engineering", cutoff: 85.0, type: "Private", rating: 3.9 },
  { id: 92, name: "DY Patil College of Engineering", location: "Pune", branch: "Information Technology", cutoff: 82.0, type: "Private", rating: 3.8 },
  { id: 93, name: "DY Patil College of Engineering", location: "Pune", branch: "Artificial Intelligence", cutoff: 83.0, type: "Private", rating: 3.8 },
  { id: 94, name: "DY Patil College of Engineering", location: "Pune", branch: "Mechanical Engineering", cutoff: 70.0, type: "Private", rating: 3.5 },

  // GCE Kolhapur
  { id: 95, name: "Government College of Engineering", location: "Kolhapur", branch: "Computer Engineering", cutoff: 89.0, type: "Government", rating: 4.0 },
  { id: 96, name: "Government College of Engineering", location: "Kolhapur", branch: "Computer Science", cutoff: 87.0, type: "Government", rating: 3.9 },
  { id: 97, name: "Government College of Engineering", location: "Kolhapur", branch: "Mechanical Engineering", cutoff: 80.0, type: "Government", rating: 3.8 },
  { id: 98, name: "Government College of Engineering", location: "Kolhapur", branch: "Civil Engineering", cutoff: 73.0, type: "Government", rating: 3.6 },

  // Bharati Vidyapeeth Pune
  { id: 99, name: "Bharati Vidyapeeth College of Engineering", location: "Pune", branch: "Computer Engineering", cutoff: 84.0, type: "Private", rating: 3.8 },
  { id: 100, name: "Bharati Vidyapeeth College of Engineering", location: "Pune", branch: "Information Technology", cutoff: 80.0, type: "Private", rating: 3.7 },
  { id: 101, name: "Bharati Vidyapeeth College of Engineering", location: "Pune", branch: "Artificial Intelligence", cutoff: 81.0, type: "Private", rating: 3.7 },
  { id: 102, name: "Bharati Vidyapeeth College of Engineering", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 74.0, type: "Private", rating: 3.5 },

  // Thadomal Shahani Mumbai
  { id: 103, name: "Thadomal Shahani Engineering College", location: "Mumbai", branch: "Computer Engineering", cutoff: 90.0, type: "Private", rating: 4.1 },
  { id: 104, name: "Thadomal Shahani Engineering College", location: "Mumbai", branch: "Information Technology", cutoff: 87.0, type: "Private", rating: 4.0 },
  { id: 105, name: "Thadomal Shahani Engineering College", location: "Mumbai", branch: "Artificial Intelligence", cutoff: 88.0, type: "Private", rating: 4.0 },

  // GCOE Jalgaon
  { id: 106, name: "Government College of Engineering", location: "Jalgaon", branch: "Computer Engineering", cutoff: 84.0, type: "Government", rating: 3.8 },
  { id: 107, name: "Government College of Engineering", location: "Jalgaon", branch: "Computer Science", cutoff: 82.0, type: "Government", rating: 3.7 },
  { id: 108, name: "Government College of Engineering", location: "Jalgaon", branch: "Electrical Engineering", cutoff: 72.0, type: "Government", rating: 3.5 },
  { id: 109, name: "Government College of Engineering", location: "Jalgaon", branch: "Mechanical Engineering", cutoff: 70.0, type: "Government", rating: 3.4 },

  // Cummins Pune
  { id: 110, name: "Cummins College of Engineering (Women)", location: "Pune", branch: "Computer Engineering", cutoff: 92.0, type: "Private", rating: 4.2 },
  { id: 111, name: "Cummins College of Engineering (Women)", location: "Pune", branch: "Information Technology", cutoff: 89.0, type: "Private", rating: 4.1 },
  { id: 112, name: "Cummins College of Engineering (Women)", location: "Pune", branch: "Electronics & Telecommunication", cutoff: 84.0, type: "Private", rating: 3.9 },

  // VIIT Pune
  { id: 113, name: "Vishwakarma Institute of Information Technology", location: "Pune", branch: "Computer Engineering", cutoff: 88.0, type: "Private", rating: 4.0 },
  { id: 114, name: "Vishwakarma Institute of Information Technology", location: "Pune", branch: "Information Technology", cutoff: 85.0, type: "Private", rating: 3.9 },
  { id: 115, name: "Vishwakarma Institute of Information Technology", location: "Pune", branch: "Artificial Intelligence", cutoff: 86.0, type: "Private", rating: 3.9 },

  // Ramrao Adik Mumbai
  { id: 116, name: "Ramrao Adik Institute of Technology", location: "Mumbai", branch: "Computer Engineering", cutoff: 83.0, type: "Private", rating: 3.8 },
  { id: 117, name: "Ramrao Adik Institute of Technology", location: "Mumbai", branch: "Information Technology", cutoff: 80.0, type: "Private", rating: 3.7 },

  // GCOE Chandrapur
  { id: 118, name: "Government College of Engineering", location: "Chandrapur", branch: "Computer Science", cutoff: 80.0, type: "Government", rating: 3.7 },
  { id: 119, name: "Government College of Engineering", location: "Chandrapur", branch: "Mechanical Engineering", cutoff: 68.0, type: "Government", rating: 3.4 },
  { id: 120, name: "Government College of Engineering", location: "Chandrapur", branch: "Electrical Engineering", cutoff: 66.0, type: "Government", rating: 3.3 },
];

// Category-wise cutoff adjustment factors
const categoryAdjustment: Record<string, number> = {
  Open: 0,
  OBC: 3,
  SC: 8,
  ST: 12,
  NT: 5,
  SBC: 4,
  EWS: 2,
};

// JEE percentile to MHT-CET approximate mapping
function convertJeeToMhtcet(jeePercentile: number): number {
  // JEE is tougher; a lower JEE percentile maps to a higher MHT-CET equivalent
  if (jeePercentile >= 99) return 99.5;
  if (jeePercentile >= 95) return 98 + (jeePercentile - 95) * 0.3;
  if (jeePercentile >= 85) return 94 + (jeePercentile - 85) * 0.4;
  if (jeePercentile >= 70) return 85 + (jeePercentile - 70) * 0.6;
  return jeePercentile * 1.15;
}

export function predictColleges(profile: StudentProfile): CollegeResult[] {
  const { percentile, preferredBranches, preferredLocation, collegeType, category, examType } = profile;

  // Convert JEE percentile to MHT-CET equivalent if needed
  const effectivePercentile = examType === "JEE" ? convertJeeToMhtcet(percentile) : percentile;

  // Category adjustment lowers the effective cutoff
  const catAdj = categoryAdjustment[category] || 0;

  return collegeData
    .filter((c) => {
      if (collegeType && collegeType !== "Any" && c.type !== collegeType) return false;
      if (preferredBranches.length > 0 && !preferredBranches.some((b) => c.branch.toLowerCase().includes(b.toLowerCase()))) return false;
      if (preferredLocation && preferredLocation !== "Any" && !c.location.toLowerCase().includes(preferredLocation.toLowerCase())) return false;

      // Only include colleges where student percentile >= adjusted cutoff
      const adjustedCutoff = Math.max(0, c.cutoff - catAdj);
      if (adjustedCutoff === 0) return false;
      if (effectivePercentile < adjustedCutoff) return false;

      return true;
    })
    .map((c) => {
      const adjustedCutoff = Math.max(0, c.cutoff - catAdj);
      const diff = effectivePercentile - adjustedCutoff;
      // diff is always >= 0 since we filtered above
      const matchPercent = Math.min(98, 75 + diff * 2);
      return { ...c, matchPercent: Math.round(matchPercent) };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);
}

export const branches = [
  "Computer Engineering",
  "Computer Science",
  "Information Technology",
  "Artificial Intelligence",
  "Electronics & Telecommunication",
  "Electronics Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

export const locations = [
  "Any", "Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad",
  "Kolhapur", "Sangli", "Nanded", "Amravati", "Jalgaon",
  "Chandrapur", "Islampur",
];

export const collegeTypes = ["Any", "Government", "Private"];

export const categories: CategoryOption[] = [
  { label: "Open", apiValue: "OPEN" },
  { label: "EWS", apiValue: "EWS" },
  { label: "OBC", apiValue: "OBC" },
  { label: "DT/VJ", apiValue: "DT_VJ" },
  { label: "NT 1 (NT-B)", apiValue: "NT1" },
  { label: "NT 2 (NT-C)", apiValue: "NT2" },
  { label: "NT 3 (NT-D)", apiValue: "NT3" },
  { label: "SBC", apiValue: "SBC" },
  { label: "SEBC", apiValue: "SEBC" },
  { label: "SC", apiValue: "SC" },
  { label: "ST", apiValue: "ST" },
];

export const examTypes = ["MHT-CET", "JEE"] as const;
