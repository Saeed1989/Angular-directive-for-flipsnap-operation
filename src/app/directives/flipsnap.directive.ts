/**
 * Flipsnap Directive
 *
 * @version  0.1.1
 * @url
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

/** Interface point move event object */
export interface IFsPointMoveEvent {
  orgEvent: Event;
  point: number;
}

/** Inteface for the swipe process options */
export interface IFsOptions {
  maxPoint?: number;
  distance?: number;
  transitionDuration?: number;
  disableTouch?: boolean;
  disable3d?: boolean;
  threshold?: number;
}

@Directive({ selector: '[fsnap]' })
export class FlipsnapDirective implements AfterViewInit, OnDestroy {
  /** Flipsnap options for swipe operation */
  @Input() options: IFsOptions = {};

  /** Swipe point move */
  @Output() pointMove = new EventEmitter<IFsPointMoveEvent>();

  /** Initialise complete event */
  @Output() initComplete = new EventEmitter();

  /** Instance for flipsnap */
  private fsInstance: any;

  /** Swiping HTML element */
  private elem: HTMLElement;

  /**
   * Constructor
   * @param elementRef
   */
  constructor(private elementRef: ElementRef) {
    this.elem = this.elementRef.nativeElement;
  }

  /**
   * Init process after view is initialised
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initFs();
    }, 10);
  }

  /**
   * Clean up process when the component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Reinitialise the view and process
   */
  reInitialise(): void {
    this.destroy();
    setTimeout(() => {
      this.initFs();
    }, 10);
  }

  /**
   * Move to given swipe position
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
   * Move to next swipe position
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
   * Move to previous swipe positon
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
   * Refresh view and the process
   */
  refresh(): boolean {
    if (this.fsInstance) {
      this.fsInstance.refresh();
      return true;
    }
    return false;
  }

  /**
   * Destory the process
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
   * Initialise view and the process
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
   * Call back function for the point move event
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
