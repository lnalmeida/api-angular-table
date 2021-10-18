import { model, Schema, Document } from 'mongoose';
import { BankInterface } from './Bank';

export interface BankAccountInterface extends Document {
  accountNumber:string;
  accountHolder: string;
  bankId: BankInterface;
  IFSC: string;
}

const BankAccountSchema = new Schema({
  accountNumber: {
    type: String,
    required: [true, 'O número da conta é obrigaório'],
  },
  accountHolder: {
    type: String,
    required: [true, 'O Titular da conta é obrigaório'],
  },
  bankId: {
    type: Schema.Types.ObjectId,
    ref: 'Bank',
    required: [true, 'O campo banco é obrigatório'],
  },
  IFSC: {
    type: String,
    required: [true, 'O IFSC é obrigaório'],
  },

});

export default model<BankAccountInterface>('BankAccount', BankAccountSchema);
