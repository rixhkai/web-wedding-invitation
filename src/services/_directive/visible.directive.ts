import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from "@angular/core";
import { delay, filter, Subject } from "rxjs";

@Directive({
  selector: '[observeVisibility]',
})
export class ObserveVisibilityDirective
  implements OnDestroy, OnInit, AfterViewInit {
  @Input() debounceTime = 0;
  @Input() threshold = 1;
  @Input() parentEl: Element | undefined = undefined;

  @Output() visible = new EventEmitter<{elm: HTMLElement, type: string, scrollFrom: string}>();

  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  } | undefined>();

  private scrollFrom: 'bottom' | 'top' = 'top';

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // this.createObserver();
    const el = (this.element.nativeElement as Element)
    // const parentScroll: Element | null = this.getScrollParent(el);
    console.log('check element ', el.parentElement, this.parentEl)
    if (this.parentEl) {
      var lastScrollTop = 0;
      let hasClass = false;
      this.renderer.removeClass(this.element.nativeElement, 'aos-animate');
      // this.parentEl.addEventListener('scroll', async (event) => {
      //   // console.log("on event scroll ", event, (this.element.nativeElement as Element).className, (this.element.nativeElement as Element).scrollHeight, (this.element.nativeElement as Element).getBoundingClientRect().top);
      //   var st = (event.target as Element).scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      //   // console.log('check scroll top ', st,)
      //   let threshold = 300;
      //   let clientHeight = (event.target as Element).clientHeight;
      //   if (st > lastScrollTop) {
      //      // downscroll code
      //     //  console.log('check on scroll bot', this.parentEl, this.element.nativeElement);
      //     const isVisible = await this.isVisible(this.element.nativeElement);
      //     console.log('is visible ', (this.element.nativeElement as Element).className, isVisible);
      //      if (isVisible && (this.element.nativeElement as Element).getBoundingClientRect().top <= clientHeight + threshold && !hasClass) {
      //       (this.element.nativeElement as Element).classList.add('aos-animate');
      //       console.log('adding class ', (this.element.nativeElement as Element).className);
      //       hasClass = true;
      //      }

      //      if (!isVisible && (this.element.nativeElement as Element).getBoundingClientRect().top >= 0 && hasClass) {
      //       (this.element.nativeElement as Element).classList.remove('aos-animate');
      //       hasClass = false;
      //      }
      //   } else if (st < lastScrollTop) {
      //      // upscroll code
      //     //  console.log('check on scroll top', this.parentEl, this.element.nativeElement);
      //     const isVisible = await this.isVisible(this.element.nativeElement);
      //      if (!isVisible && (this.element.nativeElement as Element).getBoundingClientRect().top >= 20 && hasClass) {
      //       (this.element.nativeElement as Element).classList.remove('aos-animate');
      //       hasClass = false;
      //      }
      //   }
      //   lastScrollTop = st;
      // })
      
    }
    // (this.element.nativeElement as Element).classList.remove('aos-animate');
  }

  getScrollParent = (node: Element, axis = 'y'): any => {
    let el = node;
    if (!(el instanceof HTMLElement || el instanceof ShadowRoot)) {
      return null;
    }
  
    if (el instanceof ShadowRoot) {
      el = el.host;
    }
    const style = window.getComputedStyle(el);
    const overflow = axis === 'y' ? style.overflowY : style.overflowX;
    const scrollSize = axis === 'y' ? el.scrollHeight : el.scrollWidth;
    const clientSize = axis === 'y' ? el.clientHeight : el.clientWidth;
    const isScrolled = scrollSize > clientSize;
  
    if (isScrolled && !overflow.includes('visible') && !overflow.includes('hidden')) {
      return {
        scrollParent: el,
        scrollParentSize: scrollSize,
        clientParentSize: clientSize,
      };
    }
  
    return this.getScrollParent(el.parentNode as Element, axis) || document.body;
  };

  onScroll() {
    console.log('on scroll ', this.element.nativeElement.scrollTop)
    if (this.element.nativeElement.scrollTop > 20) {
      this.renderer.addClass(this.element.nativeElement, 'aos-animate');
    } else {
      this.renderer.removeClass(this.element.nativeElement, 'aos-animate');
    }
  }

  ngAfterViewInit() {
    // this.startObservingElements();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    this.subject$.next(undefined);
    this.subject$.complete();
  }

  private isVisible(element: HTMLElement) {
    return new Promise(resolve => {
      const observer = new IntersectionObserver(([entry]) => {
        resolve(entry.intersectionRatio === 1);
        observer.disconnect();
      });

      observer.observe(element);
    });
  }

  private createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: this.threshold,
    };

    const isIntersecting = (entry: IntersectionObserverEntry) =>
      entry.isIntersecting || entry.intersectionRatio > 0;

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const fromTop = entry.intersectionRect.top;
        const fromBottom = entry.rootBounds!.height - entry.intersectionRect.bottom;
        if (isIntersecting(entry)) {
          this.subject$.next({ entry, observer });
        }

        if (fromTop > fromBottom && entry.isIntersecting === true) {
          // console.log('Element is scrolling in from Top!');
          this.scrollFrom = 'top';
        }
      
        if (fromBottom >fromTop && entry.isIntersecting === true) {
          // console.log('Element is scrolling in from Bottom!');
          this.scrollFrom = 'bottom';
        }
      });
    }, options);
  }

  private startObservingElements() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);

    this.subject$
      .pipe(delay(this.debounceTime), filter(Boolean))
      .subscribe(async ({ entry, observer }) => {
        const target = entry.target as HTMLElement;
        const isStillVisible = await this.isVisible(target);

        if (isStillVisible) {
          // console.log('visible ', target)
          this.visible.emit({elm: target, type: 'visible', scrollFrom: this.scrollFrom});
          if (this.scrollFrom == 'top') {
            // (this.element.nativeElement as Element).classList.add('aos-animate');
          }
          // observer.unobserve(target);
        } else {
          this.visible.emit({elm: target, type: 'not-visible', scrollFrom: this.scrollFrom});
          if (this.scrollFrom == 'bottom') {
            // (this.element.nativeElement as Element).classList.remove('aos-animate');
          }
        }
      });
  }
}