/*import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
}*/

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';
//from '../../auth.options';
import { getDeepFromObject } from '@nebular/auth/helpers';
//from '../../helpers';

//import { NbAuthService } from '@nebular/auth/services/auth.service';
import { NbAuthService } from '@nebular/auth';
//import { NbAuthResult } from '@nebular/auth/services/auth-result';
import { NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = 'email';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      console.info("Response: " + result.getResponse());

      console.info("Is authenticated? " + this.service.isAuthenticated());

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      console.info("Redirect:" + redirect);
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
