import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token on login', () => {
    const dummyResponse = { token: 'dummy-jwt-token' };
    service.login('test@example.com', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(localStorage.getItem('token')).toBe(dummyResponse.token);
  });

  it('should remove token on logout and navigate to login', () => {
    localStorage.setItem('token', 'dummy-jwt-token');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return token from localStorage', () => {
    const dummyToken = 'dummy-jwt-token';
    localStorage.setItem('token', dummyToken);

    expect(service.getToken()).toBe(dummyToken);
  });

  it('should decode user role from token', () => {
    const tokenPayload = { role: 'admin' };
    const dummyToken = `dummy.${btoa(JSON.stringify(tokenPayload))}.dummy`;
    localStorage.setItem('token', dummyToken);

    expect(service.getUserRole()).toBe('admin');
  });

  it('should decode current user ID from token', () => {
    const tokenPayload = { id: 'user123' };
    const dummyToken = `dummy.${btoa(JSON.stringify(tokenPayload))}.dummy`;
    localStorage.setItem('token', dummyToken);

    expect(service.getCurrentUserId()).toBe('user123');
  });

  it('should return null if no token found in getCurrentUserId', () => {
    localStorage.removeItem('token');
    expect(service.getCurrentUserId()).toBeNull();
  });

  it('should sign up and store token', () => {
    const dummyResponse = { token: 'dummy-jwt-token' };
    service.signUp('Test User', 'test@example.com', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(localStorage.getItem('token')).toBe(dummyResponse.token);
  });

  it('should get users', () => {
    const dummyUsers: User[] = [{ name: 'John Doe', email: 'john@example.com', password: '12345' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should delete a user', () => {
    const userId = 'user123';

    service.deleteUser(userId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`http://localhost:3000/auth/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should make a user admin', () => {
    const superAdminId = 'superAdminId';
    const userId = 'userId';
    const dummyUser: User = { name: 'John', email: 'john@example.com', password: '12345' };

    service.makeAdmin(superAdminId, userId).subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/auth/${userId}/makeAdmin`);
    expect(req.request.method).toBe('PATCH');
    req.flush(dummyUser);
  });

  it('should make an admin user back to regular user', () => {
    const superAdminId = 'superAdminId';
    const userId = 'userId';
    const dummyUser: User = { name: 'John', email: 'john@example.com', password: '12345' };

    service.makeUser(superAdminId, userId).subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/auth/${userId}/makeUser`);
    expect(req.request.method).toBe('PATCH');
    req.flush(dummyUser);
  });
});
