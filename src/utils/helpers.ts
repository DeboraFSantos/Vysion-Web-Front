import { format } from 'date-fns';

export const helpers = {
    formatDate(date:string) {
        const originalDate = new Date(date);
        const formattedDate = format(originalDate, 'dd/MM/yyyy');

        return formattedDate
    },
    centsToReal(value:any) {
        if(!isNaN(value)) {
            return (value / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        } else {
            return 'Valor inválido'
        }
    },
    getCurrentRole() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        return currentUser.role;
    },
    getCurrentUser() {
        const currentUserString = localStorage.getItem('currentUser');
      
        if (currentUserString) {
          try {
            const currentUser = JSON.parse(currentUserString);
            return currentUser;
          } catch (error) {
            return null; 
          }
        } else {
          return null;
        }
      }
      
};