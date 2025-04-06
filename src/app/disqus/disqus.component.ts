import { Component, ElementRef, Renderer2, ViewChild, OnChanges, PLATFORM_ID, inject, input } from "@angular/core";
import { DisqusService } from "../../services/disqus/disqus.service";
// import { faComment } from "@fortawesome/free-regular-svg-icons";
import { isPlatformBrowser } from "@angular/common";
// import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";
// import { TranslateModule } from "@ngx-translate/core";
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: "app-disqus",
  templateUrl: "./disqus.component.html",
  styleUrls: ["./disqus.component.scss"],
  imports: [RouterLink, IonIcon],
  standalone: true
})
export class DisqusComponent implements OnChanges {
  private disqusS = inject(DisqusService);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private platformId = inject<object>(PLATFORM_ID);

  readonly identifier = input<string>();
  disqusDiv = ViewChild("disqusDiv");
  private observer: IntersectionObserver | undefined;
  // faComment = faComment;

  ngOnChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.disconnect();
    if (!this.identifier()) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) await this.isVisible();
      });
    });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async isVisible() {
    console.log('is visible ');
    const identifier = this.identifier();
    if (identifier) {
      await this.disqusS.loadDisqus(this.renderer, identifier);
      this.observer?.disconnect();
    }
  }
  
  disconnect() {
    try {
      if (this.observer) this.observer.disconnect();
    } catch (error) {
      
    }
  }
}
