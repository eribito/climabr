import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/domain/entities/city';
import { SearchCityService } from 'src/domain/services/search-city.service';
import { LocalStorageCitiesService } from '../../domain/services/local-storage-cities.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ViewWillEnter {
  cities: City[];
  hasError: boolean = false;
  hasSavedCitiesOnHistory: boolean = false;
  errorMessage: string;

  constructor(
    private readonly searchService: SearchCityService,
    private readonly router: Router,
    private readonly storageCities: LocalStorageCitiesService,
  ) {}

  async ionViewWillEnter() {
    this.cities = await this.storageCities.getCities();
    this.hasSavedCitiesOnHistory = this.cities.length > 0;
  }

  async onSearch(query: string) {
    try {
      this.hasError = false;
      this.hasSavedCitiesOnHistory = false;
      this.cities = await this.searchService.search(query);
    } catch (error) {
      this.hasError = true;
      this.errorMessage = error.message;
    }
  }

  onSelectCity(cityId: string) {
    this.storageCities.addCityToHistory(this.cities.find(c => c.id === parseInt(cityId, 10)));
    this.router.navigateByUrl(`/weather/${cityId}`);
  }
}
