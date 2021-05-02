import {Storage} from '@ionic/storage-angular';
import {City} from '../entities/city';

export class LocalStorageCitiesService {
  cities: City[];
  constructor(
    private storage: Storage,
    private maxHistoryLenght: number = 5,
    ) {
    this.storage.create();
    this.cities = [];
  }
  public async getCities(): Promise<City[]> {
    const cities = await this.storage.get('cities');
    return cities ? cities : [];
  }

  private async saveCities() {
    await this.storage.set('cities', this.cities);
  }

  private async addCity(city: City) {
    this.cities.unshift(city);
  }

  private hasCity(city: City) {
    return this.cities.some(c => c.id === city.id);
  }

  public async addCityToHistory(city: City) {
    this.cities = await this.getCities();
    const hasCityOnList = this.hasCity(city);

    if (this.cities.length === this.maxHistoryLenght && hasCityOnList === false){
      this.cities.pop();
    }

    if (hasCityOnList === false) {
      await this.addCity(city);
    }
    await this.saveCities();
  }
}
