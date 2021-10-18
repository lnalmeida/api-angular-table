import App from './app';
import BankAccountController from './controllers/BankAccountController';
import BankController from './controllers/BankController';

const app = new App([
  new BankController(),
  new BankAccountController(),
]);

app.listen(3333);
