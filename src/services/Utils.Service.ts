import DBAdapter from "../adapters/DBAdapter";
import { IRequestQuery } from "../interfaces/requests/request.interface";

export default class UtilsService {

  static paginate(query: IRequestQuery, result: { items: any[], total: number }) {
    return {
      limit: query.limit,
      total: result.total,
      page: query.page,
      pages: Math.ceil(Number(result.total) / Number(query.limit))
    }
  }
}