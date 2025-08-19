import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  bookingData: any = {};

  setStepData(step: string, data: any) {
    this.bookingData[step] = data;
  }

  getAllData() {
    return this.bookingData;
  }
}
