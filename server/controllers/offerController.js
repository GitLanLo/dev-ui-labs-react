import Offer from '../models/offer.js';

async function getAllOffers(_req, res, next) {
  try {
    const offers = await Offer.findAll();
    return res.status(200).json(offers);
  } catch (error) {
    return next(error);
  }
}

export { getAllOffers };
