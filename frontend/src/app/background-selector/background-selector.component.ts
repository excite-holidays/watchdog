import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export enum BackgroundType {
  Dark = 'dark',
  Light = 'light',
  Picture = 'picture',
}

@Component({
  selector: 'app-background-selector',
  template: `
  <div class="buttons has-addons">
    <span class="button" [class.is-active]="active === BackgroundType.Dark" (click)="setActive(BackgroundType.Dark)"><i class="far fa-moon"></i></span>
    <span class="button" [class.is-active]="active === BackgroundType.Light" (click)="setActive(BackgroundType.Light)"><i class="far fa-sun"></i></span>
    <span class="button" [class.is-active]="active === BackgroundType.Picture" (click)="setActive(BackgroundType.Picture)"><i class="far fa-image"></i></span>
  </div>
`,
  styles: [`
  .button { border: 0; }
  .button.is-active { background: hsla(229, 8%, 50%, 1)}
  `]
})
export class BackgroundSelectorComponent implements OnInit {
  @Input() active = BackgroundType.Dark
  @Output() selectBackgroundType = new EventEmitter()
  BackgroundType = BackgroundType
  constructor() { }

  ngOnInit() { }

  setActive(active: BackgroundType) {
    this.active = active
    this.selectBackgroundType.emit(active)
  }
}
