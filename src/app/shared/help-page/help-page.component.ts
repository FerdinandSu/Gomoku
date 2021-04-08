import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MessageService} from '../../services/message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit, OnDestroy {

  public helpFile!: string;
  private routerSubscription!: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
  )
  {
  }

  public Load(): void {
    const resourceName = this.route.snapshot.paramMap.get('resourceName');
    this.router.onSameUrlNavigation = 'reload';
    this.helpFile = `/assets/help-files/${resourceName}.md`;
  }

  ngOnInit(): void {
    console.log('onload');
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
      }
    });
    this.Load();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

}
