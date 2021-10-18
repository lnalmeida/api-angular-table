import { model, Schema, Document } from 'mongoose';

export interface BankInterface extends Document {
  name:string;
}

const BankSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'O campo NOME é obrigatório']
  }
});

export default model<BankInterface>('Bank', BankSchema);
