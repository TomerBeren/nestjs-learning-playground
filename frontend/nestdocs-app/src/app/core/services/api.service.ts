import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  LoginResponse,
  AuthProfile,
  Cat,
  CreateCatDto,
  UpdateCatDto,
  HealthCheckResponse,
  ApiResponse
} from '../models';

/**
 * ApiService - Single Responsibility Principle
 * Handles all HTTP communication with the backend API
 * Uses environment configuration and strongly typed interfaces
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ==================== Health Check ====================
  
  /**
   * Check API health status
   * @returns Observable with health check response
   */
  healthCheck(): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(this.apiUrl);
  }

  // ==================== User Endpoints ====================
  
  /**
   * Create a new user
   * @param userData User creation data
   * @returns Observable with created user
   */
  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  /**
   * Get all users
   * @returns Observable with array of users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * Get user by ID
   * @param id User ID
   * @returns Observable with user data
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Update user
   * @param id User ID
   * @param userData Updated user data
   * @returns Observable with updated user
   */
  updateUser(id: number, userData: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  /**
   * Delete user
   * @param id User ID
   * @returns Observable with deletion result
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // ==================== Auth Endpoints ====================
  
  /**
   * Login with credentials
   * @param credentials Login credentials (username, password)
   * @returns Observable with JWT access token
   */
  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Get authenticated user profile
   * @returns Observable with user profile
   */
  getProfile(): Observable<AuthProfile> {
    return this.http.get<AuthProfile>(`${this.apiUrl}/auth/profile`);
  }

  // ==================== Cat Endpoints ====================
  
  /**
   * Get all cats
   * @returns Observable with array of cats
   */
  getAllCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${this.apiUrl}/cats`);
  }

  /**
   * Create a new cat
   * @param catData Cat creation data
   * @returns Observable with created cat
   */
  createCat(catData: CreateCatDto): Observable<Cat> {
    return this.http.post<Cat>(`${this.apiUrl}/cats`, catData);
  }

  /**
   * Get cat by ID
   * @param id Cat ID
   * @returns Observable with cat data
   */
  getCatById(id: number): Observable<Cat> {
    return this.http.get<Cat>(`${this.apiUrl}/cats/${id}`);
  }

  /**
   * Update cat
   * @param id Cat ID
   * @param catData Updated cat data
   * @returns Observable with updated cat
   */
  updateCat(id: number, catData: UpdateCatDto): Observable<Cat> {
    return this.http.patch<Cat>(`${this.apiUrl}/cats/${id}`, catData);
  }

  /**
   * Delete cat
   * @param id Cat ID
   * @returns Observable with deletion result
   */
  deleteCat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cats/${id}`);
  }
}
