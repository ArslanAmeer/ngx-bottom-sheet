import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NgxBottomSheetComponent} from './ngx-bottom-sheet.component';
import {WindowRef} from './windowRef.service';

interface BottomSheetConfig {
  data?: BottomSheetDataRef;
  width?: 'small' | 'medium' | 'large' | 'full' | string;
  height?: 'full' | 'top' | 'mid' | 'quarter' | string;
  borderRadius?: string;
  backgroundColor?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

/**
 * The data to be passed to the bottom sheet.
 * @property {any} [key] - The data to be passed to the bottom sheet.
 * @example
 * // Example of passing data to the bottom sheet
 * const bottomSheetRef = this._bottomSheetService.open(SampleComponenet, {
 *  height: 'quarter',
 *  showCloseButton: false,
 *  backgroundColor: 'transparent',
 *  data: {
 *  text: 'Task',
 *  showReportButton: true
 *  }
 */
export interface BottomSheetDataRef {
  [key: string]: any;
}

interface BottomSheetInstance {
  ref: ComponentRef<NgxBottomSheetComponent>;
  afterClosedSubject: Subject<any>;
  backdropElement: HTMLElement;
  config?: BottomSheetConfig;
}

/**
 * Represents a service class for managing bottom sheets in an application.
 * Bottom sheets are UI components that slide up from the bottom of the screen to reveal more content.
 *
 * @class BottomSheetService
 *
 * @method open - Opens a new bottom sheet with the specified component and optional configuration.
 * @param {Type<any>} component - The component to be displayed in the bottom sheet.
 * @param {BottomSheetConfig} [config] - Optional configuration for the bottom sheet.
 * @returns An object containing an observable for when the bottom sheet is closed.
 *
 * @method close
 * Closes the topmost bottom sheet.
 * @param {any} [data] - Optional data to pass to the afterClosed$ observable when the bottom sheet is closed.
 *
 * @property {() => any} currentSheetData
 * A getter method that returns the data of the current (topmost) bottom sheet.
 * Returns `null` if there are no open bottom sheets.
 *
 * @example
 * ```typescript
 * const bottomSheetRef = this.bottomSheetService.open(MyComponent, {
 *   width: 'medium',
 *   height: 'full',
 *   showCloseButton: true
 * });
 * bottomSheetRef.afterClosed$.subscribe(result => {
 *   console.log('Bottom sheet closed with result:', result);
 * });
 *
 * const currentData = this.bottomSheetService.currentSheetData;
 * console.log('Current bottom sheet data:', currentData);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NgxBottomSheetService {
  /**
   * @type {BottomSheetInstance[]}
   * @description The instances of the bottom sheets.
   */
  private _bottomSheetInstances: BottomSheetInstance[] = [];

  /**
   * @type {number}
   * @description The base z-index for the bottom sheets.
   */
  private _baseZIndex: number = 200;


  constructor(
    private readonly _appRef: ApplicationRef,
    private readonly _injector: Injector,
    private readonly _windowRef: WindowRef
  ) {
    if (this._windowRef.nativeWindow) {
      this._windowRef.nativeWindow.addEventListener(
        'resize',
        this._updateBottomSheetSize.bind(this)
      );
    }
  }

  /**
   * Returns the data of the current sheet.
   * @returns {any} The data of the current sheet.
   */
  public get currentSheetData(): any {
    if (this._bottomSheetInstances.length > 0) {
      const topSheetIndex = this._bottomSheetInstances.length - 1;
      const topSheet = this._bottomSheetInstances[topSheetIndex];
      return topSheet?.config?.data;
    }
    return null;
  }


  /**
   * Cleans up the event listener when the service is destroyed.
   */
  ngOnDestroy(): void {
    if (this._windowRef.nativeWindow) {
      this._windowRef.nativeWindow.removeEventListener(
        'resize',
        this._updateBottomSheetSize.bind(this)
      );
    }
  }

