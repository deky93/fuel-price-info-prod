import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor() { }

  private rates:any = {
    RSD: 1,    // Base currency
    BAM: 0.0166875, // Conversion rate to BAM
    EUR: 0.0085, // Conversion rate to EUR
    MKD: 0.52575,      // 1 RSD = 0.526 MKD
    BGN:0.01675,    // 1 RSD = 0.01643 BGN
    ALL: 0.8434      // 1 RSD = 0.6579 ALL
  };

  convert(amounts: number[], from: string, to: string): number[] {
    if (from === to) {
      return amounts; 
    }
  
    
    if (!this.rates[from] || !this.rates[to]) {
      throw new Error(`Conversion rate not found for ${from} or ${to}`);
    }
  
    return amounts.map(amount => (amount / this.rates[from]) * this.rates[to]);
  }
}
