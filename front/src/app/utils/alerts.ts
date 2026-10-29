// SweetAlert est chargé seulement au premier affichage d'une fenêtre
const loadSwal = async () => (await import('sweetalert2')).default;

const buttonClasses = { confirmButton: 'swal-btn', cancelButton: 'swal-btn swal-btn--cancel' };

export async function confirmDelete(): Promise<boolean> {
  const Swal = await loadSwal();
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

export async function showError(message: string): Promise<void> {
  const Swal = await loadSwal();
  await Swal.fire({
    title: 'Erreur',
    text: message,
    icon: 'error',
    buttonsStyling: false,
    customClass: buttonClasses
  });
}
