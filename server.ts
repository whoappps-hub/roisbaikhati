// @ts-ignore: allow importing express without installed type declarations
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
// Try to load optional Gemini SDK. If not installed, continue without it.
let GoogleGenAI: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("@google/genai");
  GoogleGenAI = mod.GoogleGenAI || mod.default || mod;
} catch (e) {
  console.warn("Optional module @google/genai not found; continuing without Gemini SDK.");
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: any = null;
if (apiKey) {
  if (GoogleGenAI) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY is set but @google/genai is not installed. AI disabled.");
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. AI recommendations will fall back to local rules.");
}

// Simple JSON Database System
const DB_FILE = path.join(process.cwd(), "db.json");

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  synopsis: string;
  rating: number;
  reviews: Review[];
  coverUrl?: string;
}

interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned" | "overdue";
}

interface AppDatabase {
  books: Book[];
  loans: Loan[];
  statistics: {
    monthlyTarget: number;
    loansByCategory: { [key: string]: number };
  };
}

const DEFAULT_BOOKS: Book[] = [
  {
    id: "1",
    title: "Belajar React dan Next.js Modern",
    author: "Wicaksono Santoso",
    category: "Teknologi",
    year: 2023,
    shelfLocation: "Rak Teknologi T-12",
    totalCopies: 5,
    availableCopies: 4,
    synopsis: "Panduan lengkap membangun web modern interaktif berbasis sasis React 18, Next.js, dan Tailwind CSS dari dasar hingga mahir.",
    rating: 4.8,
    reviews: [
      { id: "r1", user: "Andi Wijaya", rating: 5, comment: "Sangat mudah dipahami untuk pemula!", date: "2026-06-01" },
      { id: "r2", user: "Siti Rahma", rating: 4, comment: "Metode penulisan kode sangat rapi.", date: "2026-06-03" }
    ]
  },
  {
    id: "2",
    title: "Kecerdasan Buatan untuk Kemanusiaan",
    author: "Dr. Eng. Habibie Iskandar",
    category: "Teknologi",
    year: 2024,
    shelfLocation: "Rak Teknologi T-15",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Eksplorasi mendalam tentang model bahasa besar, jaringan saraf tiruan, dan bagaimana AI dapat dioptimalkan untuk mempermudah hidup manusia sehari-hari.",
    rating: 4.7,
    reviews: [
      { id: "r3", user: "Budi Setiawan", rating: 5, comment: "Analisis masa depan AI yang sangat humanistik.", date: "2026-05-15" }
    ]
  },
  {
    id: "3",
    title: "Filosofi Teras: Hidup Tenang ala Stoisisme",
    author: "Henry Manampiring",
    category: "Sastra & Filsafat",
    year: 2019,
    shelfLocation: "Rak Sosial S-01",
    totalCopies: 8,
    availableCopies: 6,
    synopsis: "Buku pengembangan diri praktis yang mengenalkan filsafat Yunani-Romawi kuno (Stoisisme) untuk mengatasi kekhawatiran berlebih di era modern.",
    rating: 4.9,
    reviews: [
      { id: "r4", user: "Naufal Arifin", rating: 5, comment: "Buku terbaik untuk menenangkan pikiran yang overthinking.", date: "2026-05-20" }
    ]
  },
  {
    id: "4",
    title: "Sejarah Ringkas Nusantara",
    author: "Prof. Irwan Mansyur",
    category: "Sejarah",
    year: 2021,
    shelfLocation: "Rak Sejarah H-03",
    totalCopies: 4,
    availableCopies: 2,
    synopsis: "Menelusuri sejarah Indonesia sejak zaman kerajaan Buddha-Hindu, kejayaan Islam, era kolonial, hingga terbentuknya Republik Indonesia modern.",
    rating: 4.5,
    reviews: [
      { id: "r5", user: "Dewi Lestari", rating: 4, comment: "Informasinya sangat lengkap beserta ilustrasi peta kuno.", date: "2026-06-05" }
    ]
  },
  {
    id: "5",
    title: "Fisika Kuantum & Misteri Semesta",
    author: "Dian Permana S.Si",
    category: "Sains",
    year: 2022,
    shelfLocation: "Rak Sains S-08",
    totalCopies: 3,
    availableCopies: 2,
    synopsis: "Menguraikan konsep mekanika kuantum yang rumit, paradoks kucing Schrodinger, hingga keterikatan kuantum dalam bahasa populer yang menawan.",
    rating: 4.6,
    reviews: [
      { id: "r6", user: "Eko Prasetyo", rating: 5, comment: "Akhirnya saya paham mengapa fisika kuantum itu menakjubkan.", date: "2026-05-28" }
    ]
  },
  {
    id: "6",
    title: "Atomic Habits: Perubahan Kecil untuk Hasil Luar Biasa",
    author: "James Clear (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2020,
    shelfLocation: "Rak Psikologi P-04",
    totalCopies: 6,
    availableCopies: 5,
    synopsis: "Strategi teruji untuk membentuk kebiasaan baik, menghentikan kebiasaan buruk, dan menguasai perubahan perilaku kecil yang menghasilkan dampak luar biasa.",
    rating: 4.9,
    reviews: [
      { id: "r7", user: "Rara Kirana", rating: 5, comment: "Sangat transformatif jika benar-benar dipraktikkan.", date: "2026-06-02" }
    ]
  },
  {
    id: "7",
    title: "Ekonomi Makro di Era Digital",
    author: "Dr. Sri Mulyati",
    category: "Bisnis & Keuangan",
    year: 2022,
    shelfLocation: "Rak Bisnis B-09",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Analisis dinamika ekonomi makro global dan dampaknya terhadap startup, ekosistem mata uang kripto, serta inflasi di era serba digital.",
    rating: 4.3,
    reviews: []
  },
  {
    id: "8",
    title: "Clean Code: Panduan Praktis Menulis Kode yang Bersih",
    author: "Robert C. Martin (Terjemahan)",
    category: "Teknologi",
    year: 2018,
    shelfLocation: "Rak Teknologi T-02",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Buku panduan klasik bagi programmer profesional untuk menulis kode yang mudah dibaca, dipelihara, dan diuji.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "9",
    title: "Arsitektur Microservices dan Cloud Native",
    author: "Ahmad Rosadi",
    category: "Teknologi",
    year: 2023,
    shelfLocation: "Rak Teknologi T-05",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Penjelasan lengkap mengenai desain arsitektur modern menggunakan Docker, Kubernetes, dan Google Cloud Platform.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "10",
    title: "Cybersecurity untuk Pemula & Pengusaha",
    author: "Budi Raharjo",
    category: "Teknologi",
    year: 2022,
    shelfLocation: "Rak Teknologi T-08",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Mengamankan jaringan komputer, server web, dan data pribadi dari serangan siber dengan metode pertahanan terkini.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "11",
    title: "Dasar Pemrograman Python untuk Sains Data",
    author: "Teguh Wahyono",
    category: "Teknologi",
    year: 2021,
    shelfLocation: "Rak Teknologi T-10",
    totalCopies: 6,
    availableCopies: 5,
    synopsis: "Langkah mudah memahami sintaks Python, manipulasi data menggunakan Pandas, NumPy, serta visualisasi data dasar.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "12",
    title: "Desain UI/UX: Prototyping Menawan dengan Figma",
    author: "Rian Adriadi",
    category: "Teknologi",
    year: 2024,
    shelfLocation: "Rak Teknologi T-14",
    totalCopies: 5,
    availableCopies: 4,
    synopsis: "Menyelami teknik user research, wireframing, pembuatan sistem desain, hingga prototipe interaktif modern di Figma.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "13",
    title: "Membangun Aplikasi Android dengan Kotlin dan Jetpack Compose",
    author: "Yudha Pratama",
    category: "Teknologi",
    year: 2023,
    shelfLocation: "Rak Teknologi T-16",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Panduan implementasi arsitektur Model-View-ViewModel (MVVM) modern untuk aplikasi Android berkinerja tinggi.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "14",
    title: "Blockchain & Smart Contracts: Teori dan Implementasi",
    author: "Irvan Gunawan",
    category: "Teknologi",
    year: 2022,
    shelfLocation: "Rak Teknologi T-18",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Membahas cara kerja rantai blok, konsensus terdistribusi, serta pemrograman smart contract menggunakan Solidity.",
    rating: 4.4,
    reviews: []
  },
  {
    id: "15",
    title: "Cosmos: Menjelajahi Batas Waktu dan Ruang",
    author: "Carl Sagan (Terjemahan)",
    category: "Sains",
    year: 1995,
    shelfLocation: "Rak Sains S-02",
    totalCopies: 6,
    availableCopies: 6,
    synopsis: "Salah satu karya sains terpopuler sepanjang masa yang membahas hubungan antara peradaban manusia dan luasnya kosmos.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "16",
    title: "Asal-usul Spesies (The Origin of Species)",
    author: "Charles Darwin (Terjemahan)",
    category: "Sains",
    year: 2015,
    shelfLocation: "Rak Sains S-04",
    totalCopies: 2,
    availableCopies: 2,
    synopsis: "Buku legendaris yang merumuskan dasar teori evolusi melalui seleksi alam dan adaptasi makhluk hidup terhadap lingkungan.",
    rating: 4.4,
    reviews: []
  },
  {
    id: "17",
    title: "Gen: Riwayat Intim tentang Rahasia Kehidupan",
    author: "Siddhartha Mukherjee (Terjemahan)",
    category: "Sains",
    year: 2018,
    shelfLocation: "Rak Sains S-05",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Kisah menakjubkan tentang penemuan gen, kode genetik manusia, fajar bioteknologi, hingga perdebatan moral rekayasa genetika.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "18",
    title: "Pengantar Astronomi & Astrofisika Modern",
    author: "Dr. Thomas Djamaluddin",
    category: "Sains",
    year: 2021,
    shelfLocation: "Rak Sains S-09",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Mempelajari fisika bintang, galaksi, lubang hitam, sejarah terbentuknya tata surya, dan kosmologi modern.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "19",
    title: "Biokimia Dasar: Memahami Proses Kimiawi Tubuh",
    author: "Prof. Endang Sukara",
    category: "Sains",
    year: 2020,
    shelfLocation: "Rak Sains S-11",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Penjelasan terperinci mengenai metabolisme sel, enzim, protein, DNA/RNA, serta keterkaitannya dengan kesehatan manusia.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "20",
    title: "Teori Relativitas Einstein untuk Orang Awam",
    author: "Albert Einstein (Terjemahan)",
    category: "Sains",
    year: 2017,
    shelfLocation: "Rak Sains S-07",
    totalCopies: 5,
    availableCopies: 4,
    synopsis: "Ditulis langsung oleh sang penemu untuk menjelaskan relativitas khusus dan umum tanpa rumus matematika yang rumit.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "21",
    title: "Ekologi & Perubahan Iklim Global",
    author: "Dr. Emil Salim",
    category: "Sains",
    year: 2019,
    shelfLocation: "Rak Sains S-15",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Analisis dampak pemanasan global terhadap keanekaragaman hayati Indonesia serta pentingnya pembangunan berkelanjutan.",
    rating: 4.3,
    reviews: []
  },
  {
    id: "22",
    title: "Sapiens: Riwayat Singkat Umat Manusia",
    author: "Yuval Noah Harari (Terjemahan)",
    category: "Sejarah",
    year: 2017,
    shelfLocation: "Rak Sejarah H-01",
    totalCopies: 10,
    availableCopies: 10,
    synopsis: "Buku fenomenal yang merangkum sejarah peradaban manusia sejak zaman revolusi kognitif hingga era bioteknologi modern.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "23",
    title: "Gajah Mada: Biografi Politik Sang Mahapatih",
    author: "Muhammad Yamin",
    category: "Sejarah",
    year: 2018,
    shelfLocation: "Rak Sejarah H-04",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Analisis historis kepemimpinan Gajah Mada dalam mewujudkan Sumpah Palapa untuk mempersatukan wilayah Nusantara di bawah Majapahit.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "24",
    title: "Jalur Rempah: Jejak Peradaban Dunia di Nusantara",
    author: "Taufik Abdullah",
    category: "Sejarah",
    year: 2021,
    shelfLocation: "Rak Sejarah H-07",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Menyingkap sejarah perdagangan rempah-rempah yang menempatkan kepulauan Nusantara sebagai poros diplomasi dan kolonialisme barat.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "25",
    title: "Sejarah Dunia yang Disembunyikan",
    author: "Jonathan Black (Terjemahan)",
    category: "Sejarah",
    year: 2015,
    shelfLocation: "Rak Sejarah H-10",
    totalCopies: 8,
    availableCopies: 8,
    synopsis: "Menyelidiki berbagai mitos kuno, perkumpulan rahasia, serta penafsiran sejarah alternatif dari sudut pandang hermetisisme.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "26",
    title: "Bung Karno: Penyambung Lidah Rakyat Indonesia",
    author: "Cindy Adams",
    category: "Sejarah",
    year: 2014,
    shelfLocation: "Rak Sejarah H-02",
    totalCopies: 6,
    availableCopies: 5,
    synopsis: "Otobiografi resmi Presiden pertama Indonesia yang menceritakan perjuangan masa muda, pengasingan, hingga proklamasi kemederkaan.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "27",
    title: "Kerajaan-kerajaan Islam di Jawa",
    author: "Dr. Slamet Muljana",
    category: "Sejarah",
    year: 2019,
    shelfLocation: "Rak Sejarah H-09",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Eksplorasi berdirinya Demak, Pajang, Mataram, Cirebon, hingga Banten, serta proses asimilasi budaya lokal dengan ajaran Islam.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "28",
    title: "Revolusi Prancis: Lahirnya Demokrasi Modern",
    author: "Jean-Pierre Roux (Terjemahan)",
    category: "Sejarah",
    year: 2016,
    shelfLocation: "Rak Sejarah H-12",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Menceritakan tumbangnya monarki absolut Prancis di tahun 1789 yang merestrukturisasi sistem sosial-politik dunia secara masif.",
    rating: 4.4,
    reviews: []
  },
  {
    id: "29",
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    category: "Sastra & Filsafat",
    year: 2005,
    shelfLocation: "Rak Sastra S-02",
    totalCopies: 12,
    availableCopies: 11,
    synopsis: "Karya agung sastra Indonesia berlatar awal abad ke-20 yang menceritakan kisah cinta Minke dan Annelies di tengah pergulatan kolonial.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "30",
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    category: "Sastra & Filsafat",
    year: 2005,
    shelfLocation: "Rak Sastra S-04",
    totalCopies: 10,
    availableCopies: 9,
    synopsis: "Kisah mengharukan tentang perjuangan sepuluh anak di Belitung dalam menempuh pendidikan di sekolah swasta yang serba terbatas.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "31",
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    category: "Sastra & Filsafat",
    year: 2015,
    shelfLocation: "Rak Sastra S-06",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Sebuah novel realisme magis kompleks yang menelusuri sejarah kelam peperangan, patriarki, dan keturunan peradaban di Indonesia.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "32",
    title: "Dunia Sophie (Sophie's World)",
    author: "Jostein Gaarder (Terjemahan)",
    category: "Sastra & Filsafat",
    year: 2010,
    shelfLocation: "Rak Sastra S-08",
    totalCopies: 7,
    availableCopies: 6,
    synopsis: "Novel filsafat yang membawa pembaca dalam perjalanan menjelajahi sejarah pemikiran filsuf barat dari masa Yunani kuno hingga fajar abad ke-20.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "33",
    title: "Madilog: Materialisme, Dialektika, Logika",
    author: "Tan Malaka",
    category: "Sastra & Filsafat",
    year: 2014,
    shelfLocation: "Rak Sosial S-03",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Karya filsafat monumentil Tan Malaka yang memandu bangsa Indonesia untuk berpikir rasional dan ilmiah guna melepaskan diri dari mistisisme.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "34",
    title: "Saman",
    author: "Ayu Utami",
    category: "Sastra & Filsafat",
    year: 1998,
    shelfLocation: "Rak Sastra S-10",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Novel pemenang penghargaan yang membahas tentang seksualitas perempuan, kebebasan, perjuangan buruh, dan represi politik Orde Baru.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "35",
    title: "Ronggeng Dukuh Paruk",
    author: "Ahmad Tohari",
    category: "Sastra & Filsafat",
    year: 2003,
    shelfLocation: "Rak Sastra S-05",
    totalCopies: 6,
    availableCopies: 6,
    synopsis: "Trilogi novel sosiokultural yang mengisahkan Srintil dan Rasus dengan latar kehidupan dusun miskin yang luluh lantak akibat konflik politik 1965.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "36",
    title: "Hujan Bulan Juni: Kumpulan Puisi",
    author: "Sapardi Djoko Damono",
    category: "Sastra & Filsafat",
    year: 2015,
    shelfLocation: "Rak Sastra S-01",
    totalCopies: 8,
    availableCopies: 8,
    synopsis: "Koleksi puisi cinta liris paling romantis dan bersahaja dalam sastra Indonesia modern yang penuh kedalaman makna hidup.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "37",
    title: "Berani Tidak Disukai",
    author: "Ichiro Kishimi & Fumitake Koga (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2019,
    shelfLocation: "Rak Psikologi P-01",
    totalCopies: 9,
    availableCopies: 9,
    synopsis: "Panduan psikologi Adlerian yang mengajari kita melepaskan diri dari penilaian orang lain, berdamai dengan trauma, dan meraih kebebasan sejati.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "38",
    title: "Grit: Kekuatan Passion dan Kegigihan",
    author: "Angela Duckworth (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2018,
    shelfLocation: "Rak Psikologi P-03",
    totalCopies: 5,
    availableCopies: 4,
    synopsis: "Menunjukkan bahwa kunci kesuksesan jangka panjang bukanlah bakat murni, melainkan kombinasi istimewa antara ketabahan dan hasrat (Grit).",
    rating: 4.6,
    reviews: []
  },
  {
    id: "39",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2017,
    shelfLocation: "Rak Psikologi P-06",
    totalCopies: 6,
    availableCopies: 6,
    synopsis: "Buku legendaris tulisan psikiater penyintas kamp konsentrasi Nazi tentang pentingnya menemukan makna hidup dalam penderitaan terpahit sekalipun.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "40",
    title: "Think and Grow Rich: Berpikir dan Menjadi Kaya",
    author: "Napoleon Hill (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2016,
    shelfLocation: "Rak Psikologi P-08",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Formula sukses legendaris yang merangkum kebiasaan orang-orang terkaya di dunia untuk mengubah hasrat mental menjadi kenyataan fisik.",
    rating: 4.5,
    reviews: []
  },
  {
    id: "41",
    title: "Mindset: Mengubah Pola Pikir untuk Perubahan Besar",
    author: "Carol S. Dweck (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2018,
    shelfLocation: "Rak Psikologi P-02",
    totalCopies: 7,
    availableCopies: 6,
    synopsis: "Mengembangkan perbedaan pola pikir tetap (fixed mindset) vs pola pikir berkembang (growth mindset) yang membentuk kesuksesan hidup.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "42",
    title: "Seni Berbicara di Depan Umum: Public Speaking",
    author: "Dale Carnegie (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2015,
    shelfLocation: "Rak Psikologi P-10",
    totalCopies: 6,
    availableCopies: 6,
    synopsis: "Metode praktis mengatasi rasa takut, melatih artikulasi, serta menarik simpati pendengar dalam komunikasi profesional dan interpersonal.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "43",
    title: "Ikigai: Rahasia Hidup Bahagia & Panjang Umur ala Jepang",
    author: "Héctor García (Terjemahan)",
    category: "Pengembangan Diri",
    year: 2019,
    shelfLocation: "Rak Psikologi P-05",
    totalCopies: 8,
    availableCopies: 8,
    synopsis: "Eksplorasi konsep Ikigai, yaitu pertemuan antara hasrat, misi, pekerjaan, dan keahlian untuk menemukan alasan bangun di pagi hari.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "44",
    title: "Rich Dad Poor Dad: Mengajarkan Keuangan pada Anak",
    author: "Robert T. Kiyosaki (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2016,
    shelfLocation: "Rak Bisnis B-01",
    totalCopies: 8,
    availableCopies: 8,
    synopsis: "Mengungkap miskonsepsi besar tentang kekayaan, perbedaan aset vs liabilitas, dan bagaimana membiarkan uang bekerja keras untuk kita.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "45",
    title: "The Intelligent Investor: Rekomendasi Investasi Nilai",
    author: "Benjamin Graham (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2018,
    shelfLocation: "Rak Bisnis B-04",
    totalCopies: 4,
    availableCopies: 4,
    synopsis: "Alkitab perdagangan saham legendaris yang memaparkan prinsip value investing demi menghindari jebakan bursa dan risiko pasar besar.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "46",
    title: "Zero to One: Catatan tentang Startup",
    author: "Peter Thiel (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2015,
    shelfLocation: "Rak Bisnis B-02",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Membahas pentingnya menciptakan inovasi baru yang mengubah monopoli industri dan menciptakan masa depan dari nol menjadi satu.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "47",
    title: "The Lean Startup: Memulai Bisnis Modern dengan Efisien",
    author: "Eric Ries (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2016,
    shelfLocation: "Rak Bisnis B-05",
    totalCopies: 6,
    availableCopies: 6,
    synopsis: "Kerangka manajemen inovatif menggunakan iterasi cepat, Minimum Viable Product (MVP), dan pembelajaran terukur dalam startup.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "48",
    title: "Good to Great: Mengapa Ada Perusahaan Lompat Kelas",
    author: "Jim Collins (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2017,
    shelfLocation: "Rak Bisnis B-07",
    totalCopies: 3,
    availableCopies: 3,
    synopsis: "Penelitian mendalam tentang bagaimana perusahaan biasa-biasa saja bertransformasi menjadi perusahaan raksasa yang bertahan puluhan tahun.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "49",
    title: "Psychology of Money: Pelajaran Abadi tentang Keuangan",
    author: "Morgan Housel (Terjemahan)",
    category: "Bisnis & Keuangan",
    year: 2021,
    shelfLocation: "Rak Bisnis B-10",
    totalCopies: 10,
    availableCopies: 9,
    synopsis: "Eksplorasi perilaku emosional manusia terhadap uang, ego, keserakahan, serta cara bijak mengelola kekayaan berkelanjutan.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "50",
    title: "Pemasaran 5.0: Teknologi untuk Kemanusiaan",
    author: "Philip Kotler & Hermawan Kartajaya",
    category: "Bisnis & Keuangan",
    year: 2021,
    shelfLocation: "Rak Bisnis B-03",
    totalCopies: 5,
    availableCopies: 5,
    synopsis: "Mengintegrasikan taktik pemasaran manusiawi dengan teknologi mutakhir (AI, big data, AR/VR) untuk memenangkan persaingan bisnis digital.",
    rating: 4.8,
    reviews: []
  }
];

