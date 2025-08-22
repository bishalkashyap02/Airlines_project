export interface Flight {
  planeid: string;
  planename: string;
  source: string;
  destination: string;
  date: string;
  returnDate?: string;
  price: number;
  startTime: string;
  arrivalTime: string;
  totalTime: string;
  isRoundTrip: boolean;
  classType: {
    economyEnabled?: boolean;
    economyPrice?: number;
    businessEnabled?: boolean;
    businessPrice?: number;
  };
}
