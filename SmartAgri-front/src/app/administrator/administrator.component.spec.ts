import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministratorComponent } from './administrator.component';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('AdministratorComponent', () => {
  let component: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsers', 'deleteUser', 'makeAdmin', 'makeUser', 'getCurrentUserId']);

    await TestBed.configureTestingModule({
      declarations: [AdministratorComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users', () => {
    const mockUsers = [{ _id: '1', name: 'User 1', email: 'user1@example.com' }];
    authServiceSpy.getUsers.and.returnValue(of(mockUsers));

    component.loadUsers();

    expect(component.users).toEqual(mockUsers);
  });

  it('should handle user deletion', () => {
    authServiceSpy.deleteUser.and.returnValue(of(undefined));
    component.deleteUser('1');
    expect(authServiceSpy.deleteUser).toHaveBeenCalledWith('1');
  });
});
