import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router'; // ParamMap contains route info
import { Subscription } from 'rxjs';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { AuthService } from '../../auth/auth.service';
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {};

  ngOnInit() {
    // setting loading spinner
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]

      })
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => { // listen for changes in the route and use callback fnctn
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          })
        });
      } else {
        this.mode = 'create';
        this.postId = 'null';
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); // target single control; setValue targets all input controls
    this.form.get('image').updateValueAndValidity();  // check for everything
    // file reader tool
    const reader = new FileReader();
    reader.onload = () => {     // async cb
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost(){
     // if form is empty return
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // calling service according to 'mode'
    if (this.mode ==='create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        )
    }
    this.form.reset();
  }

 }
