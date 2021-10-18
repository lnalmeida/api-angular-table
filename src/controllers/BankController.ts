/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';

import Bank from '../schemas/Bank';
import Controller from './Controller';
import ValidationService from '../services/ValidationService';
import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import HttpStatusCode from '../responses/HttpStatusCode';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';

class BankController extends Controller {
  constructor() {
    super('/api/banks');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.show);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      // eslint-disable-next-line indent
        const banks = await Bank.find();// eslint-disable-next-line indent
        // eslint-disable-next-line indent
        if (banks) return responseOk(res, banks);
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
        const user = await Bank.findById(id);// eslint-disable-next-line indent
        // eslint-disable-next-line indent
        if (ValidationService.validateId(id, next)) return;
      // eslint-disable-next-line indent
        if (user) return responseOk(res, user);
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
      const { name } = req.body;

      const bankData = {
        name
      };
      // eslint-disable-next-line indent
        const bank = await Bank.create(bankData);// eslint-disable-next
      // eslint-disable-next-line indent
        return responseCreate(res, bank);
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
        const bank = await Bank.findById(id);

      if (bank) {
        // eslint-disable-next-line indent
          const updatedUser = await Bank.findByIdAndUpdate(id, req.body, { new: true });

        // eslint-disable-next-line indent
          return responseOk(res, updatedUser);
      }

      // eslint-disable-next-line indent
        next(new NoContentException());
    } catch (error) {
      // eslint-disable-next-line indent
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
        const bank = await Bank.findById(id);
      // eslint-disable-next-line indent
        if (!bank) return res.status(HttpStatusCode.NO_CONTENT).send(new NoContentException());

        bank.deleteOne();

        return responseOk(res, bank);

      // return res.status(200).send('Usuário deletado com sucesso.');
    } catch (error) {
        // eslint-disable-next-line indent
        return res.send(new ServerErrorException(error));
    }
  }
}

export default BankController;
