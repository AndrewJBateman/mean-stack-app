import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs"; // emitter
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

// makes this service available at the root level
@Injectable({ providedIn: "root" }) // used this instead of registering in app.module; creates only one instance for enire app.
export class PostsService {
  // props
  private posts: Post[] = [];
  // define new emitter that carries a {posts:.... , postCount: ...} payload
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>(); // define new emitter that carries Post[] payload

  constructor(private http: HttpClient, private router: Router) {}

  // methods
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any[]; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      // adding pipe operator map()
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // send as observable to other components
  }

  // get api single post for editing and update on page reload; returns to become an observable in post-create.ts
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  // create post
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  // update post
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData).subscribe(
      (response) => {
        this.router.navigate(["/"]);
      },
      (err) => {
        this.router.navigate(["/login"]);
      }
    );
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
  }
}