  /**
   * Opens a new bottom sheet.
   * @param {Type<any>} component - The component to be displayed in the bottom sheet.
   * @param {BottomSheetConfig} [config] - The configuration for the bottom sheet.
   * @description The configuration for the bottom sheet includes the following properties:
   * - `data` - The data to be passed to the bottom sheet.
   * - `width` - The width of the bottom sheet. Possible values are `'small'`, `'medium'`, `'large'`, `'full'`, or a custom value.
   * - `height` - The height of the bottom sheet. Possible values are `'full'`, `'top'`, `'mid'`, `'quarter'`, or a custom value.
   * - `borderRadius` - The border radius of the bottom sheet.
   * - `backgroundColor` - The background color of the bottom sheet.
   * - `showCloseButton` - Whether to show the close button in the bottom sheet.
   * - `closeOnBackdropClick` - Whether the bottom sheet should close when the backdrop is clicked.
   * @returns {Object} An object containing the observable for when the bottom sheet is closed.
   */
  public open(
    component: Type<any>,
    config?: BottomSheetConfig
  ): { afterClosed$: Observable<any> } {
    const uniqueId = this._generateUniqueId();
    const afterClosedSubject = new Subject<any>();
    const preparedConfig = this._prepareConfig(config);
    const backdropElement = this._createBackdrop(
      config?.closeOnBackdropClick ?? true
    );
    const bottomSheetRef = this._createBottomSheet(
      component,
      preparedConfig,
      uniqueId
    );

    this._bottomSheetInstances.push({
      ref: bottomSheetRef,
      afterClosedSubject,
      backdropElement,
      config: preparedConfig,
    });

    return {
      afterClosed$: afterClosedSubject.asObservable(),
    };
  }

  /**
   * Closes the topmost bottom sheet.
   * @param {any} [data] - The data to be passed to the afterClosed$ observable.
   */
  public close(data?: any): void {
    if (this._bottomSheetInstances.length > 0) {
      const topSheetIndex = this._bottomSheetInstances.length - 1;
      const topSheet = this._bottomSheetInstances[topSheetIndex];

      this._appRef.detachView(topSheet.ref.hostView);
      topSheet.ref.destroy();
      if (topSheet.backdropElement.parentNode) {
        document.body.removeChild(topSheet.backdropElement);
      }
      topSheet.afterClosedSubject.next(data);
      topSheet.afterClosedSubject.complete();

      this._bottomSheetInstances.splice(topSheetIndex, 1);
    }
  }

