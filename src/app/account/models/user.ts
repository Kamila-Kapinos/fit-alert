export interface User {
  name: string;
  surname: string;
  email: string;
  phone: string;
  hashedPassword: string; // Zamiast przechowywać czyste hasło, przechowujemy jego zaszyfrowaną wersję
}

