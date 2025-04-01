import { ApiSignature } from "../../../types";
import marketService from "../services/market.service";

const getMarketList: ApiSignature = async (req, res) => {
  const queries = req.query;

  const response = await marketService.getMarketList(queries);

  res.status(200).send(response);
};

const marketController = {
  getMarketList,
};

export default marketController;
