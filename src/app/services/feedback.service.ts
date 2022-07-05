import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<any> {
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };*/
    const headers = {
      'Content-Type': 'application/json'
    }

    const body=JSON.stringify(feedback);
    return this.http.post(baseURL + 'feedback', body, {'headers':headers})
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
