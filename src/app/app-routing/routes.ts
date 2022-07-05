import { Routes } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { ExperienceComponent } from '../experience/experience.component';
import { EducationComponent } from '../education/education.component';
import { ExpertiseComponent } from '../expertise/expertise.component';
import { SkillsComponent } from '../skills/skills.component';
import { MotivationComponent } from '../motivation/motivation.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { HobbiesComponent } from '../hobbies/hobbies.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'experience', component: ExperienceComponent},
    {path: 'education', component: EducationComponent},
    {path: 'expertise', component: ExpertiseComponent},
    {path: 'skills', component: SkillsComponent},
    {path: 'motivation', component: MotivationComponent},
    {path: 'gallery', component: GalleryComponent},
    {path: 'hobbies', component: HobbiesComponent},
    {path: 'contact', component: ContactComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];