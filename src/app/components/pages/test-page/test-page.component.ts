import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  FlipsnapDirective,
  IFsOptions,
  IFsPointMoveEvent,
} from 'src/app/directives/flipsnap.directive';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent {
  /** instance of directive for point move event sample */
  @ViewChild('fsMovePoint', { read: FlipsnapDirective })
  fsMovePointInstance: FlipsnapDirective | null = null;

  /** instance of directive for move to point function sample */
  @ViewChild('fsMoveToPoint', { read: FlipsnapDirective })
  fsMoveToPointInstance: FlipsnapDirective | null = null;

  /** instance of directive for refresh functin sample */
  @ViewChild('fsRefresh', { read: FlipsnapDirective })
  fsRefreshInstance: FlipsnapDirective | null = null;

  /** instance of directive for disabled touch sample */
  @ViewChild('fsDisabledTouch', { read: FlipsnapDirective })
  fsDisabledTouchInstance: FlipsnapDirective | null = null;

  /** options for max point sample */
  optMaxPoint: IFsOptions = {
    distance: 160, // 80px * 2
    maxPoint: 3, // move able 3 times
  };

  /** options for distance sample */
  optDistance: IFsOptions = {
    distance: 230,
  };

  /** options for transition duration sample */
  optTsDuration: IFsOptions = {
    distance: 230,
    transitionDuration: 1000,
  };

  /** options for disable touch sample */
  optDisableTouch: IFsOptions = {
    distance: 230,
    disableTouch: true,
  };

  /** slide position point move event sample */
  point = 1;

  /** slide position for move to point sample */
  pointInput: number | null = null;

  /** sliding contents for add and remove sample */
  contents = [{ id: '1', label: '1' }];

  /** content count for and remove sample */
  contenCount = 1;

  /** content with for add  remove sample */
  contentsWidth = '';

  /** disabe flag for touch disable sample */
  isTouchDisabled = true;

  /** constructor */
  constructor() {
    this.contentsWidth = this.getContentsWidth(this.contenCount);
  }

  /**
   * move to next slide position
   * @param fsInstance instace of flipsnap directive of the sliding elements container
   */
  moveNext(fsInstance: FlipsnapDirective | null) {
    fsInstance?.moveToNext();
  }

  /**
   * move to previous slide position
   * @param fsInstance instace of flipsnap directive of the sliding elements container
   */
  movePrev(fsInstance: FlipsnapDirective | null) {
    fsInstance?.moveToPrev();
  }

  /**
   * event triggered when slide point moves
   * @param pmEvent flipsanp point move custom event
   */
  pointMoveEvent(pmEvent: IFsPointMoveEvent) {
    this.point = pmEvent.point + 1;
  }

  /**
   * move to input slide position
   */
  movePoint() {
    console.log(this.pointInput);
    if (this.pointInput !== null && !isNaN(this.pointInput)) {
      this.fsMoveToPointInstance?.moveToPoint(this.pointInput);
    }
  }

  /**
   * add sliding element to add remove sample container
   */
  addContent() {
    this.contenCount++;
    this.contentsWidth = this.getContentsWidth(this.contenCount);
    let newContet = {
      id: this.contenCount.toString(),
      label: this.contenCount.toString(),
    };
    this.contents.push(newContet);
    // refresh the sliding element container flipsnap directive
    setTimeout(() => {
      this.fsRefreshInstance?.refresh();
    }, 10);
  }

  /**
   * remove sliding element from add remove sample container
   */
  removeContent() {
    if (this.contenCount === 0) {
      return;
    }
    this.contenCount--;
    this.contentsWidth = this.getContentsWidth(this.contenCount);
    this.contents.pop();
    setTimeout(() => {
      // refresh the sliding element container flipsnap directive
      this.fsRefreshInstance?.refresh();
    }, 10);
  }

  /**
   * the state of touch disable changed in disabled touch sample
   */
  disableChanged() {
    console.log(this.isTouchDisabled);
    this.optDisableTouch.disableTouch = this.isTouchDisabled;
    console.log(this.fsDisabledTouchInstance?.options);
    // re-initialise the sliding element container flipsnap directive
    setTimeout(() => {
      this.fsDisabledTouchInstance?.reInitialise();
    }, 100);
  }

  /**
   * get width string for add remove sample container
   * @param contentCount count of sliding content
   */
  getContentsWidth(contentCount: number): string {
    return 230 * contentCount + 30 + 'px';
  }
}
