import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppHelper } from "../utils/app.helper";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public selectedProduct = null;

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const parentStoreId = AppHelper.getFromLocalStorage('scStoreDetails').nearestStore.ParentStoreId;
    const url = `/api/products?store=${storeId}&parentStore=${parentStoreId}`;
    return this.http.get(url);
  }

  public getProductsByAge(ageType: string): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const parentStoreId = AppHelper.getFromLocalStorage('scStoreDetails').nearestStore.ParentStoreId;
    const url = `/api/products/byAge?ageType=${ageType}&store=${storeId}&parentStore=${parentStoreId}`;
    return this.http.get(url);
  }

  public getProductsByCategory(category: string): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const url = `/api/products/byCategory/${category}?store=${storeId}`;
    return this.http.get(url);
  }

  public getProductsByMembershipType(membershipType: string): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const url = `/api/products/byMembershipType/?membershipType=${membershipType}&store=${storeId}`;
    return this.http.get(url);
  }

  public getProductByCode(code: string, id: string, storeId: string): Observable<any> {
    const url = `/api/products/get/store/${storeId}/${id}/${code}`;
    return this.http.get(url);
  }

  public getProductBySearchKey(key: string): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const parentStoreId = AppHelper.getFromLocalStorage('scStoreDetails').nearestStore.ParentStoreId;
    let params = new HttpParams();
    params = params.set('searchKey', key);
    params = params.set('store', storeId);
    params = params.set('parentStore', parentStoreId);
    const url = `/api/products/search?${params.toString()}`;
    return this.http.get(url);
  }

  public getProductByStoreAvailability(code: number, storeId: string): Observable<any> {
    const url = `/api/products/checkAndGet/${code}/store/${storeId}`;
    return this.http.get(url);
  }

  public applyProductFilter(filter: any): Observable<any> {
    const storeId = AppHelper.getFromLocalStorage('scStore');
    const parentStoreId = AppHelper.getFromLocalStorage('scStoreDetails').nearestStore.ParentStoreId;
    let params = new HttpParams();
    params = params.set('store', storeId);
    params = params.set('parentStore', parentStoreId);
    const url = `/api/products/filter?${params.toString()}`;
    console.log('filter ===>>>', filter);
    return this.http.post(url, filter);
  }

  public getCategories() {
    return [
      { name: 'Activity Sheets & Binders', code: 'activitySheets' },
      { name: 'Activity Toys', code: 'activityToys' },
      { name: 'Board Books', code: 'boardBooks' },
      { name: 'Cards & Boards', code: 'cardsBoards' },
      { name: 'Cars, Tracks & Trains', code: 'carsTracks' },
      { name: 'Jigsaw Puzzles', code: 'jigsawPuzzles' },
      { name: 'Junior Puzzles', code: 'juniorPuzzles' },
      { name: 'Legos & Blocks', code: 'legosBlocks' },
      { name: 'Magnetic Toys', code: 'magneticToys' },
      { name: 'Montessori Books', code: 'montessoriBooks' },
      { name: 'Montessori Toys', code: 'montessoriToys' },
      { name: 'Musical Books', code: 'musicalBooks' },
      { name: 'Musical Toys', code: 'musicalToys' },
      { name: 'Outdoor Toys', code: 'outdoorToys' },
      { name: 'Peg Boards', code: 'pegBoards' },
      { name: 'Pretend & Play toys', code: 'pretendToys' },
      { name: 'Pull Along Toys', code: 'pullToys' },
      { name: 'Push, Pull & Slide books', code: 'pushBooks' },
      { name: 'Sorting toys', code: 'sortingToys' },
      { name: 'Stacking toys', code: 'stackingToys' },
      { name: 'STEM Books', code: 'stemBooks' },
      { name: 'STEM toys', code: 'stemToys' },
      { name: 'Story Books', code: 'storyBooks' },
      { name: 'Think Books', code: 'thinkBooks' },
      { name: 'Touch & Feel Books', code: 'touchBooks' }
    ];
  }
}
