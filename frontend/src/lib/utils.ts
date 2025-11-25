import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_URL = 'http://localhost:5000'; 

/**
 * Memastikan URL gambar yang digunakan adalah URL yang benar, baik itu link eksternal atau file lokal.
 * @param posterPath Nilai dari movie.poster
 * @returns URL gambar yang dapat digunakan di tag <img>
 */
const getFullPosterUrl = (posterPath: string) => {
  // 1. Cek apakah path sudah merupakan URL penuh (dimulai dengan http/https)
  if (posterPath && (posterPath.startsWith('http://') || posterPath.startsWith('https://'))) {
    // Jika sudah berupa URL link, kembalikan apa adanya (ini untuk gambar dari link eksternal)
    return posterPath;
  } 
  
  // 2. Jika bukan URL link, asumsikan itu adalah nama file lokal
  // Rakit URL lengkap untuk file yang tersimpan di server Express.js
  // Ingat: /uploads adalah endpoint statis, dan /posters adalah subfolder penyimpanan.
  if (posterPath) {
    return `${BASE_URL}/uploads/posters/${posterPath}`;
  }
  
  // 3. Jika tidak ada path, kembalikan placeholder atau string kosong
  return '/placeholder-image.jpg'; // Ganti dengan path gambar default jika ada
};