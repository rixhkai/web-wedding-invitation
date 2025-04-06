import { inject, Injectable, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class DisqusService {
  private disqus: any;
  private readonly shortname: string = "rijlab";
  private readonly document = inject(DOCUMENT);

  loadDisqus(renderer: Renderer2, id: string): void {
    this.disqus = (window as any)["DISQUS"];
    if (!this.disqus) {
      console.log('load disqus ');
      (window as any).disqus_config = function () {
        this.page.identifier = id;
        this.page.url = 'https://wedding-invitation.rijlab.com';
      };
      console.log('loading disqus script')
      const script = renderer.createElement("script");
      script.type = "text/javascript";
      script.src = "https://" + this.shortname + ".disqus.com/embed.js";
      renderer.appendChild(this.document.body, script);
    } else {
      console.log('reset loading disqus script');
      (window as any)["DISQUS"].reset({
        reload: true,
        config: function () {
          this.page.url = 'https://wedding-invitation.rijlab.com';
        },
      });
    }
  }
}