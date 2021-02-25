/**
 * flipsnap Directive
 *
 * @version  0.1.1
 * @url https://github.com/Saeed1989/Angular-directive-for-flipsnap-operation
 *
 * Copyright Md Saeed Sharman.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

import {
  AfterViewInit,
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
} from '@angular/core';

declare var Flipsnap: any;

/** interface point move event object */
export interface IFsPointMoveEvent {
  /** native event of slipe elemnt */
  orgEvent: Event;
  /** the point that move happens - starts with 0 */
  point: number;
}

/** interface for the swipe process options */
export interface IFsOptions {
  /**  stop point count. default is auto calculate from element item count. */
  maxPoint?: number;
  /** move distance. default is auto calculate from element width and maxPont. */
  distance?: number;
  /** transition duration (millisecond). default is 350. */
  transitionDuration?: number;
  /** when set true, touch event is disabled. Only handling button or etc interface. default is false. */
  disableTouch?: boolean;
  /** when support 3D transform browser and this option set true, it is not used 3D transform and use 2D transform. */
  disable3d?: boolean;
  /** pixel count of touch mvoe after which slide starts */
  threshold?: number;
}

@Directive({ selector: '[appFsnap]' })
export class FlipsnapDirective implements AfterViewInit, OnDestroy {
  /** flipsnap options for swipe operation */
  @Input() options: IFsOptions = {};

  /** slide point move */
  @Output() pointMove = new EventEmitter<IFsPointMoveEvent>();

  /** initialise complete event */
  @Output() initComplete = new EventEmitter();

  /** instance for flipsnap */
  private fsInstance: any;

  /** sliding HTML element */
  private elem: HTMLElement;

  /**
   * constructor
   * @param elementRef
   */
  constructor(private elementRef: ElementRef) {
    this.elem = this.elementRef.nativeElement;
  }

  /**
   * init process after view is initialised
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initFs();
    }, 10);
  }

  /**
   * clean up process when the component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * reinitialise the view and process
   */
  reInitialise(): void {
    this.destroy();
    setTimeout(() => {
      this.initFs();
    }, 10);
  }

  /**
   * move to given swipe position
   * @param point swipe position
   * @param transitionDuration time duration for the swipe process
   */
  moveToPoint(point: number, transitionDuration?: number): boolean {
    if (this.fsInstance) {
      this.fsInstance.moveToPoint(point, transitionDuration);
      return true;
    }
    return false;
  }

  /**
   * move to next swipe position
   * @param transitionDuration time durtion for the swipe process
   */
  moveToNext(transitionDuration?: number): boolean {
    if (this.fsInstance && this.fsInstance.hasNext()) {
      this.fsInstance.toNext(transitionDuration);
      return true;
    }
    return false;
  }

  /**
   * move to previous swipe positon
   * @param transitionDuration time duration for the swipe process
   */
  moveToPrev(transitionDuration?: number): boolean {
    if (this.fsInstance && this.fsInstance.hasPrev()) {
      this.fsInstance.toPrev(transitionDuration);
      return true;
    }
    return false;
  }

  /**
   * refresh view and the process
   */
  refresh(): boolean {
    if (this.fsInstance) {
      this.fsInstance.refresh();
      return true;
    }
    return false;
  }

  /**
   * destroy the process
   */
  destroy(): boolean {
    if (this.fsInstance) {
      this.fsInstance.element.removeEventListener(
        'fspointmove',
        this.pointMoveCallBackFn,
        false
      );
      this.fsInstance.destroy();
      this.fsInstance = null;
      return true;
    }
    return false;
  }

  /**
   * initialise view and the process
   */
  private initFs(): boolean {
    if (!this.fsInstance) {
      this.fsInstance = new Flipsnap(this.elem, this.options);
      this.fsInstance.element.addEventListener(
        'fspointmove',
        this.pointMoveCallBackFn,
        false
      );
      this.initComplete.emit();
      return true;
    }
    return false;
  }

  /**
   * call back function for the point move event
   * @param event Event
   */
  private pointMoveCallBackFn = (event: Event) => {
    if (this.fsInstance) {
      let fsPointMoveEvent: IFsPointMoveEvent = {
        orgEvent: event,
        point: this.fsInstance.currentPoint,
      };
      this.pointMove.emit(fsPointMoveEvent);
    }
  };
}
