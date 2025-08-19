export interface Booking {
  id: number;
  userId: number;        
  planeId: string;       
  planeName: string;   
  source: string;     
  destination: string; 
  date: string;            
  price: number;
  startTime: string;     
  arrivalTime: string;   
  totalTime: string;     
}
