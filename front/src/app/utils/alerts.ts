import Swal from 'sweetalert2';

const buttonClasses = { confirmButton: 'swal-btn', cancelButton: 'swal-btn swal-btn--cancel' };

export async function confirmDelete(): Promise<boolean> {
  const result = await Swal.fire({
    title: 'Supprimer cette pollution ?',
    text: 'Cette action est définitive.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '<i class="fa-regular fa-trash-can"></i> Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true, 
    buttonsStyling: false,
    customClass: { ...buttonClasses, confirmButton: 'swal-btn swal-btn--danger' }
  });
  return result.isConfirmed;
}

export function showError(message: string): void {
  void Swal.fire({
    title: 'Erreur',
    text: message,
    icon: 'error',
    buttonsStyling: false,
    customClass: buttonClasses
  });
}
