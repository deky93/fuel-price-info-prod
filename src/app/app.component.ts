import { AfterViewInit, Component, Inject, model, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CurrencyService } from './currency.service';
import {MatRadioModule} from '@angular/material/radio';
import { FooterComponent } from "./footer/footer.component";
import { log } from 'node:console';
import { BackToTopComponent } from "./back-to-top/back-to-top.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, FormsModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatRadioModule, FooterComponent, BackToTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  title = 'fuel-app';
  selectAll = true;
  showBih = false;
  showCro = false;
  showSer = false;
  showSlo = false;
  showMont = false;
  showMace = false;
  showGreece = false;
  showBulgaria = false;
  showAlba = false;

  fuelPrices:any = {
    Bosnia: { bmb95: 143.966, diesel: 145.161, gas: 77.81},
    Croatia: { bmb95: 177.643, diesel: 177.643, gas: 98.23  },
    Serbia: { bmb95: 181, diesel: 196.33, gas: 104.56 },
    Slovenia: { bmb95: 173.43, diesel: 182.78 , gas: 109.81  },
    Montenegro: { bmb95: 166.174, diesel: 156.812, gas: 77.2 },
    North_Macedonia: { bmb95: 146.408, diesel: 137.02 , gas: 87.54  },
    Greece: { bmb95: 208.654, diesel: 181.26 , gas: 111.21  },
    Bulgaria: { bmb95: 147.951, diesel: 152.05 , gas: 76.32  },
    Albania: { bmb95: 206.424, diesel: 206.424, gas: 68.012 }
  };

  countries2 = [
    { name: 'Bih', selected: false, class: 'bosnia' },
    { name: 'Hrvatska', selected: false, class: 'croatia' },
    { name: 'Srbija', selected: false, class: 'serbia' },
    { name: 'Slovenija', selected: false, class: 'slovenia' },
    { name: 'Crna Gora', selected: false, class: 'montenegro' },
    { name: 'Severna Makedonija', selected: false, class: 'north_macedonia' },
    { name: 'Grčka', selected: false, class: 'north_macedonia' },
    { name: 'Bugarska', selected: false, class: 'north_macedonia' },
    { name: 'Albanija', selected: false, class: 'albania' },
  ];

  legends: any = [
    { name: 'Najeftinije', color: '#4CAF50' },
    { name: 'Najskuplje', color: 'red' }
  ];

  filteredCountries: any = [
    ...this.countries2,
  ];

  selectedCurrency = { RSD: false, BAM: false, EUR: false,MKD: false,BGN: false,ALL: false };
  //activeCurrency: string = "";
  
  activeCurrency2: string = 'RSD';
  isActiveCurrency:any;
  currencies = ['RSD', 'BAM', 'EUR','MKD','BGN','ALL'];
  amounts = [
    this.fuelPrices.Bosnia.bmb95,this.fuelPrices.Bosnia.diesel,this.fuelPrices.Bosnia.gas,
    this.fuelPrices.Croatia.bmb95,this.fuelPrices.Croatia.diesel,this.fuelPrices.Croatia.gas,
    this.fuelPrices.Serbia.bmb95,this.fuelPrices.Serbia.diesel,this.fuelPrices.Serbia.gas,
    this.fuelPrices.Slovenia.bmb95,this.fuelPrices.Slovenia.diesel,this.fuelPrices.Slovenia.gas,
    this.fuelPrices.Montenegro.bmb95,this.fuelPrices.Montenegro.diesel,this.fuelPrices.Montenegro.gas,
    this.fuelPrices.North_Macedonia.bmb95,this.fuelPrices.North_Macedonia.diesel,this.fuelPrices.North_Macedonia.gas,
    this.fuelPrices.Greece.bmb95,this.fuelPrices.Greece.diesel,this.fuelPrices.Greece.gas,
    this.fuelPrices.Bulgaria.bmb95,this.fuelPrices.Bulgaria.diesel,this.fuelPrices.Bulgaria.gas,
    this.fuelPrices.Albania.bmb95,this.fuelPrices.Albania.diesel,this.fuelPrices.Albania.gas
  ];
  convertedAmount: number[] = [];

  fuelTypes = ['bmb95', 'diesel', 'gas'];
  countries = Object.keys(this.fuelPrices);
  minMaxValues: any = {};

  selections:any;

  loading: boolean = true;

  updated:Date;

  ekavica:string;

  ijekavica:string;



  constructor(private currencyService: CurrencyService,@Inject(PLATFORM_ID) private platformId: Object) {
    this.updated = new Date(2024, 11, 0o2); // Month is zero-based (10 = November)
    this.ekavica = "Cene";
    this.ijekavica = "Cijene";
  }

  ngOnInit() {
    this.calculateMinMax();
    //this.selectedCurrency.RSD = true;
    this.getselectedCurrencies();
    this.getSelectedCountries();

    // if (isPlatformBrowser(this.platformId)) {
    //   const language = navigator!.language;
    //   console.log(language);
    //   console.log(navigator);
    //   this.getUserLocation();

    // }

   
    
  }

  ngAfterViewInit(): void {
    this.getselectedCurrencies();
    this.getSelectedCountries();
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          
          const lat = position.coords.latitude;
          console.log(lat);
          
          const lon = position.coords.longitude;
          console.log(lon);
          
          this.getCountryFromCoordinates(lat, lon);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getCountryFromCoordinates(lat: number, lon: number): string {
    if (lat >= 42 && lat <= 46 && lon >= 15 && lon <= 19) {
      return this.ijekavica; // Bosnia and Herzegovina
    } else if (lat >= 44 && lat <= 46 && lon >= 19 && lon <= 23) {
      return this.ekavica; // Serbia
    }
    return 'Cena'; // Default
  }

  getSelectedCountries(){
    if (isPlatformBrowser(this.platformId)) {
     
      
      const savedSelections = localStorage.getItem('selections');
      if (savedSelections) {
      
        
        const parsedSelections = JSON.parse(savedSelections);
        
        
        this.showBih = parsedSelections.showBih ?? false;
        this.showCro = parsedSelections.showCro ?? false;
        this.showSer = parsedSelections.showSer ?? false;
        this.showSlo = parsedSelections.showSlo ?? false;
        this.showMont = parsedSelections.showMont ?? false;
        this.showMace = parsedSelections.showMace ?? false;
        this.showGreece = parsedSelections.showGreece ?? false;
        this.showBulgaria = parsedSelections.showBulgaria ?? false;
        this.showAlba = parsedSelections.showAlba ?? false;
  
        
        this.updateSelectAll();
      }
      else{
        
        this.toggleAll(true);
      }
      this.loading = false;
    }
  }

  getselectedCurrencies(){
    if (isPlatformBrowser(this.platformId)) {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency && this.currencies.includes(savedCurrency)) {
        this.activeCurrency2 = savedCurrency;
      }
      else {
           this.activeCurrency2 = 'RSD';
        }
    
      this.onCurrencyChange();
      this.loading = false;
    }
  }
  

  calculateMinMax() {
    this.fuelTypes.forEach((fuelType) => {
      const prices = this.countries.map(
        (country) => this.fuelPrices[country][fuelType]
      );
      this.minMaxValues[fuelType] = {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    });
  }

  getColor(fuelType: string, price: number): string {
    if (price === this.minMaxValues[fuelType].max) {
      return 'red';
    } else if (price === this.minMaxValues[fuelType].min) {
      return '#4CAF50';
    }
    return 'white';
  }

  onCurrencyChange(): void {
    
    
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedCurrency', this.activeCurrency2);
  }
    this.convertedAmount = this.currencyService.convert(this.amounts, 'RSD', this.activeCurrency2);
    


 
    
  }

  isCheckboxDisabled(currency: string): boolean {
    
    return this.activeCurrency2 !== null && this.activeCurrency2 !== currency;
  }

    toggleAll(checked: boolean) {
      this.selectAll = checked;
      this.showBih = checked;
      this.showCro = checked;
      this.showSer = checked;
      this.showSlo = checked;
      this.showMont = checked;
      this.showMace = checked;
      this.showGreece = checked;
      this.showBulgaria = checked;
      this.showAlba = checked;

      this.saveSelections();
    
      
    }

    updateSelectAll() {
      const allSelected =
        this.showBih &&
        this.showCro &&
        this.showSer &&
        this.showSlo &&
        this.showMont &&
        this.showMace &&
        this.showGreece &&
        this.showBulgaria &&
        this.showAlba;

        

        this.selectAll = allSelected;

        if (isPlatformBrowser(this.platformId)) {
          this.saveSelections();
          
        }
    }

    saveSelections() {
      const selections = {
        showBih: this.showBih,
        showCro: this.showCro,
        showSer: this.showSer,
        showSlo: this.showSlo,
        showMont: this.showMont,
        showMace: this.showMace,
        showGreece: this.showGreece,
        showBulgaria: this.showBulgaria,
        showAlba: this.showAlba,
      };

      if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('selections', JSON.stringify(selections));
        
      }
    }
  
 
}
