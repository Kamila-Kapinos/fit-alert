import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAPhotoComponent } from './take-a-photo.component';

describe('TakeAPhotoComponent', () => {
  let component: TakeAPhotoComponent;
  let fixture: ComponentFixture<TakeAPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeAPhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TakeAPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