const DEFAULT_LOANS: Loan[] = [
  {
    id: "loan-1",
    bookId: "1",
    bookTitle: "Belajar React dan Next.js Modern",
    memberId: "M-101",
    memberName: "Achmad Naufal",
    borrowDate: "2026-06-01",
    dueDate: "2026-06-08",
    returnDate: "2026-06-07",
    status: "returned"
  },
  {
    id: "loan-2",
    bookId: "3",
    bookTitle: "Filosofi Teras: Hidup Tenang ala Stoisisme",
    memberId: "M-101",
    memberName: "Achmad Naufal",
    borrowDate: "2026-06-04",
    dueDate: "2026-06-11",
    returnDate: null,
    status: "borrowed"
  },
  {
    id: "loan-3",
    bookId: "4",
    bookTitle: "Sejarah Ringkas Nusantara",
    memberId: "M-101",
    memberName: "Achmad Naufal",
    borrowDate: "2026-05-15",
    dueDate: "2026-05-22",
    returnDate: null,
    status: "overdue"
  },
  {
    id: "loan-4",
    bookId: "5",
    bookTitle: "Fisika Kuantum & Misteri Semesta",
    memberId: "M-101",
    memberName: "Achmad Naufal",
    borrowDate: "2026-06-05",
    dueDate: "2026-06-12",
    returnDate: null,
    status: "borrowed"
  }
];

