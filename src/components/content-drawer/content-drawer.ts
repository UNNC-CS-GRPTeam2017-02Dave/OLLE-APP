import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Platform, DomController } from 'ionic-angular';

// https://www.joshmorony.com/how-to-create-a-sliding-drawer-component-for-ionic-2/
@Component({
  selector: 'content-drawer',
  templateUrl: 'content-drawer.html'
})
export class ContentDrawer {

  // input component: enables to supply options to the component from wherever we are using it.
  @Input('options') options: any;

  handleHeight: number = 50;
  bounceBack: boolean = true;
  thresholdTop: number = 200;
  thresholdBottom: number = 200;
  topContent: number = 0;
  bottomContent: number = 0;

  constructor(public element: ElementRef, public renderer: Renderer, public domCtrl: DomController, public platform: Platform) {

  }

  /* Update variables if initialized outside this file */
  ngAfterViewInit() {

    if(this.options.handleHeight){
      this.handleHeight = this.options.handleHeight;
    }

    if(this.options.bounceBack){
      this.bounceBack = this.options.bounceBack;
    }

    if(this.options.thresholdFromBottom){
      this.thresholdBottom = this.options.thresholdFromBottom;
    }

    if(this.options.thresholdFromTop){
      this.thresholdTop = this.options.thresholdFromTop;
    }

    if(this.options.topContent){
      this.topContent = this.options.topContent;
    }

    if(this.options.bottomContent){
      this.bottomContent = this.options.bottomContent;
    }


    // this.platform.height() == sizeOf(screen)
    // Sets position of the scrollable button
    this.renderer.setElementStyle(this.element.nativeElement, 'bottom', this.platform.height() - this.handleHeight - this.topContent + 'px');

    /* Sets starting position of the touchable button within the scrollable screen*/
    this.renderer.setElementStyle(this.element.nativeElement, 'padding-bottom', this.handleHeight + 'px');

    let hammer = new window['Hammer'](this.element.nativeElement);
    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_VERTICAL });

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });

  }

  handlePan(ev){
    // y-coordinate distance from top to mouse pos.
    let newTop = ev.center.y;


    let bounceToBottom = false;
    let bounceToTop = false;

    // ev.isFinal when user has stopped panning
    if(this.bounceBack && ev.isFinal){

      // show diagram
      let topDiff = newTop - this.thresholdTop;
      let bottomDiff = (this.platform.height() - this.thresholdBottom) - newTop;

      topDiff >= bottomDiff ? bounceToBottom = true : bounceToTop = true;

    }

    if((newTop < this.thresholdTop && ev.additionalEvent === "panup") || bounceToTop){
      console.log('Hello World!');
      this.domCtrl.write(() => {
        this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'bottom 0.5s');
        /* Final position of bottom pixels of the screen when panned-up */
        this.renderer.setElementStyle(this.element.nativeElement, 'bottom', this.platform.height() - this.handleHeight - this.topContent +'px');
      });

    } else if(((this.platform.height() - newTop) < this.thresholdBottom && ev.additionalEvent === "pandown") || bounceToBottom){
      console.log('See ya');
      this.domCtrl.write(() => {
        this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'bottom 0.5s');
        /* Final position of bottom pixels of the screen when panned-down */
        this.renderer.setElementStyle(this.element.nativeElement, 'bottom', this.bottomContent + 'px');
      });

    /* Executed when user isSliding the screen (regarless of upwards or downwards) */
    } else {
      // When I am here? onSlide()
      //console.log(ev.center.y);
      this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'none');

      if(newTop > this.handleHeight/2 && newTop < (this.platform.height() - this.handleHeight)) {

        if(ev.additionalEvent === "panup" || ev.additionalEvent === "pandown"){

          this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'bottom', this.platform.height() - newTop + 'px');
          });

        }

      }

    }

  }

}