  /**
   * Closes all bottom sheets.
   * @param data - Optional The data to be passed to the afterClosed$ observable.
   */
  public closeAll(data?: any): void {
    // Iterate backwards through the instances to close them in the correct order
    while (this._bottomSheetInstances.length) {
      const instanceIndex = this._bottomSheetInstances.length - 1;
      const instance = this._bottomSheetInstances[instanceIndex];

      this._appRef.detachView(instance.ref.hostView);
      instance.ref.destroy();

      if (instance.backdropElement.parentNode) {
        document.body.removeChild(instance.backdropElement);
      }
      instance.afterClosedSubject.next(data);
      instance.afterClosedSubject.complete();

      this._bottomSheetInstances.splice(instanceIndex, 1);
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------- Private Functions -------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------------

  /**
   * Prepares the configuration for the bottom sheet.
   * @param {BottomSheetConfig} [config] - The configuration for the bottom sheet.
   * @returns {BottomSheetConfig} The prepared configuration.
   */
  private _prepareConfig(config?: BottomSheetConfig): BottomSheetConfig {
    return {
      data: config?.data,
      width: this._getWidthStyle(config?.width),
      height: this._getHeightStyle(config?.height || '95%'),
      borderRadius: config?.borderRadius || '16px',
      backgroundColor: config?.backgroundColor || 'white',
      showCloseButton: config?.showCloseButton ?? true,
    };
  }

  /**
   * Creates a backdrop for the bottom sheet.
   * @param  [closeOnBackdropClick=true] - Whether the bottom sheet should close when the backdrop is clicked.
   * @returns {HTMLElement} The created backdrop element.
   */
  private _createBackdrop(closeOnBackdropClick = true): HTMLElement {
    const zIndex = this._baseZIndex + this._bottomSheetInstances.length * 2; // Ensure different z-index for each instance
    const backdropElement = document.createElement('div');
    backdropElement.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.60);
  z-index: ${zIndex};
`;
    if (closeOnBackdropClick) {
      backdropElement.addEventListener('click', () => this.close());
    }
    document.body.appendChild(backdropElement);
    return backdropElement;
  }

  /**
   * Creates a new bottom sheet.
   * @param {Type<any>} component - The component to be displayed in the bottom sheet.
   * @param {BottomSheetConfig} config - The configuration for the bottom sheet.
   * @param {string} uniqueId - The unique ID for the bottom sheet.
   * @returns {ComponentRef<NgxBottomSheetComponent>} The reference to the created bottom sheet.
   */
  private _createBottomSheet(
    component: Type<any>,
    config: BottomSheetConfig,
    uniqueId: string
  ): ComponentRef<NgxBottomSheetComponent> {
    const zIndex = this._baseZIndex + this._bottomSheetInstances.length * 2 + 1; // Above the backdrop

    // Dynamically create the bottom sheet component using the new `createComponent` API
    const bottomSheetRef = createComponent(NgxBottomSheetComponent, {
      environmentInjector: this._appRef.injector
    });

    // Attach the bottom sheet component to the application
    this._appRef.attachView(bottomSheetRef.hostView);

    // Append the bottom sheet element to the DOM
    const domElem = (bottomSheetRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this._applyStylesToDomElement(domElem, config);
    domElem.style.zIndex = `${zIndex}`; // Set the calculated z-index
    document.body.appendChild(domElem);

    // Create the actual content inside the bottom sheet after it's appended to the DOM
    setTimeout(() => {
      const bottomSheetInstance = bottomSheetRef.instance;
      const componentRef = bottomSheetInstance.container.createComponent(component);
      bottomSheetInstance.showCloseButton = config.showCloseButton ?? true;

      // If there is data to pass to the component, assign it
      if (config.data && 'bottomSheetData' in componentRef.instance) {
        Object.assign(componentRef.instance, {bottomSheetData: config.data});
      }
    });

    return bottomSheetRef;
  }


  /**
   * Applies styles to the bottom sheet DOM element.
   * @param {HTMLElement} domElem - The DOM element of the bottom sheet.
   * @param {BottomSheetConfig} config - The configuration for the bottom sheet.
   */
  private _applyStylesToDomElement(
    domElem: HTMLElement,
    config: BottomSheetConfig
  ): void {
    domElem.style.width = config.width || '100%';
    domElem.style.height = config.height || '95%';
    domElem.style.borderTopRightRadius = config.borderRadius || '8px';
    domElem.style.borderTopLeftRadius = config.borderRadius || '8px';
    domElem.style.backgroundColor = config.backgroundColor || 'white';
    domElem.className = 'ngx-bottom-sheet';
  }

  /**
   * Removes a bottom sheet instance.
   * @param {BottomSheetInstance} instance - The instance to be removed.
   */
  private _removeBottomSheet(instance: BottomSheetInstance): void {
    this._appRef.detachView(instance.ref.hostView);
    instance.ref.destroy();
    this._removeBackdrop(instance.backdropElement);
  }

  /**
   * Removes a backdrop element.
   * @param {HTMLElement} backdropElement - The backdrop element to be removed.
   */
  private _removeBackdrop(backdropElement: HTMLElement): void {
    if (backdropElement && backdropElement.parentNode) {
      document.body.removeChild(backdropElement);
    }
  }

  /**
   * Generates a unique ID for the bottom sheet.
   * @returns {string} The generated unique ID.
   */
  private _generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Gets the width style for the bottom sheet.
   * @param {'small' | 'medium' | 'large' | 'full' | string} width - The width of the bottom sheet.
   * @returns {string} The width style.
   */
  private _getWidthStyle(
    width?: 'small' | 'medium' | 'large' | 'full' | string
  ): string {
    const screenWidth = this._windowRef.nativeWindow.innerWidth;
    if (screenWidth < 768) {
      return '100%';
    } else {
      switch (width) {
        case 'small':
          return '30%';
        case 'medium':
          return '60%';
        case 'large':
          return '90%';
        case 'full':
          return '100%';
        default:
          return width || '100%';
      }
    }
  }

  /**
   * Gets the height style for the bottom sheet.
   * @param {'full' | 'top' | 'mid' | 'quarter' | string} height - The height of the bottom sheet.
   * @returns {string} The height style.
   */
  private _getHeightStyle(
    height: 'full' | 'top' | 'mid' | 'quarter' | string
  ): string {
    switch (height) {
      case 'full':
        return '100%';
      case 'top':
        return '80%';
      case 'mid':
        return '50%';
      case 'quarter':
        return '25%';
      default:
        return height;
    }
  }

  /**
   * Updates the size of the bottom sheet.
   */
  private _updateBottomSheetSize(): void {
    this._bottomSheetInstances.forEach((instance) => {
      const domElem = (instance.ref.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      domElem.style.width = this._getWidthStyle(instance?.config?.width);
    });
  }
}
