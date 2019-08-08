import { Component, OnInit, ChangeDetectionStrategy, ElementRef, HostListener } from '@angular/core';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { ChangeBackgroundImage } from '../app.state';
import { merge, of } from 'rxjs';

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundImageComponent implements OnInit {
  constructor(private el: ElementRef<HTMLElement>, private action$: Actions) { }

  ngOnInit() {
    merge(
      of(1),
      this.action$.pipe(ofActionDispatched(ChangeBackgroundImage))
    ).subscribe(() => {
      this.loadImage()
    })
  }

  @HostListener('animationend', ['$event'])
  onAnimationend(e: AnimationEvent) {
    const imageElements = this.el.nativeElement.querySelectorAll('img')
    if (imageElements.length > 2) {
      Array.from(imageElements)
      .filter((image, index, arr) => index < (arr.length - 2))
      .forEach((image) => {
        this.el.nativeElement.removeChild(image)
      })
    }
  }

  private loadImage() {
    const image = new Image()
    image.src = `https://source.unsplash.com/2560x1440/?view,nature,water,architecture,abstract/${(new Date()).getTime()}`
    image.onload = () => {
      this.el.nativeElement.appendChild(image)
    }
  }
}
