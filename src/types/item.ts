export type ClaimStatus = 'Belum Diklaim' | 'Sedang Diproses' | 'Sudah Diklaim';

export interface LostItem {
  id: string;
  name: string;
  category: string;
  location: string;
  dateFound: string;
  finderName: string;
  status: ClaimStatus;
}