function readDB(): AppDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read DB, using defaults.", error);
  }
  const defaultDB: AppDatabase = {
    books: DEFAULT_BOOKS,
    loans: DEFAULT_LOANS,
    statistics: {
      monthlyTarget: 15,
      loansByCategory: {
        "Teknologi": 14,
        "Sastra & Filsafat": 10,
        "Sejarah": 6,
        "Sains": 9,
        "Pengembangan Diri": 12,
        "Bisnis & Keuangan": 4
      }
    }
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: AppDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file", error);
  }
}

// APIs
app.get("/api/books", (_req: any, res: { json: (arg0: Book[]) => void; }) => {
  const db = readDB();
  res.json(db.books);
});

// Admin add book
app.post("/api/books", (req: { body: { title: any; author: any; category: string | number; year: any; shelfLocation: any; totalCopies: any; synopsis: any; coverUrl: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: Book): void; new(): any; }; }; }) => {
  const db = readDB();
  const categoryCovers: { [key: string]: string } = {
    "Teknologi": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    "Sains": "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
    "Sejarah": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
    "Sastra & Filsafat": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
    "Pengembangan Diri": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop",
    "Bisnis & Keuangan": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop"
  };

  const category = req.body.category ? String(req.body.category) : "Fiksi";

  const newBook: Book = {
    id: `book-${Date.now()}`,
    title: req.body.title || "Judul Baru",
    author: req.body.author || "Anonim",
    category,
    year: Number(req.body.year) || new Date().getFullYear(),
    shelfLocation: req.body.shelfLocation || "Rak Baru",
    totalCopies: Number(req.body.totalCopies) || 1,
    availableCopies: Number(req.body.totalCopies) || 1,
    synopsis: req.body.synopsis || "Belum ada sinopsis buku.",
    rating: 5,
    reviews: [],
    coverUrl: req.body.coverUrl || categoryCovers[category] || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"
  };

  db.books.push(newBook);
  saveDB(db);
  res.status(201).json(newBook);
});

