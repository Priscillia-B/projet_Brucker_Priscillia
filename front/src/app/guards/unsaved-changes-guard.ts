import { CanDeactivateFn } from '@angular/router';
import { confirmLeave } from '../utils/alerts';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  component.hasUnsavedChanges() ? confirmLeave() : true;
