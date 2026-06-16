export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Book {
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

export interface Loan {
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

export interface LibraryNotification {
  id: string;
  type: "info" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface LibraryStats {
  booksCount: number;
  totalCopies: number;
  borrowedCount: number;
  overdueCount: number;
  monthlyTarget: number;
  categoryChartData: { name: string; value: number }[];
  monthlyLendingTrend: { month: string; loans: number; returns: number }[];
}