// Admin Edit book
app.put("/api/books/:id", (req: { params: { id: string; }; body: { title: undefined; author: undefined; category: undefined; year: undefined; shelfLocation: undefined; totalCopies: undefined; synopsis: undefined; availableCopies: undefined; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { title: any; author: any; category: any; year: number; shelfLocation: any; totalCopies: number; synopsis: any; availableCopies: number; id: string; rating: number; reviews: Review[]; coverUrl?: string; }) => void; }) => {
  const db = readDB();
  const bookIndex = db.books.findIndex(b => b.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  const existingBook = db.books[bookIndex];
  const updatedBook = {
    ...existingBook,
    title: req.body.title !== undefined ? req.body.title : existingBook.title,
    author: req.body.author !== undefined ? req.body.author : existingBook.author,
    category: req.body.category !== undefined ? req.body.category : existingBook.category,
    year: req.body.year !== undefined ? Number(req.body.year) : existingBook.year,
    shelfLocation: req.body.shelfLocation !== undefined ? req.body.shelfLocation : existingBook.shelfLocation,
    totalCopies: req.body.totalCopies !== undefined ? Number(req.body.totalCopies) : existingBook.totalCopies,
    synopsis: req.body.synopsis !== undefined ? req.body.synopsis : existingBook.synopsis,
    availableCopies: req.body.availableCopies !== undefined ? Number(req.body.availableCopies) : (req.body.totalCopies !== undefined ? Number(req.body.totalCopies) - (existingBook.totalCopies - existingBook.availableCopies) : existingBook.availableCopies)
  };

  db.books[bookIndex] = updatedBook;
  saveDB(db);
  res.json(updatedBook);
});

// Admin Delete Book
app.delete("/api/books/:id", (req: { params: { id: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { success: boolean; message: string; }) => void; }) => {
  const db = readDB();
  const filtered = db.books.filter(b => b.id !== req.params.id);
  if (filtered.length === db.books.length) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }
  db.books = filtered;
  db.loans = db.loans.filter(l => l.bookId !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: "Buku berhasil dihapus" });
});

