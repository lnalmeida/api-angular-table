import { Request, Response, NextFunction } from 'express';

import BankAccount, { BankAccountInterface } from '../schemas/BankAccount';
import Controller from './Controller';
import ValidationService from '../services/ValidationService';
import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import HttpStatusCode from '../responses/HttpStatusCode';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';


class BankAccountController extends Controller {
  constructor() {
    super('/api/accounts');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/`, this.list);
    this.router.get(`${this.path}/:id`, this.show);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      // eslint-disable-next-line indent
        const bankAccounts = await BankAccount.find().populate('bankId');// eslint-disable-next-line indent
        // eslint-disable-next-line indent
        if (bankAccounts.length) return responseOk(res, bankAccounts);
      // eslint-disable-next-line indent
        next(new NoContentException());
    } catch (error) {
      // eslint-disable-next-line indent
        next(new ServerErrorException(error));
    }
  }

  private async show(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      // eslint-disable-next-line indent
        const { id } = req.params;// eslint-disable-next-line indent
        // eslint-disable-next-line indent
        if (ValidationService.validateId(id, next)) return;
      // eslint-disable-next-line indent
        const bankAccount = await BankAccount.findById(id);// eslint-disable-next-line indent
        // eslint-disable-next-line indent
        if (bankAccount) return responseOk(res, bankAccount);
      // eslint-disable-next-line indent
        next(new NoContentException());
      // eslint-disable-next-line indent
    } catch (error) {
      // eslint-disable-next-line indent
        // eslint-disable-next-line indent
        next(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction):Promise<Response> {
    try {
        let bankAccount: BankAccountInterface = req.body;
        bankAccount = await BankAccount.create(bankAccount);// eslint-disable-next
      // eslint-disable-next-line indent
      bankAccount = await BankAccount.findById(bankAccount.id).populate('bankId');
      // eslint-disable-next-line indent
        return responseCreate(res, bankAccount);
    } catch (error) {
      // eslint-disable-next-line indent
        // eslint-disable-next-line indent
        next(new ServerErrorException(error));
    }
  }

  private async update(req: Request, res: Response, next: NextFunction):Promise<Response> {
    try {
      // eslint-disable-next-line indent
        const { id } = req.params;
      // eslint-disable-next-line indent
        if (ValidationService.validateId(id, next)) return;

      // eslint-disable-next-line indent
        let bankAccount: BankAccountInterface = req.body;
      // eslint-disable-next-line indent
      bankAccount = await BankAccount.findByIdAndUpdate(id, bankAccount, { new: true });

      if (bankAccount) {
        // eslint-disable-next-line indent
          bankAccount = await BankAccount.findById(id).populate('bankId');
        // eslint-disable-next-line indent
          return responseOk(res, bankAccount);
      }

      // eslint-disable-next-line indent
        next(new NoContentException());
    } catch (error) {
      // eslint-disable-next-line indent
        next(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      // eslint-disable-next-line indent
        const { id } = req.params;
      // eslint-disable-next-line indent
        if (ValidationService.validateId(id, next)) return;
      // eslint-disable-next-line indent
        const bankAccount = await BankAccount.findByIdAndDelete(id);
      // eslint-disable-next-line indent
        if (!bankAccount) return res.status(HttpStatusCode.NO_CONTENT).send(new NoContentException());
      // eslint-disable-next-line indent
        return responseOk(res, bankAccount);
    } catch (error) {
      // eslint-disable-next-line indent
        // eslint-disable-next-line indent
        return res.send(new ServerErrorException(error));
    }
  }
}

export default BankAccountController;
