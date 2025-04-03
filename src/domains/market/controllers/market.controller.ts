import { ApiSignature } from "../../../types";
import { DecodedUser } from "../../auth/interfaces/auth.interface";
import marketService from "../services/market.service";

const getMarketList: ApiSignature = async (req, res) => {
  const queries = req.query;

  const response = await marketService.getMarketList(queries);

  res.status(200).send(response);
};

const getMarketMe: ApiSignature = async (req, res) => {
  const queries = req.query;
  const user = req.user as { id: string; role: string };

  const response = await marketService.getMarketMe(queries, user);

  res.status(200).send(response);
};

const marketController = {
  getMarketList,
  getMarketMe,
};

export default marketController;
