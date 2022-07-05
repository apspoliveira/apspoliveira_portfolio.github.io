import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
//import { DISHES } from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  dishForm: FormGroup;
  comment: Comment;
  commentPreview: Comment;
  valid: true;
  dishcopy: Dish;
  visibility = 'shown';
  @ViewChild('dform') dishFormDirective: any;

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  formErrors: any = {
    'author': '',
    'comment': ''
  }

  validationMessages: any = {
    'author': {
      'required': 'Author name is required.',
      'minlength': 'Author name must be at least 2 characters long.',
      'maxlength': 'Author name cannot be more than 25 characters.'
    },
    'comment': {
      'required': 'Comment is required.'
    }
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.dishForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: ['5'],
      comment: ['', [Validators.required]]
    });

    this.dishForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages

  }

  onValueChanged(data?: any) {
    if (!this.dishForm) { return; }
    const form = this.dishForm;
    const formErrors = this.formErrors;
    for (const field in formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          const errors = control.errors
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }

      // Fill comment with default values
      this.commentPreview = new Comment();
      this.commentPreview.author = "";
      this.commentPreview.comment = "";
      this.commentPreview.date = "";
      this.commentPreview.rating = 5;

      var comment = this.dishForm.get('comment')?.value;
      this.commentPreview.author = this.dishForm.get('author')?.value;
      this.commentPreview.rating = this.dishForm.get('rating')?.value != "" ? this.dishForm.get('rating')?.value : 5;
      this.commentPreview.comment = this.dishForm.get('comment')?.value;
      this.commentPreview.date = Date.now().toString();
      
      this.comment = this.dishForm.value;
      this.comment = this.formErrors.length
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.dishForm.value;
    // Add today date
    var today = new Date();
    var date = this.months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
    this.comment.date = date;

    // Add new comment to comments of current dish
    //DISHES.filter((dish) => (dish.id == this.dishcopy.id))[0].comments.push(this.comment);

    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      }, 
      errmess => { this.dish = new Dish() /* null*/; this.dishcopy = new Dish() /* null */; this.errMess = <any>errmess; });
    this.dishFormDirective.resetForm();
    // reset form
    this.dishForm.reset({
      author: '',
      rating: 5,
      comment: ''
    })
    
    // set default rating
    this.dishForm = this.fb.group({
      rating: ['5']
    });
  }
}
