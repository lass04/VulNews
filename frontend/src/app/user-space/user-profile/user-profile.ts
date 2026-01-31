import { AuthService } from './../../core/services/auth/auth-service';
import { UserService } from './../../core/services/user/user-svc';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from './../../components/navbar/navbar';
import { User } from './../../interfaces/User';
import { Post } from './../../interfaces/Post';
import { PostService } from './../../core/services/post/post-svc';
import { Comment } from './../../interfaces/Comment';
import { CommentService } from './../../core/services/comment/comment-svc';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './user-profile.html'
})

export class Profile implements OnInit {

  currentUser!: User;
  userPosts: Post[] = [];
  userComments: Comment[] = [];
  userStats = {
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    memberSince: ''
  };
  
  loading: boolean = true;
  activeTab: 'posts' | 'comments' | 'activity' = 'posts';
  
  // Edit mode
  isEditMode: boolean = false;
  editForm = {
    firstName: '',
    lastName: '',
    email: ''
  };
  isUpdating: boolean = false;
  
  private userSvc = inject(UserService);
  private authSvc = inject(AuthService);
  private postSvc = inject(PostService);
  private commentSvc = inject(CommentService);

  constructor() {}

  ngOnInit() {
    this.currentUser = this.authSvc.getUser();
    this.initializeEditForm();
    this.loadUserData();
    this.calculateStats();
  }

  initializeEditForm() {
    this.editForm = {
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email
    };
  }

  loadUserData() {
    this.loading = true;
    
    // Load user's posts
    this.postSvc.getPosts().subscribe({
      next: (res) => {
        this.userPosts = res.data.filter(
          (post: Post) => post.author._id === this.currentUser._id
        );
        this.userStats.totalPosts = this.userPosts.length;
        
        // Calculate total likes
        this.userStats.totalLikes = this.userPosts.reduce(
          (total, post) => total + (post.reactions?.length || 0), 
          0
        );
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    
    // Load user's comments (you'll need to add this API endpoint)
    // For now, we'll load all comments and filter
    this.loadUserComments();
  }

  loadUserComments() {
    // This assumes you have a method to get all comments
    // You might need to adjust based on your API
    this.postSvc.getPosts().subscribe({
      next: (res) => {
        const allPosts = res.data;
        this.userComments = [];
        
        allPosts.forEach((post: Post) => {
          if (post.comments) {
            const userCommentsInPost = post.comments.filter(
              (comment: Comment) => comment.author._id === this.currentUser._id
            );
            this.userComments.push(...userCommentsInPost);
          }
        });
        
        this.userStats.totalComments = this.userComments.length;
      }
    });
  }

  calculateStats() {
    const memberSince = new Date(this.currentUser.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - memberSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      this.userStats.memberSince = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      this.userStats.memberSince = `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      this.userStats.memberSince = `${years} year${years !== 1 ? 's' : ''}`;
    }
  }

  switchTab(tab: 'posts' | 'comments' | 'activity') {
    this.activeTab = tab;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Reset form if canceling
      this.initializeEditForm();
    }
  }

  updateProfile() {
    if (!this.editForm.firstName.trim() || !this.editForm.lastName.trim() || !this.editForm.email.trim()) {
      alert('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editForm.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    this.isUpdating = true;
    
    // You'll need to implement this in your AuthService or UserService
    // For now, this is a placeholder
    const updateData = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      email: this.editForm.email
    };
    
    // Assuming you have an updateUser method in AuthService
    this.userSvc.updateUser(this.currentUser._id, updateData).subscribe({
      next: (res) => {
        this.currentUser.firstName = this.editForm.firstName;
        this.currentUser.lastName = this.editForm.lastName;
        this.currentUser.email = this.editForm.email;
        
        // Update user in local storage
        this.authSvc.storeUser(this.currentUser);
        
        this.isEditMode = false;
        this.isUpdating = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile. Please try again.');
        this.isUpdating = false;
      }
    });
  }

  deletePost(post: Post) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    this.postSvc.deletePost(post._id).subscribe({
      next: () => {
        const index = this.userPosts.findIndex(p => p._id === post._id);
        if (index > -1) {
          this.userPosts.splice(index, 1);
          this.userStats.totalPosts--;
        }
        alert('Post deleted successfully');
      },
      error: () => {
        alert('Failed to delete post');
      }
    });
  }

  getInitials(): string {
    const first = this.currentUser.firstName?.[0]?.toUpperCase() || '';
    const last = this.currentUser.lastName?.[0]?.toUpperCase() || '';
    return first + last;
  }

  getRoleBadgeClass(): string {
    return this.currentUser.role === 'admin' 
      ? 'bg-red-100 text-red-800 border-red-300' 
      : 'bg-blue-100 text-blue-800 border-blue-300';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
