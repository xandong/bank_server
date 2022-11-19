export interface TransactionModel {
  id?: string;
  valueInCents: number;
  createdAt: Date;
  debitedAccountId: string;
  creditedAccountId: string;
}
