import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: 'product-gallery.component.html'
})
export class ProductGalleryComponent implements OnInit, OnChanges {
  @Input()
  public product: any;

  public images = ['', '', ''];

  activeIndex: number = 0;
  currentImage: string = '';

  constructor() {
  }

  public ngOnInit(): void {
    this.loadImages();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.loadImages();
  }

  public loadImages() {
    console.log('edfghy => ', this.product);
    this.images = this.images.map((ele: string, index: number) => {
      ele = `https://toyimages.s3.ap-southeast-2.amazonaws.com/toys/${this.product.Code}/${index + 1}.jpg`;
      return ele;
    });
    this.currentImage = this.images[0];
    console.log(this.images);
  }

  public changeImage(index: number): void {
    this.activeIndex = index;
    this.currentImage = this.images[index];
  }
}