// Borrow Online
app.post("/api/books/:id/borrow", (req: { params: { id: string; }; body: { memberId: string; memberName: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { loan: Loan; book: Book; }) => void; }) => {
  const db = readDB();
  const book = db.books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ message: "Stok buku sedang habis!" });
  }

  // Check if member already borrows this book active
  const memberId = req.body.memberId || "M-101";
  const memberName = req.body.memberName || "Achmad Naufal";
  const activeLoan = db.loans.find(l => l.bookId === book.id && l.memberId === memberId && l.status !== "returned");
  if (activeLoan) {
    return res.status(400).json({ message: "Anda sudah meminjam buku ini!" });
  }

  book.availableCopies -= 1;

  // Due date is 7 days from now
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 7);

  const formattedDate = (d: Date) => d.toISOString().split('T')[0];

  const newLoan: Loan = {
    id: `loan-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.title,
    memberId: memberId,
    memberName: memberName,
    borrowDate: formattedDate(today),
    dueDate: formattedDate(dueDate),
    returnDate: null,
    status: "borrowed"
  };

  db.loans.push(newLoan);

  // Update statistics
  const category = book.category || "Umum";
  db.statistics.loansByCategory[category] = (db.statistics.loansByCategory[category] || 0) + 1;

  saveDB(db);
  res.json({ loan: newLoan, book: book });
});

// Return Book
app.post("/api/loans/:id/return", (req: { params: { id: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { loan: Loan; book: Book | undefined; }) => void; }) => {
  const db = readDB();
  const loan = db.loans.find(l => l.id === req.params.id);
  if (!loan) {
    return res.status(404).json({ message: "Transaksi peminjaman tidak ditemukan" });
  }

  if (loan.status === "returned") {
    return res.status(400).json({ message: "Buku sudah dikembalikan sebelumnya!" });
  }

  const book = db.books.find(b => b.id === loan.bookId);
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  }

  loan.status = "returned";
  loan.returnDate = new Date().toISOString().split('T')[0];

  saveDB(db);
  res.json({ loan, book });
});

// Add Review
app.post("/api/books/:id/review", (req: { params: { id: string; }; body: { rating: any; user: string; comment: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: Book) => void; }) => {
  const db = readDB();
  const book = db.books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  const rating = Number(req.body.rating) || 5;
  const user = req.body.user || "Anonim";
  const comment = req.body.comment || "";

  const newReview: Review = {
    id: `review-${Date.now()}`,
    user,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  book.reviews.push(newReview);

  // Calculate new average rating
  const totalRating = book.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  book.rating = parseFloat((totalRating / book.reviews.length).toFixed(1));

  saveDB(db);
  res.json(book);
});

// Get Loan History / Member Profile Loans
app.get("/api/loans", (req: { query: { memberId: string; }; }, res: { json: (arg0: Loan[]) => void; }) => {
  const db = readDB();
  const memberId = req.query.memberId || "M-101";
  const filtered = db.loans.filter(l => l.memberId === memberId);
  res.json(filtered);
});

// Statistical Analytics Report
app.get("/api/stats", (_req: any, res: {
    json: (arg0: {
      booksCount: number; totalCopies: number; borrowedCount: number; overdueCount: number; monthlyTarget: number; categoryChartData: { name: string; value: number; }[];
      // Monthly trend simulation (Dec, Jan, Feb, Mar, Apr, May, Jun)
      monthlyLendingTrend: { month: string; loans: number; returns: number; }[];
    }) => void;
  }) => {
  const db = readDB();
  const booksCount = db.books.length;
  const totalCopies = db.books.reduce((acc, b) => acc + b.totalCopies, 0);
  const borrowedCount = db.loans.filter(l => l.status === "borrowed" || l.status === "overdue").length;
  const overdueCount = db.loans.filter(l => l.status === "overdue").length;

  res.json({
    booksCount,
    totalCopies,
    borrowedCount,
    overdueCount,
    monthlyTarget: db.statistics.monthlyTarget,
    categoryChartData: Object.entries(db.statistics.loansByCategory).map(([name, value]) => ({
      name,
      value
    })),
    // Monthly trend simulation (Dec, Jan, Feb, Mar, Apr, May, Jun)
    monthlyLendingTrend: [
      { month: "Jan", loans: 25, returns: 20 },
      { month: "Feb", loans: 32, returns: 28 },
      { month: "Mar", loans: 45, returns: 35 },
      { month: "Apr", loans: 38, returns: 32 },
      { month: "May", loans: 52, returns: 42 },
      { month: "Jun", loans: db.loans.length + 15, returns: db.loans.filter(l => l.status === "returned").length + 12 }
    ]
  });
});

// AI recommendation powered by Gemini AI
app.post("/api/ai/recommend", async (req: { body: { prompt: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; detail?: any; }): any; new(): any; }; }; json: (arg0: { explanation: string; recommendedBookIds: string[]; externalSuggestions: { title: string; author: string; reason: string; }[]; }) => any; }) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Isi input pencarian AI terlebih dahulu!" });
  }

  const db = readDB();
  // Formulate a clean description list of our current books to let AI choose from or recommend additional themes
  const bookListStr = db.books.map(b => `- "${b.title}" oleh ${b.author} (Kategori: ${b.category}, Tahun: ${b.year}, ID: ${b.id}, Sinopsis: ${b.synopsis})`).join("\n");

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Kamu adalah pustakawan AI yang pintar untuk perpustakaan "Smart Library". 
Seorang pengguna mencari buku dengan preferensi/pertanyaan berikut: "${prompt}"

Berikut daftar buku nyata yang ada di database perpustakan kita saat ini:
${bookListStr}

Berikan respon rekomendasi kustom dalam format JSON yang valid, dengan struktur berikut:
{
  "explanation": "Penjelasan ramah mengapa buku-buku ini cocok dengan preferensi pencari",
  "recommendedBookIds": ["id_buku_yang_cocok_dari_database"],
  "externalSuggestions": [
    {
      "title": "Buku rekomendasi tambahan di luar katalog jika ada",
      "author": "Penulis",
      "reason": "Alasan direkomendasikan"
    }
  ]
}

Aturan penting:
1. Pastikan output HANYA berupa JSON valid utuh tanpa markdown code blocks (\`\`\`json) atau teks pengantar lainnya, agar bisa langsung diparse menggunakan JSON.parse.
2. Kehadiran ID buku rekomendasi harus benar-benar persis menunjuk ke ID buku yang ada di atas jika memang ada kemiripan tema, minimal 1-2 buku dari database perpustakaan kita.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } catch (e) {
        console.error("JSON parsing failed, raw text:", responseText);
        // Fallback parser if markdown wrapping was still generated
        const cleanJSONText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJSONText);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({ error: "Koneksi ke AI terputus. Silakan coba sesaat lagi.", detail: err.message });
    }
  } else {
    // Elegant fallback mock AI system if GEMINI_API_KEY is not defined
    console.log("Using Mock AI recommendation since API key is not ready.");
    const query = prompt.toLowerCase();
    const recommendedBookIds: string[] = [];
    
    // Simple filter matching
    if (query.includes("react") || query.includes("coding") || query.includes("teknologi") || query.includes("komputer") || query.includes("web") || query.includes("ai")) {
      recommendedBookIds.push("1", "2");
    }
    if (query.includes("stoisisme") || query.includes("hidup") || query.includes("tenang") || query.includes("pikiran") || query.includes("filsafat") || query.includes("moral")) {
      recommendedBookIds.push("3");
    }
    if (query.includes("sejarah") || query.includes("indonesia") || query.includes("nusantara") || query.includes("kerajaan")) {
      recommendedBookIds.push("4");
    }
    if (query.includes("fisika") || query.includes("sains") || query.includes("kuantum") || query.includes("semesta") || query.includes("bintang")) {
      recommendedBookIds.push("5");
    }
    if (query.includes("kebiasaan") || query.includes("habits") || query.includes("disiplin") || query.includes("sukses")) {
      recommendedBookIds.push("6");
    }
    if (query.includes("bisnis") || query.includes("keuangan") || query.includes("startup") || query.includes("uang")) {
      recommendedBookIds.push("7");
    }

    // Default if no keyword match
    if (recommendedBookIds.length === 0) {
      recommendedBookIds.push("3", "6"); // Filosofi Teras and Atomic Habits
    }

    const mockResponse = {
      explanation: `Berdasarkan pencarian Anda mengenai "${prompt}", asisten pustakawan Smart Library menyarankan beberapa buku pengembangan diri dan literatur yang sangat relevan berikut dari koleksi kami.`,
      recommendedBookIds,
      externalSuggestions: [
        {
          title: "Sapiens: Riwayat Singkat Umat Manusia",
          author: "Yuval Noah Harari",
          reason: "Sangat baik untuk memahami perkembangan sejarah kognitif manusia secara luas dan menarik."
        }
      ]
    };
    return res.json(mockResponse);
  }
});

// Notifications list generator
app.get("/api/notifications", (_req: any, res: { json: (arg0: { id: string; type: string; title: string; message: string; time: string; read: boolean; }[]) => void; }) => {
  const db = readDB();
  const notifications = [];

  // Generate real-time warnings based on database state
  const overdueLoans = db.loans.filter(l => l.status === "overdue" || (l.status === "borrowed" && new Date(l.dueDate) < new Date()));
  overdueLoans.forEach(loan => {
    notifications.push({
      id: `notif-overdue-${loan.id}`,
      type: "alert",
      title: "Batas Waktu Terlewati!",
      message: `Buku "${loan.bookTitle}" yang dipinjam oleh ${loan.memberName} telah melewati jatuh tempo pengembalian (${loan.dueDate}). Mohon segera kembalikan ke perpustakaan.`,
      time: loan.dueDate,
      read: false
    });
  });

  const activeLoans = db.loans.filter(l => l.status === "borrowed" && new Date(l.dueDate) >= new Date());
  activeLoans.forEach(loan => {
    const dDate = new Date(loan.dueDate);
    const today = new Date();
    const diffTime = Math.abs(dDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      notifications.push({
        id: `notif-near-${loan.id}`,
        type: "warning",
        title: "Pengingat Pengembalian",
        message: `Peminjaman buku "${loan.bookTitle}" akan segera berakhir dalam ${diffDays} hari lagi (${loan.dueDate}).`,
        time: loan.dueDate,
        read: false
      });
    }
  });

  // Adding clean system messages
  notifications.push({
    id: "notif-sys-1",
    type: "info",
    title: "Sistem Optimal",
    message: "Integrasi sensor lokasi rak buku pintar dan visual-chart analytics backend aktif secara real-time.",
    time: new Date().toISOString().split('T')[0],
    read: true
  });

  res.json(notifications);
});

// Vite Middleware & production static assets serving handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server is mounted as middleware.");
  } else {
    // In production, serve index.html and assets compiled inside /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: any, res: { sendFile: (arg0: string) => void; }) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Library backend running perfectly on port ${PORT}`);
  });
}

startServer();
