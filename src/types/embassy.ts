export interface Embassy {
  id: string;
  representingCountry: string;
  representingCountryCode: string;
  flag: string;
  hostCountry: string;
  hostCity: string;
  type: "embassy" | "consulate" | "high-commission" | "visa-center";
  address: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  appointmentUrl?: string;
  hours?: string;
  jurisdictionNotes?: string;
  servicesOffered: string[];
  languages?: string[];
}
